import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { consumeDailyQuota, DAILY_SHARE_LIMIT_PER_IP, dailyLimitMessage } from '@/lib/quota';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { normalizeClientName, userAgentFamily } from '@/lib/client-info';
import { createShare, deleteShare, ShareServiceError, updateShare } from '@/lib/share-service';
import { isExpired } from '@/lib/db';
import { getCachedShare } from '@/lib/share-cache';

const SERVER_INFO = {
  name: 'md-share',
  title: 'Docs MD',
  version: '1.2.0',
};

// Sent in the initialize result; MCP clients show it to the model as guidance for this server.
const SERVER_INSTRUCTIONS = `Docs MD publishes markdown at a public link (https://docs-md.com/<id>) with no account.
Use share_markdown when the user wants to send, publish, hand off or review a markdown document (plans, specs, reports, READMEs, agent handoffs). Default expiry is 30 days; use "never" only when asked for a permanent link.
Always give the user the URL and keep the edit token: it is the only way to update_share or delete_share later.
Use read_share to fetch the markdown of any docs-md.com link someone gives you (for example a handoff from another agent).
Anything shared is public to whoever has the link: never include passwords, API keys, card numbers or other people's personal data.`;

const PROTOCOL_VERSION = '2025-06-18';
const MAX_MCP_REQUEST_BYTES = Number(process.env.MAX_MCP_REQUEST_BYTES ?? 250_000);
const MAX_CONTENT_CHARS = Number(process.env.MAX_MARKDOWN_CHARS ?? 120_000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MCP_PER_WINDOW = Number(process.env.RATE_LIMIT_MCP_PER_WINDOW ?? 30);

const contentSchema = z
  .string()
  .trim()
  .min(1, 'content is required')
  .max(MAX_CONTENT_CHARS, `content exceeds ${MAX_CONTENT_CHARS} characters`);

const shareArgsSchema = z.object({
  content: contentSchema,
  filename: z.string().trim().max(120).optional(),
  expiry: z.enum(['1d', '7d', '30d', 'never']).optional().default('30d'),
});

const updateArgsSchema = z.object({
  id: z.string().trim().min(1, 'id is required'),
  edit_token: z.string().trim().min(1, 'edit_token is required'),
  content: contentSchema,
  filename: z.string().trim().max(120).optional(),
});

const readArgsSchema = z.object({
  id: z.string().trim().min(1, 'id is required'),
});

/** Accepts a bare id or any docs-md.com URL form (/<id>, /<id>.md, /raw/<id>). */
function shareIdFrom(value: string): string {
  const match = /([a-z]+-[a-z]+-[A-Za-z0-9]{5})(?:\.md)?\/?(?:[?#].*)?$/.exec(value.trim());
  return match ? match[1] : value.trim();
}

const deleteArgsSchema = z.object({
  id: z.string().trim().min(1, 'id is required'),
  edit_token: z.string().trim().min(1, 'edit_token is required'),
});

const rpcRequestSchema = z.object({
  method: z.string(),
  params: z.unknown().optional(),
  id: z.unknown().optional(),
});

const TOOL_DEFINITIONS = [
  {
    name: 'share_markdown',
    title: 'Share Markdown',
    description:
      'Publish markdown at a public docs-md.com link that renders it (tables, code, mermaid diagrams, table of contents). Use it to send a plan, spec, report, README or agent handoff to a person or another agent. Returns the URL, a raw-markdown URL and an edit token for later updates or deletion.',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The markdown content to share (up to 120,000 characters)',
        },
        filename: {
          type: 'string',
          description: 'Optional file name shown as the page title, e.g. "HANDOFF.md" or "plan.md"',
        },
        expiry: {
          type: 'string',
          enum: ['1d', '7d', '30d', 'never'],
          description: 'How long the link stays live (default 30d; "never" keeps it forever)',
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'update_share',
    title: 'Update Shared Markdown',
    description: 'Replace the content of an existing share using its id and edit token.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The share id (the URL path segment)' },
        edit_token: { type: 'string', description: 'Edit token returned when the share was created' },
        content: { type: 'string', description: 'The new markdown content' },
        filename: { type: 'string', description: 'Optional new filename' },
      },
      required: ['id', 'edit_token', 'content'],
    },
  },
  {
    name: 'read_share',
    title: 'Read Shared Markdown',
    description:
      'Fetch the raw markdown of a docs-md.com share. Accepts the share id or any docs-md.com share URL. Use it when someone gives you a docs-md.com link, for example a handoff written by another agent.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Share id (e.g. calm-river-Ab12C) or a docs-md.com share URL' },
      },
      required: ['id'],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'delete_share',
    title: 'Delete Shared Markdown',
    description: 'Permanently delete a share using its id and edit token.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The share id (the URL path segment)' },
        edit_token: { type: 'string', description: 'Edit token returned when the share was created' },
      },
      required: ['id', 'edit_token'],
    },
  },
];

function toolTextResult(id: unknown, text: string, isError = false) {
  return NextResponse.json({
    jsonrpc: '2.0',
    id,
    result: {
      content: [{ type: 'text', text }],
      ...(isError ? { isError: true } : {}),
    },
  });
}

function invalidParamsError(id: unknown, message: string) {
  return NextResponse.json({
    jsonrpc: '2.0',
    id,
    error: { code: -32602, message },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateResult = checkRateLimit({
      key: `mcp:${ip}`,
      limit: RATE_LIMIT_MCP_PER_WINDOW,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Rate limit exceeded. Please retry later.',
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateResult.retryAfterSeconds),
          },
        }
      );
    }

    const payload = await parseJsonBodyWithLimit<unknown>(request, MAX_MCP_REQUEST_BYTES);
    const parsedRpc = rpcRequestSchema.safeParse(payload);

    if (!parsedRpc.success) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32600,
            message: 'Invalid request payload',
          },
        },
        { status: 400 }
      );
    }

    const { method, params, id } = parsedRpc.data;

    // JSON-RPC notifications (no id), e.g. notifications/initialized, get no response body.
    if (id === undefined || method.startsWith('notifications/')) {
      return new NextResponse(null, { status: 202 });
    }

    if (method === 'ping') {
      return NextResponse.json({ jsonrpc: '2.0', id, result: {} });
    }

    // Handle initialize
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {
            tools: {},
          },
          serverInfo: SERVER_INFO,
          instructions: SERVER_INSTRUCTIONS,
        },
      });
    }

    // Handle tools/list
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOL_DEFINITIONS,
        },
      });
    }

    // Handle tools/call
    if (method === 'tools/call') {
      const callParams = z
        .object({
          name: z.string(),
          arguments: z.unknown().optional(),
        })
        .safeParse(params);

      if (!callParams.success) {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32602,
            message: 'Invalid tool call parameters',
          },
        });
      }

      const { name, arguments: args } = callParams.data;

      try {
        if (name === 'share_markdown') {
          const parsedArgs = shareArgsSchema.safeParse(args);
          if (!parsedArgs.success) {
            return invalidParamsError(id, parsedArgs.error.issues[0]?.message ?? 'Invalid tool arguments');
          }

          const quota = await consumeDailyQuota('share', ip, DAILY_SHARE_LIMIT_PER_IP);
          if (!quota.allowed) {
            return toolTextResult(id, `✗ ${dailyLimitMessage(quota.limit)}`, true);
          }

          const { content, filename, expiry } = parsedArgs.data;
          const share = await createShare(content, filename, expiry, {
            client: 'mcp',
            ref: normalizeClientName(request.headers.get('x-client')),
            ua: userAgentFamily(request.headers.get('user-agent')),
          });
          const expiresLine =
            share.expiresAt === 0
              ? 'Expires: never'
              : `Expires: ${new Date(share.expiresAt).toLocaleDateString()}`;

          return toolTextResult(
            id,
            `✓ Markdown shared successfully!\n\n${share.url}\n\nRaw: ${share.rawUrl}\n${expiresLine}\n\nEdit token (keep it to update or delete this share later): ${share.editToken}`
          );
        }

        if (name === 'update_share') {
          const parsedArgs = updateArgsSchema.safeParse(args);
          if (!parsedArgs.success) {
            return invalidParamsError(id, parsedArgs.error.issues[0]?.message ?? 'Invalid tool arguments');
          }

          const { id: shareId, edit_token, content, filename } = parsedArgs.data;
          const { url } = await updateShare(shareId, edit_token, content, filename);
          return toolTextResult(id, `✓ Share updated.\n\n${url}`);
        }

        if (name === 'read_share') {
          const parsedArgs = readArgsSchema.safeParse(args);
          if (!parsedArgs.success) {
            return invalidParamsError(id, parsedArgs.error.issues[0]?.message ?? 'Invalid tool arguments');
          }

          const cached = await getCachedShare(shareIdFrom(parsedArgs.data.id));
          if (!cached || cached.content === null || isExpired(cached.share, Date.now())) {
            return toolTextResult(id, '✗ Share not found (it may have expired or been deleted)', true);
          }
          return toolTextResult(id, cached.content);
        }

        if (name === 'delete_share') {
          const parsedArgs = deleteArgsSchema.safeParse(args);
          if (!parsedArgs.success) {
            return invalidParamsError(id, parsedArgs.error.issues[0]?.message ?? 'Invalid tool arguments');
          }

          const { id: shareId, edit_token } = parsedArgs.data;
          await deleteShare(shareId, edit_token);
          return toolTextResult(id, `✓ Share ${shareId} deleted.`);
        }

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32602,
            message: `Unknown tool: ${name}`,
          },
        });
      } catch (error) {
        if (error instanceof ShareServiceError) {
          return toolTextResult(id, `✗ ${error.message}`, true);
        }
        console.error('MCP tool error:', error);
        return toolTextResult(id, '✗ Failed: internal error, please retry in a moment.', true);
      }
    }

    // Unknown method
    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`,
      },
    });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          error: {
            code: error.status === 413 ? -32600 : -32700,
            message: error.message,
          },
          id: null,
        },
        { status: error.status }
      );
    }

    console.error('MCP Error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error',
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

// Handle GET for SSE connections
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send server info as SSE
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'server/info',
        params: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        },
      });
      
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      // Close immediately: we never push server-initiated messages, and an
      // open stream would be held by clients until the function max duration.
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// CORS
export async function OPTIONS() {
  const allowedOrigins = (process.env.MCP_ALLOWED_ORIGINS ?? 'https://docs-md.com,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim());

  const allowOrigin = allowedOrigins[0] || 'https://docs-md.com';
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
    },
  });
}

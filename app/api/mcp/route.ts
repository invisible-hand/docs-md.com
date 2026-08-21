import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { createShare, deleteShare, ShareServiceError, updateShare } from '@/lib/share-service';

const SERVER_INFO = {
  name: 'md-share',
  version: '1.1.0',
};

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
      'Share a markdown file and get a public URL. Returns an edit token that can be used later to update or delete the share.',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The markdown content to share',
        },
        filename: {
          type: 'string',
          description: 'Optional filename for the markdown file',
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

          const { content, filename, expiry } = parsedArgs.data;
          const share = await createShare(content, filename, expiry);
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return toolTextResult(id, `✗ Failed: ${errorMessage}`, true);
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
          message: error instanceof Error ? error.message : 'Internal error',
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

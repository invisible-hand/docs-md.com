import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbOperations } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, normalizeFilename, parseJsonBodyWithLimit, RequestBodyError } from '@/lib/security';
import { storageOperations } from '@/lib/storage';
import { generateSlug } from '@/lib/slug-generator';

const SERVER_INFO = {
  name: 'md-share',
  version: '1.0.0',
};

const PROTOCOL_VERSION = '2025-06-18';
const MAX_MCP_REQUEST_BYTES = Number(process.env.MAX_MCP_REQUEST_BYTES ?? 250_000);
const MAX_CONTENT_CHARS = Number(process.env.MAX_MARKDOWN_CHARS ?? 120_000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MCP_PER_WINDOW = Number(process.env.RATE_LIMIT_MCP_PER_WINDOW ?? 30);

const toolCallSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'content is required')
    .max(MAX_CONTENT_CHARS, `content exceeds ${MAX_CONTENT_CHARS} characters`),
  filename: z.string().trim().max(120).optional(),
});

const rpcRequestSchema = z.object({
  method: z.string(),
  params: z.unknown().optional(),
  id: z.unknown().optional(),
});

const TOOL_DEFINITION = {
  name: 'share_markdown',
  title: 'Markdown File Sharing',
  description: 'Share a markdown file and get a public URL that expires in 30 days',
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
    },
    required: ['content'],
  },
};

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
          tools: [TOOL_DEFINITION],
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

      if (name !== 'share_markdown') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32602,
            message: `Unknown tool: ${name}`,
          },
        });
      }

      try {
        const parsedArgs = toolCallSchema.safeParse(args);
        if (!parsedArgs.success) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: parsedArgs.error.issues[0]?.message ?? 'Invalid tool arguments',
            },
          });
        }

        const { content, filename } = parsedArgs.data;

        // Generate unique friendly slug
        let shareId = generateSlug();
        
        // Ensure uniqueness
        let attempts = 0;
        while (await dbOperations.getShare(shareId) && attempts < 5) {
          shareId = generateSlug();
          attempts++;
        }

        // Save markdown file and get blob URL
        const blobUrl = await storageOperations.saveMarkdown(shareId, content);

        // Save metadata to database
        const share = await dbOperations.createShare(shareId, normalizeFilename(filename), blobUrl);

        // Get base URL - always use custom domain in production
        const baseUrl = process.env.VERCEL_ENV === 'production' 
          ? 'https://docs-md.com' 
          : 'http://localhost:3000';
        const shareUrl = `${baseUrl}/${shareId}`;

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `✓ Markdown shared successfully!\n\n${shareUrl}\n\nExpires: ${new Date(share.expires_at).toLocaleDateString()}\n\nCopy the link above to share with others.`,
              },
            ],
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `✗ Failed to share: ${errorMessage}`,
              },
            ],
            isError: true,
          },
        });
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

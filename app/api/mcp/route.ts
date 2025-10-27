import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
import { generateSlug } from '@/lib/slug-generator';

const SERVER_INFO = {
  name: 'md-share',
  version: '1.0.0',
};

const PROTOCOL_VERSION = '2024-11-05';

const TOOL_DEFINITION = {
  name: 'share_markdown',
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
    const { method, params, id } = await request.json();

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
      const { name, arguments: args } = params;

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
        const { content, filename } = args as { content: string; filename?: string };

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
        const share = await dbOperations.createShare(shareId, filename || 'untitled.md', blobUrl);

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
                text: `✓ Markdown shared successfully!\n\nURL: ${shareUrl}\nExpires: ${new Date(share.expires_at).toLocaleString()}\n\nShare this link with others.`,
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
export async function GET(request: NextRequest) {
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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

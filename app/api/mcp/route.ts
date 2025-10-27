import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params, id } = body;

    // Handle initialize request
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'md-share',
            version: '1.0.0',
          },
        },
      });
    }

    // Handle tools/list request
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: [
            {
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
            },
          ],
        },
      });
    }

    // Handle tools/call request
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

        // Generate unique ID
        const shareId = nanoid(10);

        // Save markdown file
        storageOperations.saveMarkdown(shareId, content);

        // Save metadata to database
        const share = dbOperations.createShare(shareId, filename || 'untitled.md');

        // Get base URL from environment or request
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
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
    console.error('MCP Server Error:', error);
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

// Handle GET for SSE-based connections
export async function GET(request: NextRequest) {
  return new NextResponse('MCP server requires POST requests', {
    status: 405,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


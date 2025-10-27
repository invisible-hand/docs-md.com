import { NextRequest, NextResponse } from 'next/server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from '@/lib/mcp-server';

export async function POST(request: NextRequest) {
  try {
    // Get base URL for constructing share links
    const baseUrl = process.env.BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // Create MCP server instance
    const mcpServer = createMcpServer(baseUrl);

    // Parse request body
    const body = await request.json();

    // Create transport
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    // Create a mock response object to collect the MCP response
    const chunks: any[] = [];
    const mockRes = {
      write: (chunk: any) => {
        chunks.push(chunk);
      },
      end: (chunk?: any) => {
        if (chunk) chunks.push(chunk);
      },
      setHeader: () => {},
      writeHead: () => {},
      on: () => {},
    };

    // Connect server to transport
    await mcpServer.connect(transport);

    // Handle the request
    await transport.handleRequest(request as any, mockRes as any, body);

    // Get the response data
    const responseData = chunks.join('');
    
    try {
      const jsonResponse = JSON.parse(responseData);
      return NextResponse.json(jsonResponse);
    } catch {
      return new NextResponse(responseData, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('MCP Server Error:', error);
    return NextResponse.json(
      { 
        error: 'MCP server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


import { createMcpHandler } from 'mcp-handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { clientIp, platformOfIp, registerTools } from '@/lib/mcp/server';
import { SERVER_INFO, SERVER_INSTRUCTIONS } from '@/lib/mcp/tools';
import { withRequestScope } from '@/lib/share-cache';

// The Docs MD MCP server (docs/agent-protocol.md). Reached as /mcp (rewrite in next.config.ts)
// and /api/mcp. Stateless Streamable HTTP: mcp-handler serves the 2026-07-28 revision natively
// and the 2025 revisions through the SDK's stateless fallback, so there are no sessions and GET
// answers 405. Identity is the agent_key tool argument, not an HTTP credential.

const MAX_REQUEST_BYTES = Number(process.env.MAX_MCP_REQUEST_BYTES ?? 300_000);
const BURST_PER_MINUTE = Number(process.env.RATE_LIMIT_MCP_PER_WINDOW ?? 120);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Mcp-Method, Mcp-Name, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Max-Age': '86400',
} as const;

const mcp = createMcpHandler((server) => registerTools(server), {
  serverInfo: SERVER_INFO,
  instructions: SERVER_INSTRUCTIONS,
});

function rpcError(status: number, code: number, message: string, headers: Record<string, string> = {}): Response {
  return Response.json({ jsonrpc: '2.0', id: null, error: { code, message } }, { status, headers: { ...CORS, ...headers } });
}

async function handle(request: Request): Promise<Response> {
  if (request.method === 'POST') {
    if (Number(request.headers.get('content-length') ?? 0) > MAX_REQUEST_BYTES) {
      return rpcError(413, -32600, `Request body is larger than ${MAX_REQUEST_BYTES} bytes.`);
    }
    // A per-instance burst guard against runaway loops. Hosted platforms send every user's calls
    // from the same few addresses, so they are exempt; daily and per-minute write limits are
    // enforced per agent in Postgres (lib/share-service.ts).
    const ip = clientIp(request.headers);
    if (!(await platformOfIp(ip))) {
      const rate = checkRateLimit({ key: `mcp:${ip}`, limit: BURST_PER_MINUTE, windowMs: 60_000 });
      if (!rate.allowed) {
        return rpcError(429, -32000, 'Too many requests from this address. Retry in a minute.', { 'Retry-After': String(rate.retryAfterSeconds) });
      }
    }
  }
  const response = await mcp(withRequestScope(request));
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export { handle as GET, handle as POST, handle as DELETE };

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS });
}

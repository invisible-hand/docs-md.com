import { checkRateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/mcp/server';
import { ROOM_HEADERS, roomErrorResponse } from '@/lib/room-http';
import { createRoomFromWeb } from '@/lib/room-service';

// The "Start a room" button. It creates an empty, untitled room and returns its invite link once;
// a person hands that link to their agents. No text is accepted here: only agents post, through
// the MCP server (docs/agent-protocol.md, "Rooms").

export async function POST(request: Request): Promise<Response> {
  // Only the site's own button may ask: a JSON content type cannot be sent by a form on another
  // site, and a script there would need a CORS preflight that this route does not answer.
  if (!/^application\/json\b/i.test(request.headers.get('content-type') ?? '')) {
    return Response.json({ error: 'invalid_input', message: 'Send the request with Content-Type: application/json.' }, { status: 415, headers: ROOM_HEADERS });
  }
  const ip = clientIp(request.headers);
  const burst = checkRateLimit({ key: `room-create:${ip}`, limit: 5, windowMs: 60_000 });
  if (!burst.allowed) {
    return Response.json(
      { error: 'rate_limited', message: 'Too many rooms from this address in a minute. Wait a minute.' },
      { status: 429, headers: { ...ROOM_HEADERS, 'Retry-After': String(burst.retryAfterSeconds) } },
    );
  }
  try {
    const room = await createRoomFromWeb(ip);
    return Response.json({ room_id: room.room_id, url: room.url, invite: room.invite, room_key: room.room_key, expires_at: room.expires_at, ttl: room.ttl }, { headers: ROOM_HEADERS });
  } catch (error) {
    return roomErrorResponse(error);
  }
}

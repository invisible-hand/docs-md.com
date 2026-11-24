import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { callerFrom, clientIp } from '@/lib/mcp/server';
import { ROOM_HEADERS, roomErrorResponse } from '@/lib/room-http';
import { parseRoomRef, readRoom } from '@/lib/room-service';

// Read access for the room page (app/(en)/r/[id]): a person who opened an invite link watches the
// thread. The key travels in the request body, never in the URL. Same data as the MCP tool
// read_room; nothing is marked as read because no agent is reading.

export const maxDuration = 60;

const Body = z.object({
  room: z.string().trim().min(1).max(400),
  room_key: z.string().trim().max(60).optional(),
  after: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  /** The page waits in shorter turns than an agent may: 25 seconds at most. */
  wait_seconds: z.number().int().min(0).max(25).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request.headers);
  const burst = checkRateLimit({ key: `room-read:${ip}`, limit: 90, windowMs: 60_000 });
  if (!burst.allowed) {
    return Response.json(
      { error: 'rate_limited', message: 'Too many requests from this address. Retry in a minute.' },
      { status: 429, headers: { ...ROOM_HEADERS, 'Retry-After': String(burst.retryAfterSeconds) } },
    );
  }
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return Response.json({ error: 'invalid_input', message: 'Send JSON with "room" (id or invite link) and "room_key".' }, { status: 400, headers: ROOM_HEADERS });
  }
  try {
    const read = await readRoom(parseRoomRef(body.room), { roomKey: body.room_key }, { after: body.after, limit: body.limit, waitSeconds: body.wait_seconds }, await callerFrom(request));
    return Response.json(read, { headers: ROOM_HEADERS });
  } catch (error) {
    return roomErrorResponse(error);
  }
}

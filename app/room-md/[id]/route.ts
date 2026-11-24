import { callerFrom } from '@/lib/mcp/server';
import { ROOM_HEADERS, roomErrorResponse } from '@/lib/room-http';
import { joinInstructions, readRoom, renderTranscript, ROOM_ID_RE, ROOM_KEY_RE, type RoomRead } from '@/lib/room-service';

// /r/<id>.md, and /r/<id> when the request says "Accept: text/markdown" (rewrites in next.config.ts).
// An agent that fetches a room link cannot send the key (it sits after "#"), so without a key this
// answers with how to join. With the key in an Authorization header it returns the thread as markdown.

export const dynamic = 'force-dynamic';

const MARKDOWN = { ...ROOM_HEADERS, 'Content-Type': 'text/markdown; charset=utf-8', Vary: 'Accept, Authorization' };

export async function GET(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await context.params;
  if (!ROOM_ID_RE.test(id)) return new Response('Not found\n', { status: 404, headers: { ...ROOM_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } });

  const bearer = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') ?? '')?.[1];
  const key = bearer ?? request.headers.get('x-room-key')?.trim() ?? undefined;
  if (!key || !ROOM_KEY_RE.test(key)) return new Response(joinInstructions(id), { headers: MARKDOWN });

  try {
    const caller = await callerFrom(request);
    // The whole thread, oldest first, a page at a time.
    let read: RoomRead = await readRoom({ id, key }, {}, { after: 0, limit: 100 }, caller);
    const all = [...read.messages];
    for (let page = 0; read.has_more && page < 30; page++) {
      read = await readRoom({ id, key }, {}, { after: read.cursor, limit: 100 }, caller);
      all.push(...read.messages);
    }
    return new Response(renderTranscript({ ...read, messages: all }), { headers: MARKDOWN });
  } catch (error) {
    return roomErrorResponse(error);
  }
}

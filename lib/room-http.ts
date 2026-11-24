import { AgentError, type ErrorCode } from '@/lib/agent-policy';

// Shared by the room page's JSON endpoints (app/api/rooms/*) and the markdown twin (/r/<id>.md).

const STATUS: Partial<Record<ErrorCode, number>> = {
  not_found: 404,
  forbidden: 403,
  room_key_required: 401,
  room_key_invalid: 403,
  room_closed: 409,
  room_full: 409,
  quota_exceeded: 429,
  rate_limited: 429,
  invalid_input: 400,
};

/** Nothing about a room may be cached or indexed, whoever asks. */
export const ROOM_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
} as const;

export function roomErrorResponse(error: unknown): Response {
  if (error instanceof AgentError) {
    return Response.json({ error: error.code, message: error.message }, { status: STATUS[error.code] ?? 400, headers: ROOM_HEADERS });
  }
  console.error('Room endpoint error:', error);
  return Response.json({ error: 'internal_error', message: 'The server failed while handling this request. Retry once after a short wait.' }, { status: 500, headers: ROOM_HEADERS });
}

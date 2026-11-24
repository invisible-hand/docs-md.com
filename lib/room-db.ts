import { currentSql } from './db';

// Data layer for rooms (docs/agent-protocol.md, "Rooms"). Four tables, all new and all additive:
// rooms, room_messages, room_members, and room_stats_daily (counts only, kept after rooms expire). Every statement that must be atomic is one SQL statement,
// like the rest of the data layer (the driver has no transactions over HTTP).

type Sql = ReturnType<typeof currentSql>;
// Resolved on every call so tests can point the whole data layer at a local Postgres.
const sql = ((strings: TemplateStringsArray, ...values: never[]) => currentSql()(strings, ...values)) as unknown as Sql;
const query = (text: string, params: unknown[]) => currentSql().query(text, params as never[]);

export interface Room {
  id: string;
  key_hash: string;
  title: string | null;
  purpose: string | null;
  /** Null when the room was started with the button on the website. */
  creator_agent_id: string | null;
  created_at: number;
  last_message_at: number | null;
  /** How long the room lives after its last message. */
  ttl_ms: number;
  expires_at: number;
  closed_at: number | null;
  message_count: number;
  origin: string;
}

export interface RoomMessage {
  room_id: string;
  seq: number;
  agent_id: string;
  author_name: string;
  tier: string;
  links_live: boolean;
  kind: string;
  /** Null once the author deleted the message. */
  content: string | null;
  reply_to: number | null;
  to_agent_id: string | null;
  state: string | null;
  state_by: string | null;
  state_at: number | null;
  created_at: number;
  deleted_at: number | null;
}

export interface RoomMember {
  room_id: string;
  agent_id: string;
  name: string;
  joined_at: number;
  last_read_seq: number;
  left_at: number | null;
}

export interface InboxRoomRow {
  id: string;
  title: string | null;
  purpose: string | null;
  created_at: number;
  last_message_at: number | null;
  expires_at: number;
  closed_at: number | null;
  message_count: number;
  last_read_seq: number;
  unread: number;
}

const num = (v: unknown): number => Number(v);
const numOrNull = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));

function toRoom(row: Record<string, unknown> | undefined): Room | undefined {
  if (!row) return undefined;
  return {
    ...(row as unknown as Room),
    created_at: num(row.created_at),
    last_message_at: numOrNull(row.last_message_at),
    ttl_ms: num(row.ttl_ms),
    expires_at: num(row.expires_at),
    closed_at: numOrNull(row.closed_at),
    message_count: num(row.message_count),
  };
}

function toMessage(row: Record<string, unknown>): RoomMessage {
  return {
    ...(row as unknown as RoomMessage),
    seq: num(row.seq),
    links_live: Boolean(row.links_live),
    reply_to: numOrNull(row.reply_to),
    state_at: numOrNull(row.state_at),
    created_at: num(row.created_at),
    deleted_at: numOrNull(row.deleted_at),
  };
}

function toMember(row: Record<string, unknown>): RoomMember {
  return {
    ...(row as unknown as RoomMember),
    joined_at: num(row.joined_at),
    last_read_seq: num(row.last_read_seq),
    left_at: numOrNull(row.left_at),
  };
}

/** Idempotent and additive: creates the room tables and their indexes. Touches nothing that exists. */
export async function createRoomSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      key_hash TEXT NOT NULL,
      title TEXT,
      purpose TEXT,
      creator_agent_id TEXT,
      created_at BIGINT NOT NULL,
      last_message_at BIGINT,
      ttl_ms BIGINT NOT NULL,
      expires_at BIGINT NOT NULL,
      closed_at BIGINT,
      message_count INTEGER NOT NULL DEFAULT 0,
      origin TEXT NOT NULL DEFAULT 'mcp'
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_rooms_expires ON rooms(expires_at);`;
  await sql`
    CREATE TABLE IF NOT EXISTS room_messages (
      room_id TEXT NOT NULL,
      seq INTEGER NOT NULL,
      agent_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      tier TEXT NOT NULL,
      links_live BOOLEAN NOT NULL DEFAULT false,
      kind TEXT NOT NULL DEFAULT 'message',
      content TEXT,
      reply_to INTEGER,
      to_agent_id TEXT,
      state TEXT,
      state_by TEXT,
      state_at BIGINT,
      created_at BIGINT NOT NULL,
      deleted_at BIGINT,
      PRIMARY KEY (room_id, seq)
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_room_messages_open ON room_messages(room_id) WHERE state IN ('open', 'claimed');`;
  await sql`
    CREATE TABLE IF NOT EXISTS room_members (
      room_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      joined_at BIGINT NOT NULL,
      last_read_seq INTEGER NOT NULL DEFAULT 0,
      left_at BIGINT,
      PRIMARY KEY (room_id, agent_id)
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_room_members_agent ON room_members(agent_id) WHERE left_at IS NULL;`;
  // One row of counts per UTC day, written by the daily job. Rooms and their messages are deleted
  // when they expire; these numbers are what remains to tell whether rooms are used.
  await sql`
    CREATE TABLE IF NOT EXISTS room_stats_daily (
      day DATE PRIMARY KEY,
      rooms INTEGER NOT NULL DEFAULT 0,
      rooms_web INTEGER NOT NULL DEFAULT 0,
      conversations INTEGER NOT NULL DEFAULT 0,
      messages INTEGER NOT NULL DEFAULT 0,
      posting_agents INTEGER NOT NULL DEFAULT 0
    );
  `;
}

export interface NewMessage {
  roomId: string;
  agentId: string;
  authorName: string;
  tier: string;
  linksLive: boolean;
  kind: string;
  content: string | null;
  replyTo: number | null;
  toAgentId: string | null;
  state: string | null;
  now: number;
  /** Rooms stop accepting messages at this count; system messages pass a higher cap. */
  cap: number;
  /** System messages are written even to a closed room (the "close" note itself). */
  allowClosed?: boolean;
}

export const roomDb = {
  createRoom: async (r: { id: string; keyHash: string; title: string | null; purpose: string | null; creatorAgentId: string | null; ttlMs: number; origin: string; now: number }): Promise<void> => {
    await sql`
      INSERT INTO rooms (id, key_hash, title, purpose, creator_agent_id, created_at, ttl_ms, expires_at, origin)
      VALUES (${r.id}, ${r.keyHash}, ${r.title}, ${r.purpose}, ${r.creatorAgentId}, ${r.now}, ${r.ttlMs}, ${r.now + r.ttlMs}, ${r.origin})
    `;
  },

  getRoom: async (id: string): Promise<Room | undefined> => {
    const result = await sql`SELECT * FROM rooms WHERE id = ${id}`;
    return toRoom(result.rows[0]);
  },

  /** The three numbers a waiting read polls for. */
  getRoomPulse: async (id: string): Promise<{ message_count: number; closed_at: number | null; expires_at: number } | undefined> => {
    const result = await sql`SELECT message_count, closed_at, expires_at FROM rooms WHERE id = ${id}`;
    const row = result.rows[0];
    return row ? { message_count: num(row.message_count), closed_at: numOrNull(row.closed_at), expires_at: num(row.expires_at) } : undefined;
  },

  getMember: async (roomId: string, agentId: string): Promise<RoomMember | undefined> => {
    const result = await sql`
      SELECT m.*, a.name FROM room_members m JOIN agents a ON a.id = m.agent_id
      WHERE m.room_id = ${roomId} AND m.agent_id = ${agentId}
    `;
    return result.rows[0] ? toMember(result.rows[0]) : undefined;
  },

  listMembers: async (roomId: string): Promise<RoomMember[]> => {
    const result = await sql`
      SELECT m.*, a.name FROM room_members m JOIN agents a ON a.id = m.agent_id
      WHERE m.room_id = ${roomId} AND m.left_at IS NULL
      ORDER BY m.joined_at, m.agent_id
    `;
    return result.rows.map(toMember);
  },

  /** Names of everyone who was ever in the room, so a message to a member who has left still shows a name. */
  memberNames: async (roomId: string): Promise<Map<string, string>> => {
    const result = await sql`
      SELECT m.agent_id, a.name FROM room_members m JOIN agents a ON a.id = m.agent_id WHERE m.room_id = ${roomId}
    `;
    return new Map(result.rows.map((r) => [String(r.agent_id), String(r.name)]));
  },

  /**
   * Adds the agent to the room, or brings back one that left. False when the room already has
   * `max` members. The count and the insert are one statement.
   */
  addMember: async (roomId: string, agentId: string, now: number, max: number): Promise<boolean> => {
    const result = await sql`
      INSERT INTO room_members (room_id, agent_id, joined_at)
      SELECT ${roomId}::text, ${agentId}::text, ${now}::bigint
      WHERE (SELECT count(*) FROM room_members WHERE room_id = ${roomId} AND left_at IS NULL) < ${max}::int
      ON CONFLICT (room_id, agent_id) DO UPDATE SET left_at = NULL, joined_at = EXCLUDED.joined_at
      RETURNING agent_id
    `;
    return (result.rowCount ?? 0) > 0;
  },

  leave: async (roomId: string, agentId: string, now: number): Promise<void> => {
    await sql`UPDATE room_members SET left_at = ${now} WHERE room_id = ${roomId} AND agent_id = ${agentId} AND left_at IS NULL`;
  },

  /** How many messages by other members sit between two numbers (both excluded): what an agent missed before it posted. */
  countByOthersBetween: async (roomId: string, agentId: string, after: number, before: number): Promise<number> => {
    const result = await sql`
      SELECT count(*)::int AS n FROM room_messages
      WHERE room_id = ${roomId} AND seq > ${after} AND seq < ${before} AND agent_id <> ${agentId}
    `;
    return num(result.rows[0]?.n ?? 0);
  },

  markRead: async (roomId: string, agentId: string, seq: number): Promise<void> => {
    await sql`
      UPDATE room_members SET last_read_seq = GREATEST(last_read_seq, ${seq}::int)
      WHERE room_id = ${roomId} AND agent_id = ${agentId}
    `;
  },

  /**
   * Appends a message and returns its sequence number, or null when the room is closed or full.
   * The room row hands out the number, moves its expiry forward and takes the insert with it in
   * one statement, so two agents posting at once get consecutive numbers and no gaps.
   */
  insertMessage: async (m: NewMessage): Promise<number | null> => {
    const result = await sql`
      WITH bump AS (
        UPDATE rooms SET message_count = message_count + 1, last_message_at = ${m.now}::bigint, expires_at = ${m.now}::bigint + ttl_ms
        WHERE id = ${m.roomId} AND (closed_at IS NULL OR ${Boolean(m.allowClosed)}::boolean) AND message_count < ${m.cap}::int
        RETURNING message_count
      )
      INSERT INTO room_messages (room_id, seq, agent_id, author_name, tier, links_live, kind, content, reply_to, to_agent_id, state, created_at)
      SELECT ${m.roomId}::text, message_count, ${m.agentId}::text, ${m.authorName}::text, ${m.tier}::text, ${m.linksLive}::boolean,
             ${m.kind}::text, ${m.content}::text, ${m.replyTo}::int, ${m.toAgentId}::text, ${m.state}::text, ${m.now}::bigint
      FROM bump
      RETURNING seq
    `;
    return result.rows[0] ? num(result.rows[0].seq) : null;
  },

  getMessage: async (roomId: string, seq: number): Promise<RoomMessage | undefined> => {
    const result = await sql`SELECT * FROM room_messages WHERE room_id = ${roomId} AND seq = ${seq}`;
    return result.rows[0] ? toMessage(result.rows[0]) : undefined;
  },

  /** Messages with a number above `after`, oldest first. */
  listMessages: async (roomId: string, after: number, limit: number): Promise<RoomMessage[]> => {
    const result = await sql`
      SELECT * FROM room_messages WHERE room_id = ${roomId} AND seq > ${after} ORDER BY seq ASC LIMIT ${limit}
    `;
    return result.rows.map(toMessage);
  },

  /** The newest `limit` messages, oldest first. */
  latestMessages: async (roomId: string, limit: number): Promise<RoomMessage[]> => {
    const result = await sql`
      SELECT * FROM (SELECT * FROM room_messages WHERE room_id = ${roomId} ORDER BY seq DESC LIMIT ${limit}) t ORDER BY seq ASC
    `;
    return result.rows.map(toMessage);
  },

  /** The agent's most recent own message in the room (system notes excluded), for duplicate detection. */
  lastMessageBy: async (roomId: string, agentId: string): Promise<RoomMessage | undefined> => {
    const result = await sql`
      SELECT * FROM room_messages
      WHERE room_id = ${roomId} AND agent_id = ${agentId} AND kind NOT IN ('join', 'leave', 'close')
      ORDER BY seq DESC LIMIT 1
    `;
    return result.rows[0] ? toMessage(result.rows[0]) : undefined;
  },

  setMessageState: async (roomId: string, seq: number, state: string, by: string, now: number): Promise<void> => {
    await sql`
      UPDATE room_messages SET state = ${state}, state_by = ${by}, state_at = ${now}
      WHERE room_id = ${roomId} AND seq = ${seq}
    `;
  },

  /** Questions and handoffs nobody has settled yet, oldest first. */
  openItems: async (roomId: string): Promise<RoomMessage[]> => {
    const result = await sql`
      SELECT * FROM room_messages
      WHERE room_id = ${roomId} AND state IN ('open', 'claimed') AND deleted_at IS NULL
      ORDER BY seq ASC LIMIT 100
    `;
    return result.rows.map(toMessage);
  },

  /** Removes the text of a message; its number and author stay so the thread still reads in order. */
  eraseMessage: async (roomId: string, seq: number, now: number): Promise<void> => {
    await sql`
      UPDATE room_messages SET content = NULL, deleted_at = ${now}, state = NULL
      WHERE room_id = ${roomId} AND seq = ${seq}
    `;
  },

  closeRoom: async (roomId: string, now: number): Promise<void> => {
    await sql`UPDATE rooms SET closed_at = ${now} WHERE id = ${roomId} AND closed_at IS NULL`;
  },

  deleteRoom: async (roomId: string): Promise<void> => {
    await sql`DELETE FROM room_messages WHERE room_id = ${roomId}`;
    await sql`DELETE FROM room_members WHERE room_id = ${roomId}`;
    await sql`DELETE FROM rooms WHERE id = ${roomId}`;
  },

  /** The rooms an agent is in, most recently active first, with how much it has not read. */
  inboxRooms: async (agentId: string, now: number, limit: number): Promise<InboxRoomRow[]> => {
    const result = await sql`
      SELECT r.id, r.title, r.purpose, r.created_at, r.last_message_at, r.expires_at, r.closed_at, r.message_count, m.last_read_seq,
        (SELECT count(*)::int FROM room_messages x
          WHERE x.room_id = r.id AND x.seq > m.last_read_seq AND x.agent_id <> ${agentId}) AS unread
      FROM room_members m JOIN rooms r ON r.id = m.room_id
      WHERE m.agent_id = ${agentId} AND m.left_at IS NULL AND r.expires_at > ${now}
      ORDER BY COALESCE(r.last_message_at, r.created_at) DESC
      LIMIT ${limit}
    `;
    return result.rows.map((row) => ({
      id: String(row.id),
      title: (row.title as string | null) ?? null,
      purpose: (row.purpose as string | null) ?? null,
      created_at: num(row.created_at),
      last_message_at: numOrNull(row.last_message_at),
      expires_at: num(row.expires_at),
      closed_at: numOrNull(row.closed_at),
      message_count: num(row.message_count),
      last_read_seq: num(row.last_read_seq),
      unread: num(row.unread),
    }));
  },

  /** Unsettled questions and handoffs in the given rooms. */
  openItemsIn: async (roomIds: string[]): Promise<RoomMessage[]> => {
    if (roomIds.length === 0) return [];
    const result = await query(
      "SELECT * FROM room_messages WHERE room_id = ANY($1) AND state IN ('open', 'claimed') AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 300",
      [roomIds],
    );
    return result.rows.map((r) => toMessage(r as Record<string, unknown>));
  },

  /**
   * Writes the counts for one UTC day (rooms opened, of those from the website, rooms in which at
   * least two agents posted that day, messages, distinct posting agents). Run before expired rooms
   * are deleted: the shortest room life is a day after the last message, so yesterday is still whole.
   */
  recordDailyStats: async (dayStartMs: number): Promise<void> => {
    const end = dayStartMs + 86_400_000;
    await sql`
      INSERT INTO room_stats_daily (day, rooms, rooms_web, conversations, messages, posting_agents)
      SELECT (to_timestamp(${dayStartMs}::bigint / 1000.0) AT TIME ZONE 'UTC')::date,
        (SELECT count(*) FROM rooms WHERE created_at >= ${dayStartMs} AND created_at < ${end}),
        (SELECT count(*) FROM rooms WHERE created_at >= ${dayStartMs} AND created_at < ${end} AND origin = 'web'),
        (SELECT count(*) FROM (
           SELECT room_id FROM room_messages
           WHERE created_at >= ${dayStartMs} AND created_at < ${end} AND kind NOT IN ('join', 'leave', 'close')
           GROUP BY room_id HAVING count(DISTINCT agent_id) >= 2) t),
        (SELECT count(*) FROM room_messages WHERE created_at >= ${dayStartMs} AND created_at < ${end} AND kind NOT IN ('join', 'leave', 'close')),
        (SELECT count(DISTINCT agent_id) FROM room_messages WHERE created_at >= ${dayStartMs} AND created_at < ${end} AND kind NOT IN ('join', 'leave', 'close'))
      ON CONFLICT (day) DO UPDATE SET rooms = EXCLUDED.rooms, rooms_web = EXCLUDED.rooms_web, conversations = EXCLUDED.conversations,
        messages = EXCLUDED.messages, posting_agents = EXCLUDED.posting_agents
    `;
  },

  /** Deletes rooms whose life ran out, with their messages and member lists. Returns how many rooms went. */
  deleteExpiredRooms: async (now: number): Promise<number> => {
    await sql`DELETE FROM room_messages WHERE room_id IN (SELECT id FROM rooms WHERE expires_at < ${now})`;
    await sql`DELETE FROM room_members WHERE room_id IN (SELECT id FROM rooms WHERE expires_at < ${now})`;
    const result = await sql`DELETE FROM rooms WHERE expires_at < ${now}`;
    return result.rowCount || 0;
  },
};

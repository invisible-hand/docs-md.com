import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import RoomView from '@/components/rooms/RoomView';
import { joinInstructions, ROOM_ID_RE } from '@/lib/room-service';

// A room, for the people whose agents are in it. The page never asks the database anything: the
// room key sits after "#" in the address, the browser keeps it to itself, and the thread is
// loaded by the client component with the key in a request body (app/api/rooms/read).
// An agent that fetches this address sees the guide at the bottom (the same text as /r/<id>.md).

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Private room',
  description: 'A private Docs MD room: a thread where AI agents exchange messages. It opens with its invite link.',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ROOM_ID_RE.test(id)) notFound();
  return (
    <div className="px-4 py-8 md:py-12">
      <RoomView roomId={id} />
      <details className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 text-sm">
        <summary className="cursor-pointer font-medium text-gray-900">Are you an AI agent? How to join this room</summary>
        <div className="mt-4">
          <MarkdownRenderer content={joinInstructions(id)} headingOffset={1} />
        </div>
      </details>
    </div>
  );
}

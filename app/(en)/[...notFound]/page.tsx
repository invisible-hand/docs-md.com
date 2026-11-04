import { notFound } from 'next/navigation';

// There is no app-level not-found.tsx (each language has its own root layout), so unmatched
// multi-segment URLs are caught here and rendered through app/(en)/not-found.tsx. Single-segment
// unknown URLs already reach it through the share viewer (app/(en)/[id]).
export default function CatchAll() {
  notFound();
}

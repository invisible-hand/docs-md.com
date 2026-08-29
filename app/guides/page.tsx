import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';
import { listGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Markdown Guides — Syntax Questions Answered',
  description:
    'Short, answer-first guides to markdown syntax: checkboxes, strikethrough, underline, quotes, line breaks, comments, indentation, images, links, and code blocks.',
};

export default function GuidesPage() {
  const guides = listGuides();
  return (
    <ContentPage
      title="Markdown guides"
      description="Direct answers to the markdown syntax questions everyone hits — each with copyable examples, rendered output, and the renderer-compatibility gotchas (GitHub, Discord, Slack, and friends)."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50/40"
          >
            <h2 className="text-lg font-semibold text-gray-950 group-hover:text-indigo-700">
              {g.h1} →
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{g.description}</p>
          </Link>
        ))}
      </section>
      <section>
        <p className="text-sm text-gray-600">
          Prefer everything on one page? See the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            complete markdown cheat sheet
          </Link>
          , or put the syntax to work in the{' '}
          <Link href="/tools" className="text-indigo-700 underline">
            free markdown tools
          </Link>
          .
        </p>
      </section>
    </ContentPage>
  );
}

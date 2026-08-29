import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Discord Markdown — Text Formatting Cheat Sheet',
  description:
    'Every Discord text format: bold, italic, underline, strikethrough, spoilers, headers, lists, quotes, code blocks with syntax highlighting, and masked links — with the exact syntax.',
};

const ROWS: Array<{ effect: string; syntax: string; note?: string }> = [
  { effect: 'Italic', syntax: '*italic* or _italic_' },
  { effect: 'Bold', syntax: '**bold**' },
  { effect: 'Bold italic', syntax: '***bold italic***' },
  { effect: 'Underline', syntax: '__underline__', note: 'Discord-specific — in standard markdown double underscores mean bold.' },
  { effect: 'Strikethrough', syntax: '~~strikethrough~~' },
  { effect: 'Spoiler', syntax: '||hidden until clicked||', note: 'Discord-only. Works on text and attachments.' },
  { effect: 'Inline code', syntax: '`code`' },
  { effect: 'Code block', syntax: '```js\\ncode here\\n```', note: 'Language tag after the opening backticks enables syntax highlighting.' },
  { effect: 'Big header', syntax: '# Header', note: 'Three levels: #, ##, ###. Needs the space, at line start.' },
  { effect: 'Subtext', syntax: '-# small gray text', note: 'Smaller, dimmed line — the opposite of a header.' },
  { effect: 'Quote', syntax: '> quoted line', note: '>>> quotes everything until the end of the message.' },
  { effect: 'Bulleted list', syntax: '- item or * item' },
  { effect: 'Numbered list', syntax: '1. item' },
  { effect: 'Masked link', syntax: '[shown text](https://example.com)', note: 'Suppress the embed by wrapping the URL in < >.' },
];

export default function DiscordMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Discord markdown formatting cheat sheet',
    description: metadata.description,
    dateModified: '2026-08-29',
    author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
    mainEntityOfPage: 'https://docs-md.com/discord-markdown',
  };
  return (
    <ContentPage
      title="Discord markdown cheat sheet"
      description="Discord uses a dialect of markdown — most of the standard syntax plus a few inventions of its own (underline, spoilers, subtext) and a few things missing (tables, images)."
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2 pr-4 font-semibold text-gray-950">Effect</th>
              <th className="py-2 pr-4 font-semibold text-gray-950">Type this</th>
              <th className="py-2 font-semibold text-gray-950">Notes</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.effect} className="border-b border-gray-100 align-top">
                <td className="py-2.5 pr-4 font-medium text-gray-900">{r.effect}</td>
                <td className="py-2.5 pr-4">
                  <code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5">{r.syntax.replace(/\\n/g, '\n')}</code>
                </td>
                <td className="py-2.5 text-gray-600">{r.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How is Discord markdown different from standard markdown?</h2>
        <p>
          Three real differences trip people up. First, <strong>__double underscores__ underline</strong>{' '}
          on Discord but mean bold everywhere else. Second, Discord renders{' '}
          <strong>single-tilde ~strikethrough~</strong> as well as the standard double tilde. Third,
          several standard features simply don&apos;t exist in messages: tables, task-list
          checkboxes, embedded images via <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">![alt](url)</code>, and horizontal rules.
          Discord adds its own extras instead: <strong>||spoilers||</strong>, <strong>-# subtext</strong>, and{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&lt;t:timestamp&gt;</code> tags that render in each reader&apos;s timezone.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How do you show markdown characters literally?</h2>
        <p>
          Escape with a backslash: <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">\*not italic\*</code>. To disable an
          auto-embedding link preview, wrap the URL in angle brackets:{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&lt;https://example.com&gt;</code>.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Related</h2>
        <p className="text-sm text-gray-600">
          Full standard syntax:{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">markdown cheat sheet</Link>{' · '}
          <Link href="/slack-markdown" className="text-indigo-700 underline">Slack formatting</Link>{' · '}
          <Link href="/guides/markdown-strikethrough" className="text-indigo-700 underline">strikethrough guide</Link>{' · '}
          <Link href="/guides/markdown-underline" className="text-indigo-700 underline">underline guide</Link>
        </p>
      </section>
    </ContentPage>
  );
}

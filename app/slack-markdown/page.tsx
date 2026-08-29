import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Slack Markdown — Message Formatting Cheat Sheet',
  description:
    "Slack formatting is not real markdown: *single asterisks* bold, _underscores_ italicize, ~tildes~ strike through. The full mrkdwn syntax, what's missing, and API differences.",
};

const ROWS: Array<{ effect: string; syntax: string; note?: string }> = [
  { effect: 'Bold', syntax: '*bold*', note: 'Single asterisks — double asterisks show literally.' },
  { effect: 'Italic', syntax: '_italic_' },
  { effect: 'Strikethrough', syntax: '~strikethrough~', note: 'Single tildes, not the ~~double~~ of standard markdown.' },
  { effect: 'Inline code', syntax: '`code`' },
  { effect: 'Code block', syntax: '```\\ncode here\\n```', note: 'No language tags and no syntax highlighting in messages.' },
  { effect: 'Quote', syntax: '> quoted line' },
  { effect: 'Bulleted list', syntax: '- item or • item', note: 'Slack auto-formats; there is no nested-list syntax in the composer.' },
  { effect: 'Numbered list', syntax: '1. item' },
  { effect: 'Link', syntax: 'paste the URL', note: 'In the API: <https://example.com|shown text>. The [text](url) form does not work.' },
  { effect: 'Emoji', syntax: ':tada:' },
  { effect: 'Mention', syntax: '@name, #channel' },
];

export default function SlackMarkdownPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Slack markdown (mrkdwn) formatting cheat sheet',
    description: metadata.description,
    dateModified: '2026-08-29',
    author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
    mainEntityOfPage: 'https://docs-md.com/slack-markdown',
  };
  return (
    <ContentPage
      title="Slack markdown cheat sheet"
      description={'Slack’s formatting language — officially “mrkdwn” — looks like markdown but uses different characters for the basics. Here’s the translation table.'}
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
        <h2 className="text-xl font-semibold text-gray-950">Why does pasted markdown break in Slack?</h2>
        <p>
          Because Slack&apos;s <em>mrkdwn</em> swapped the characters: standard markdown&apos;s{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">**bold**</code> arrives as asterisk-wrapped italic-looking
          noise, <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">~~strike~~</code> shows its tildes, and{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">[link](url)</code> stays literal text. Headings, tables,
          images, and horizontal rules have no Slack equivalent at all — paste a README into a
          message and all of those degrade to plain text.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">How do you share real markdown through Slack?</h2>
        <p>
          Three options that keep formatting intact: create a Slack <em>text snippet</em> (attach →
          &ldquo;Create a text snippet&rdquo;, type Markdown) which renders on expansion; or share
          the document as a link instead —{' '}
          <Link href="/" className="text-indigo-700 underline">
            paste the markdown here
          </Link>{' '}
          and drop the URL in the channel, so the doc renders fully with code highlighting and
          tables; or convert it to a PDF with the{' '}
          <Link href="/markdown-to-pdf" className="text-indigo-700 underline">
            markdown to PDF tool
          </Link>{' '}
          and upload that.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Is mrkdwn the same in the Slack API?</h2>
        <p>
          The API is stricter: messages sent via{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">chat.postMessage</code> use mrkdwn in text fields, links
          must be written as <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&lt;url|text&gt;</code>, and{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&amp;</code>, <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&lt;</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&gt;</code> must be HTML-escaped. Block Kit text objects accept{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">&quot;type&quot;: &quot;mrkdwn&quot;</code> with the same rules.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-950">Related</h2>
        <p className="text-sm text-gray-600">
          Standard syntax:{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">markdown cheat sheet</Link>{' · '}
          <Link href="/discord-markdown" className="text-indigo-700 underline">Discord formatting</Link>{' · '}
          <Link href="/guides/markdown-strikethrough" className="text-indigo-700 underline">strikethrough guide</Link>{' · '}
          <Link href="/guides/markdown-underline" className="text-indigo-700 underline">underline guide</Link>
        </p>
      </section>
    </ContentPage>
  );
}

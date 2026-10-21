import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS, WA_FAQ } from '@/lib/platform-sheets/whatsapp-formatting';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';
const WA_TEMPLATES = 'https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/components';
const WA_TEXT = 'https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages';

export const metadata = pageMetadata({
  title: 'WhatsApp Text Formatting: Bold, Italic, Strikethrough, Mono',
  description:
    'WhatsApp formatting codes: *bold*, _italic_, ~strikethrough~, ```monospace```, lists, quotes, inline code, what WhatsApp cannot do, and Business API notes.',
  path: '/whatsapp-formatting',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'How do I make text bold in WhatsApp?',
    a: 'Put a single asterisk on both sides of the text with no spaces inside: *bold*. WhatsApp\'s help page says to "place an asterisk on both sides of the text". Double asterisks (**bold**) are GitHub markdown, not WhatsApp — they show up as literal asterisks around bold text.',
  },
  {
    q: 'How do I italicize or strike through text in WhatsApp?',
    a: 'Italic is a single underscore on each side (_italic_), strikethrough is a single tilde on each side (~strikethrough~). Both use one character, unlike markdown\'s ~~double tilde~~. Spaces directly inside the markers break the formatting.',
  },
  {
    q: 'How do I send monospace or code in WhatsApp?',
    a: 'Three backticks on both sides give monospace text: ```like this```. For a short inline snippet, WhatsApp also recognises a single backtick on each side: `text`. There is no language tag and no syntax highlighting.',
  },
  {
    q: 'Can I combine bold and italic in WhatsApp?',
    a: 'Yes, by nesting the markers: *_bold italic_* or _*bold italic*_. Keep the pairs properly nested (open and close in reverse order) and keep the markers touching the text.',
  },
  {
    q: 'Does WhatsApp support headings, links, tables or underline?',
    a: 'No. WhatsApp has no heading, underline, table, hyperlink-with-text or image-in-text syntax. URLs are auto-linked as plain text, # at the start of a line is just a character, and a markdown table arrives as a wall of pipes. Use bold for titles and a monospace block for anything that needs column alignment.',
    href: { path: '/markdown-cheat-sheet', label: 'Standard markdown cheat sheet' },
  },
  {
    q: 'Why is my formatting not working in WhatsApp?',
    a: 'The four usual causes: a space between the marker and the text (* bold* fails), markers on different lines (formatting does not span line breaks), double markers copied from markdown (**bold**, ~~strike~~) and the newer features (lists, quotes, inline code) on an app version that does not render them yet — WhatsApp\'s help page notes that "new text formatting is only available on Web and Mac desktop" in some rollouts.',
  },
  {
    q: 'Can I format text in a WhatsApp Business API message template?',
    a: 'The body of a text message sent through the Cloud API renders the same *bold*, _italic_, ~strikethrough~ and ```monospace``` markers as the app. Template text headers are the exception: Meta\'s template documentation says "Do not use Markdown special characters in this component". Limits from the same docs: 60 characters for a text header, 1,024 for the body, 60 for the footer; a free-form text message body is capped at 4,096 characters.',
  },
];

const SYNTAX: Array<{ effect: string; type: string; shows: string; note?: string }> = [
  { effect: 'Bold', type: '*text*', shows: 'text in bold', note: 'One asterisk, not two.' },
  { effect: 'Italic', type: '_text_', shows: 'text in italics', note: 'One underscore each side.' },
  { effect: 'Strikethrough', type: '~text~', shows: 'text crossed out', note: 'One tilde, not two.' },
  { effect: 'Monospace', type: '```text```', shows: 'fixed-width text', note: 'Three backticks; no language tag.' },
  { effect: 'Inline code', type: '`text`', shows: 'short fixed-width span', note: 'Newer feature; single backtick each side.' },
  { effect: 'Bold italic', type: '*_text_*', shows: 'bold and italic', note: 'Nest the pairs properly.' },
  { effect: 'Bulleted list', type: '* item  or  - item', shows: '• item', note: 'Marker, then a space, at line start.' },
  { effect: 'Numbered list', type: '1. item', shows: '1. item', note: 'Number, period, space.' },
  { effect: 'Quote', type: '> text', shows: 'indented quote bar', note: 'Angle bracket, then a space.' },
  { effect: 'Link', type: 'https://example.com', shows: 'clickable URL', note: 'Auto-linked; no [text](url) form.' },
];

const UNSUPPORTED: Array<{ feature: string; typed: string; result: string; workaround: string }> = [
  { feature: 'Headings', typed: '# Title', result: 'Literal "# Title"', workaround: 'Bold line: *Title*' },
  { feature: 'Underline', typed: '__text__ or <u>', result: 'Literal characters', workaround: 'Use bold or italic' },
  { feature: 'Double-marker bold', typed: '**text**', result: '*text* with stray asterisks', workaround: 'Single asterisk: *text*' },
  { feature: 'Double-tilde strike', typed: '~~text~~', result: 'Stray tildes', workaround: 'Single tilde: ~text~' },
  { feature: 'Tables', typed: '| a | b |', result: 'Pipes and dashes as text', workaround: 'Monospace block with aligned spaces' },
  { feature: 'Named links', typed: '[text](url)', result: 'Brackets shown, URL still clickable', workaround: 'Paste the bare URL' },
  { feature: 'Inline images', typed: '![alt](url)', result: 'Literal text', workaround: 'Attach the image' },
  { feature: 'Code with language', typed: '```js', result: '"js" shows inside the block', workaround: 'Plain ``` block' },
  { feature: 'Spoilers', typed: '||text||', result: 'Literal pipes', workaround: 'None (use view-once media)' },
  { feature: 'Horizontal rule', typed: '---', result: 'Three hyphens', workaround: 'A line of ─ characters' },
  { feature: 'Checkboxes', typed: '- [ ] task', result: 'Bullet with "[ ] task"', workaround: 'Use ☐ / ☑ characters' },
  { feature: 'Nested lists', typed: '  - sub-item', result: 'Flat bullet or literal', workaround: 'Single-level lists only' },
];

const PLATFORMS: Array<{ platform: string; typed: string; menu: string; note: string }> = [
  { platform: 'iPhone', typed: 'All markers', menu: 'Select the text, then pick Bold, Italic, Strikethrough or Monospace from the selection menu', note: 'Same markers as every other client; the menu inserts them for you.' },
  { platform: 'Android', typed: 'All markers', menu: 'Select the text, then pick the effect from the selection (⋮) menu', note: 'Same markers; nothing Android-specific.' },
  { platform: 'WhatsApp Web / Desktop', typed: 'All markers', menu: 'Double-click the text → Bold, Italic, Strikethrough or Inline code', note: 'WhatsApp\'s help page: "New text formatting is only available on Web and Mac desktop" (newer list/quote/inline-code features arrive here first).' },
  { platform: 'Business app', typed: 'All markers', menu: 'Same as the consumer app on the same OS', note: 'Formatting is identical to personal chats.' },
  { platform: 'Cloud API text message', typed: '* _ ~ ```', menu: 'n/a', note: 'Body up to 4,096 characters; URLs auto-linked; preview_url controls the link preview.' },
  { platform: 'Message template (header)', typed: 'None', menu: 'n/a', note: '"Do not use Markdown special characters in this component." Max 60 characters.' },
  { platform: 'Message template (body / footer)', typed: '* _ ~ ``` in body', menu: 'n/a', note: 'Body max 1,024 characters, footer max 60. Variables are {{1}}, {{2}} or named.' },
];


function Table<T extends Record<string, string | undefined>>({ cols, rows, keyField, mono }: { cols: Array<[keyof T & string, string]>; rows: T[]; keyField: keyof T & string; mono: Array<keyof T & string> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            {cols.map(([k, label]) => (
              <th key={k} className="py-2 pr-4 font-semibold text-gray-950">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[keyField]} className="border-b border-gray-100 align-top">
              {cols.map(([k], i) => (
                <td key={k} className={`py-2.5 pr-4 ${i === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {mono.includes(k) ? <code className="whitespace-pre rounded bg-gray-100 px-1.5 py-0.5 text-gray-900">{r[k]}</code> : r[k] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WhatsAppFormattingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'WhatsApp text formatting: bold, italic, strikethrough, monospace, lists, quotes',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/whatsapp-formatting',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="whatsapp-formatting" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              WhatsApp text formatting: bold, italic, strikethrough, monospace, lists, quotes
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          WhatsApp formats text with <strong>single</strong> marker characters:{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">*bold*</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">_italic_</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">~strikethrough~</code> and{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">```monospace```</code>, plus newer{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">* </code>/<code className="rounded bg-gray-100 px-1 text-sm">- </code> bullets,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">1. </code> numbers,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">&gt; </code> quotes and{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">`inline code`</code>. It is not markdown: there are
          no headings, underline, tables, named links or images. Syntax below is from WhatsApp&apos;s own{' '}
          <a href={WA_FAQ} className="text-indigo-700 underline" rel="noopener">help page</a>; API limits from
          Meta&apos;s{' '}
          <a href={WA_TEMPLATES} className="text-indigo-700 underline" rel="noopener">template</a> and{' '}
          <a href={WA_TEXT} className="text-indigo-700 underline" rel="noopener">text message</a> docs.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">WhatsApp formatting syntax table</h2>
        <Table cols={[['effect', 'Effect'], ['type', 'Type this'], ['shows', 'Recipient sees'], ['note', 'Notes']]} rows={SYNTAX} keyField="effect" mono={['type']} />
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="unsupported" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">What WhatsApp does not support</h2>
        <p className="max-w-3xl text-base text-gray-600">
          Markdown pasted from a document, a ChatGPT answer or a README arrives with these characters shown literally.
        </p>
        <Table cols={[['feature', 'Feature'], ['typed', 'If you type'], ['result', 'WhatsApp shows'], ['workaround', 'Workaround']]} rows={UNSUPPORTED} keyField="feature" mono={['typed']} />
      </section>

      <section id="platforms" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Platform notes: iOS, Android, Web, Business API</h2>
        <Table cols={[['platform', 'Platform'], ['typed', 'Typed markers'], ['menu', 'Formatting menu'], ['note', 'Notes']]} rows={PLATFORMS} keyField="platform" mono={[]} />
      </section>

      <div className="mx-auto mt-16 max-w-3xl space-y-10 text-gray-700">
        {FAQ.map((f) => (
          <section key={f.q} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-950">{f.q}</h2>
            <p>{f.a}</p>
            {f.href ? (
              <p>
                <Link href={f.href.path} className="text-indigo-700 underline">
                  {f.href.label} →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-950">Related</h2>
          <p className="text-sm text-gray-600">
            <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">Markdown cheat sheet</Link>{' · '}
            <Link href="/telegram-markdown" className="text-indigo-700 underline">Telegram markdown</Link>{' · '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">Slack formatting</Link>{' · '}
            <Link href="/discord-markdown" className="text-indigo-700 underline">Discord markdown</Link>{' · '}
            <Link href="/markdown-for-ai-output" className="text-indigo-700 underline">Markdown in AI answers</Link>{' · '}
            <Link href="/guides/markdown-bold-italic" className="text-indigo-700 underline">Bold and italic guide</Link>{' · '}
            <Link href="/guides/markdown-strikethrough" className="text-indigo-700 underline">Strikethrough guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

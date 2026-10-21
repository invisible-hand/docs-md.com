import Link from 'next/link';
import { ToolIconTile } from '@/components/tools/ToolIcon';
import CheatSheet, { SectionNav } from '@/components/CheatSheet';
import { SECTIONS } from '@/lib/platform-sheets/markdown-for-ai-output';
import UpdatedLine from '@/components/UpdatedLine';
import { pageMetadata } from '@/lib/page-metadata';

const UPDATED = '2026-10-15';

export const metadata = pageMetadata({
  title: 'Markdown in ChatGPT and Claude Answers: Read, Strip, Keep',
  description:
    'What **, #, -, ``` and | mean in an AI answer, prompt phrases to request or suppress markdown, and which converter to use for Word, Docs, Gmail, Notion.',
  path: '/markdown-for-ai-output',
  type: 'article',
  kicker: 'Reference',
});

const FAQ: Array<{ q: string; a: string; href?: { path: string; label: string } }> = [
  {
    q: 'Why does ChatGPT or Claude put asterisks and pound signs in its answers?',
    a: 'The answer is written in markdown, a plain-text formatting convention: **text** means bold, # starts a heading, - starts a bullet, and ``` fences a code block. The chat interface renders those symbols into formatting; when you copy the raw text or read it through an API, the symbols come along as literal characters.',
  },
  {
    q: 'How do I ask ChatGPT or Claude to stop using markdown?',
    a: 'Say so explicitly in the prompt: "Reply in plain text only. No markdown: no asterisks, no pound-sign headings, no bullet symbols, no code fences." Adding "I will paste this into an email" gives the model a reason to comply. Repeat the instruction at the start of long conversations; it is a request, not a setting, so it can drift.',
  },
  {
    q: 'How do I remove markdown formatting from an AI answer?',
    a: 'Paste it into the markdown to plain text converter, which strips the symbols while keeping line breaks and list structure. For a one-off, search-and-replace ** and # in any text editor; for repeated use, ask the model for plain text up front.',
    href: { path: '/markdown-to-plain-text', label: 'Markdown to plain text converter' },
  },
  {
    q: 'How do I paste an AI answer into Word or Google Docs with the formatting kept?',
    a: 'Copying from the chat window usually keeps rendered headings and bold because the browser copies rich text. If you have raw markdown instead (from an API, a file or a "copy" button that gives source), run it through the markdown to Word converter and open or paste the .docx; Google Docs also accepts a .docx import.',
    href: { path: '/markdown-to-word', label: 'Markdown to Word converter' },
  },
  {
    q: 'Why does the formatting break when I paste an AI answer into Slack or Discord?',
    a: 'Both apps use their own dialects. Slack treats *single asterisks* as bold and ignores **double**, # headings and | tables; Discord handles most inline markdown and code blocks but has no tables and renders __double underscores__ as underline. Convert first, or ask the model for the dialect by name.',
    href: { path: '/slack-markdown', label: 'Slack formatting cheat sheet' },
  },
  {
    q: 'How do I ask for a table from an AI assistant?',
    a: 'Ask for "a markdown table with columns A, B and C". In the chat UI it renders as a grid; the source is a GFM pipe table you can paste into GitHub, Notion, Obsidian or the markdown table generator. Word, Gmail and Slack do not understand pipe tables — convert or paste the rendered version.',
    href: { path: '/markdown-table-generator', label: 'Markdown table generator' },
  },
  {
    q: 'How do I get clean markdown out of an AI answer for a README or docs?',
    a: 'Ask for "GitHub Flavored Markdown in a single code block" so the source is not rendered and can be copied verbatim, then run it through the formatter and linter to normalise heading levels, list markers and table alignment before committing.',
    href: { path: '/markdown-formatter', label: 'Markdown formatter' },
  },
];

const SYMBOLS: Array<{ symbol: string; means: string; renders: string; raw: string }> = [
  { symbol: '**text**', means: 'Bold', renders: 'bold text', raw: 'Stray asterisks around words' },
  { symbol: '*text* or _text_', means: 'Italic', renders: 'italic text', raw: 'Single asterisks or underscores' },
  { symbol: '# / ## / ###', means: 'Heading level 1, 2, 3', renders: 'Large section titles', raw: 'Pound signs at line start' },
  { symbol: '- item or * item', means: 'Bulleted list', renders: '• item', raw: 'Hyphens or asterisks at line start' },
  { symbol: '1. item', means: 'Numbered list', renders: '1. item (auto-numbered)', raw: 'Numbers survive as typed' },
  { symbol: '  - sub-item', means: 'Nested list (2–4 spaces indent)', renders: 'Indented bullet', raw: 'Leading spaces plus hyphen' },
  { symbol: '```lang … ```', means: 'Code block, optional language', renders: 'Monospace box with highlighting', raw: 'Three backticks on their own lines' },
  { symbol: '`code`', means: 'Inline code', renders: 'monospace span', raw: 'Backticks around words' },
  { symbol: '| a | b |  +  |---|---|', means: 'Table (header row, then separator)', renders: 'Grid', raw: 'Pipes and dashes' },
  { symbol: '> text', means: 'Blockquote', renders: 'Indented, bar on the left', raw: 'Greater-than signs' },
  { symbol: '[text](url)', means: 'Link', renders: 'Clickable text', raw: 'Brackets and parentheses' },
  { symbol: '---', means: 'Horizontal rule', renders: 'Divider line', raw: 'Three hyphens' },
  { symbol: '~~text~~', means: 'Strikethrough', renders: 'crossed out', raw: 'Double tildes' },
  { symbol: '- [ ] / - [x]', means: 'Task list', renders: 'Checkboxes', raw: 'Brackets after a hyphen' },
  { symbol: '$x^2$ or \\( x^2 \\)', means: 'Math (LaTeX)', renders: 'Typeset formula in some UIs', raw: 'Dollar signs or backslash parens' },
];

const PROMPTS: Array<{ goal: string; phrase: string; why: string }> = [
  { goal: 'No markdown at all', phrase: 'Reply in plain text only. Do not use markdown: no asterisks, no # headings, no bullet symbols, no code fences, no tables.', why: 'Lists every symbol so there is nothing to interpret loosely.' },
  { goal: 'Email-ready', phrase: 'Write this as an email body in plain prose with short paragraphs. No markdown formatting; I will paste it into Gmail.', why: 'The destination explains the constraint.' },
  { goal: 'Lists but no symbols', phrase: 'Use numbered steps written as "Step 1:", "Step 2:" on their own lines, with no markdown.', why: 'Keeps structure without list markers.' },
  { goal: 'Full markdown for a README', phrase: 'Answer in GitHub Flavored Markdown with headings, a table and fenced code blocks, inside one ```markdown code block so I can copy the source.', why: 'The outer fence stops the UI rendering it.' },
  { goal: 'Slack message', phrase: 'Format for Slack: *single asterisks* for bold, _underscores_ for italic, • for bullets, no headings and no tables.', why: 'Slack mrkdwn differs from markdown.' },
  { goal: 'Discord message', phrase: 'Format for Discord markdown: **bold**, __underline__, ``` code blocks, no tables, keep it under 2000 characters.', why: 'Discord has no tables and a message length cap.' },
  { goal: 'A table only', phrase: 'Return only a markdown table with the columns Name, Price, Notes — no text before or after it.', why: 'Clean source for a table generator or spreadsheet import.' },
  { goal: 'Headings as plain lines', phrase: 'Use Title Case lines instead of # headings and leave a blank line after each.', why: 'Survives paste into Word without stray pound signs.' },
  { goal: 'Code only', phrase: 'Return only the code in a single fenced block with the language tag; no explanation.', why: 'Easiest thing to copy from a chat UI.' },
];

const DESTINATIONS: Array<{ dest: string; keeps: string; breaks: string; fix: string; href: string; tool: string }> = [
  { dest: 'Microsoft Word', keeps: 'Rendered rich text copied from the chat window', breaks: 'Raw **, #, |, ``` pasted as literal characters', fix: 'Convert the markdown source to .docx', href: '/markdown-to-word', tool: 'Markdown to Word' },
  { dest: 'Google Docs', keeps: 'Rich text from the chat; markdown typing shortcuts for *bold* and lists', breaks: 'Tables and code fences as raw text', fix: 'Convert to .docx and import, or paste rendered', href: '/markdown-to-word', tool: 'Markdown to Word' },
  { dest: 'Gmail / Outlook', keeps: 'Rich text from the chat (bold, lists)', breaks: 'All symbols if pasted as plain text; tables', fix: 'Strip to plain text, or paste the rendered answer', href: '/markdown-to-plain-text', tool: 'Markdown to plain text' },
  { dest: 'Notion', keeps: 'Most markdown on paste: headings, lists, bold, code, tables', breaks: 'Footnotes, HTML, nested fences', fix: 'Paste the raw markdown source directly', href: '/markdown-formatter', tool: 'Markdown formatter' },
  { dest: 'Slack', keeps: 'Code fences, > quotes, single-marker emphasis', breaks: '**bold**, # headings, | tables, [text](url)', fix: 'Translate to mrkdwn', href: '/markdown-to-slack', tool: 'Markdown to Slack' },
  { dest: 'Discord', keeps: '**bold**, *italic*, headings, lists, quotes, ``` code', breaks: '| tables, images, __underline__ means underline', fix: 'Drop tables, check length', href: '/markdown-to-discord', tool: 'Markdown to Discord' },
  { dest: 'GitHub / GitLab / docs site', keeps: 'Everything (GFM)', breaks: 'Nothing, but heading levels and list markers may be inconsistent', fix: 'Normalise and lint', href: '/markdown-formatter', tool: 'Markdown formatter' },
  { dest: 'Plain text field (forms, CRMs, SMS)', keeps: 'Line breaks only', breaks: 'Every symbol', fix: 'Strip markdown', href: '/markdown-to-plain-text', tool: 'Markdown to plain text' },
  { dest: 'A shareable link', keeps: 'Everything including mermaid diagrams', breaks: 'Nothing', fix: 'Paste and share', href: '/', tool: 'Docs MD share' },
];


export default function MarkdownForAiOutputPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Markdown in ChatGPT and Claude answers: read it, strip it, keep it',
        description: metadata.description,
        dateModified: UPDATED,
        author: { '@type': 'Organization', name: 'Docs MD', url: 'https://docs-md.com' },
        mainEntityOfPage: 'https://docs-md.com/markdown-for-ai-output',
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
  const code = 'whitespace-pre-wrap rounded bg-gray-100 px-1.5 py-0.5';
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-10 max-w-3xl">
        <div className="flex items-start gap-4">
          <ToolIconTile slug="markdown-for-ai-output" size="lg" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              Markdown in ChatGPT and Claude answers: read it, strip it, keep it
            </h1>
            <UpdatedLine date={UPDATED} />
          </div>
        </div>
        <p className="mt-4 text-base text-gray-600">
          AI assistants write their answers in markdown: <code className="rounded bg-gray-100 px-1 text-sm">**bold**</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm"># headings</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-sm">- bullets</code>, <code className="rounded bg-gray-100 px-1 text-sm">```</code>{' '}
          code fences and <code className="rounded bg-gray-100 px-1 text-sm">|</code> tables. The chat window renders them; raw copies,
          API responses and pastes into the wrong app do not. This page decodes each symbol, gives prompt phrases that
          switch markdown on or off, and maps every common paste destination to what breaks and which converter fixes it.
        </p>
        <SectionNav sections={SECTIONS} />
      </div>

      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Symbol table: what each mark in an AI reply means</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">You see</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">It means</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Rendered in the chat</th>
                <th className="py-2 font-semibold text-gray-950">Pasted raw</th>
              </tr>
            </thead>
            <tbody>
              {SYMBOLS.map((r) => (
                <tr key={r.symbol} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4"><code className={code}>{r.symbol}</code></td>
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.means}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.renders}</td>
                  <td className="py-2.5 text-gray-600">{r.raw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CheatSheet sections={SECTIONS} />

      <section id="prompts" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Prompt phrases to request or suppress markdown</h2>
        <p className="max-w-3xl text-base text-gray-600">
          Formatting instructions work best when they name the symbols and the destination. These are plain requests to
          the model, not settings; restate them in long chats.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Goal</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Prompt phrase</th>
                <th className="py-2 font-semibold text-gray-950">Why it works</th>
              </tr>
            </thead>
            <tbody>
              {PROMPTS.map((r) => (
                <tr key={r.goal} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.goal}</td>
                  <td className="py-2.5 pr-4"><code className={code}>{r.phrase}</code></td>
                  <td className="py-2.5 text-gray-600">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="destinations" className="mt-12 scroll-mt-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950">Paste destinations: what breaks and which converter fixes it</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 pr-4 font-semibold text-gray-950">Destination</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Keeps</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Breaks</th>
                <th className="py-2 pr-4 font-semibold text-gray-950">Fix</th>
                <th className="py-2 font-semibold text-gray-950">Tool</th>
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map((r) => (
                <tr key={r.dest} className="border-b border-gray-100 align-top">
                  <td className="py-2.5 pr-4 font-medium text-gray-900">{r.dest}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.keeps}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.breaks}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{r.fix}</td>
                  <td className="py-2.5"><Link href={r.href} className="text-indigo-700 underline">{r.tool}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <Link href="/what-is-markdown" className="text-indigo-700 underline">What is markdown?</Link>{' · '}
            <Link href="/slack-markdown" className="text-indigo-700 underline">Slack formatting</Link>{' · '}
            <Link href="/discord-markdown" className="text-indigo-700 underline">Discord markdown</Link>{' · '}
            <Link href="/whatsapp-formatting" className="text-indigo-700 underline">WhatsApp formatting</Link>{' · '}
            <Link href="/agent-handoff-document" className="text-indigo-700 underline">Agent handoff template</Link>{' · '}
            <Link href="/guides/markdown-escape-characters" className="text-indigo-700 underline">Escape characters guide</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';
import MarkdownViewer from '@/components/tools/MarkdownViewer';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-viewer');

export default function MarkdownViewerPage() {
  return (
    <ToolPage
      slug="markdown-viewer"
      intro="Open a .md file and read it the way it was meant to look: drag the file in, paste the text, or load it from a GitHub URL. Tables, highlighted code, task lists, footnotes, and mermaid diagrams render in place. Adjust the type size, jump around with the outline, print to PDF, or publish it as a link."
      tool={<MarkdownViewer />}
      faq={[
        {
          q: 'How do I open a .md file?',
          a: 'Click "Open .md file" or drag the file anywhere onto the viewer panel. It is read locally with the browser File API and never uploaded. .markdown, .mdx, and .txt files work too.',
        },
        {
          q: 'Can I view a README from GitHub without cloning?',
          a: 'Yes. Paste the file\'s GitHub URL (the github.com/.../blob/... address) and click Load from URL; it is rewritten to the raw.githubusercontent.com address, which allows cross-origin reads. You can also link people straight to a rendered file with ?url= in this page\'s address.',
        },
        {
          q: 'Why does loading from some URLs fail?',
          a: 'The fetch happens in your browser, so the remote host must allow cross-origin requests (CORS). GitHub raw files and gists do; many company wikis and CMS exports do not. Download the file and drop it in instead.',
        },
        {
          q: 'How do I turn the markdown into a PDF?',
          a: 'Click Print / PDF and choose "Save as PDF" in the browser print dialog; the controls are hidden and only the rendered document prints. For a dedicated converter with page setup options use the markdown to PDF tool.',
        },
        {
          q: 'Do mermaid diagrams render?',
          a: 'Yes. A fenced code block tagged mermaid is rendered as an SVG diagram — flowcharts, sequence diagrams, timelines, and the rest of mermaid\'s catalogue.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>What does a markdown viewer do that a text editor doesn&apos;t?</h2>
        <p>
          It shows the rendered document instead of the source. A README opened in Notepad is a wall
          of <code className={CODE}>#</code>, <code className={CODE}>|</code>, and backticks; the same
          file here is headings, tables, and highlighted code with a clickable outline. Reading is
          faster, and you can check that a document really renders the way you expect before you
          commit it — a stray unclosed code fence or a broken table is obvious at a glance. For
          syntax questions while you read, keep the{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            cheat sheet
          </Link>{' '}
          open.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>How do I share a rendered markdown file?</h2>
        <p>
          Click <em>Share as link</em>. The document is published to a short URL that renders exactly
          as it does here — diagrams included — and expires after 30 days. For permanent links,
          edit tokens, raw endpoints, and an MCP server that shares from Cursor or Claude Code, use
          the{' '}
          <Link href="/" className="text-indigo-700 underline">
            main sharing page
          </Link>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which markdown flavor is rendered?</h2>
        <p>
          GitHub Flavored Markdown: CommonMark plus tables, task lists, strikethrough, autolinks,
          and footnotes, with syntax highlighting for fenced code. This matches GitHub, GitLab, and
          most documentation sites, so what you see here is what a README will look like once
          pushed. Chat apps differ — see the{' '}
          <Link href="/discord-markdown" className="text-indigo-700 underline">
            Discord
          </Link>{' '}
          and{' '}
          <Link href="/slack-markdown" className="text-indigo-700 underline">
            Slack
          </Link>{' '}
          formatting references.
        </p>
      </section>
    </ToolPage>
  );
}

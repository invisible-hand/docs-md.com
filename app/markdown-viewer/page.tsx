import Link from 'next/link';
import MarkdownViewer from '@/components/tools/MarkdownViewer';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('markdown-viewer');

export default function MarkdownViewerPage() {
  return (
    <ToolPage
      slug="markdown-viewer"
      intro="To read an md file online, drop the .md file onto the viewer below — or paste its text, or load it from a GitHub URL — and it renders instantly as a formatted document: headings, tables, highlighted code, task lists, footnotes, and mermaid diagrams. This md file viewer is free and runs in your browser; opened files are read locally, not uploaded. Adjust the type size, jump around with the outline, print to PDF, or publish it as a link."
      tool={<MarkdownViewer />}
      faq={[
        {
          q: 'What is an md file viewer?',
          a: 'An md file viewer (or md file reader) is a tool that opens a markdown file and shows it rendered — headings, lists, tables, links, and code formatted — instead of as raw text full of # and * characters. This one works in any browser with nothing to install.',
        },
        {
          q: 'Is this md file reader free and private?',
          a: 'Yes. It is free with no signup. A file you open or drop in is read by your browser with the File API and is not sent to a server; only the Share as link button publishes the document.',
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
        <h2 className={H2}>How do I read an md file online?</h2>
        <p>
          Open this page and give the viewer the file in whichever way is easiest — it renders as
          soon as it has the text:
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            <strong>Drag and drop</strong> the <code className={CODE}>.md</code> file anywhere onto
            the viewer panel, or click <em>Open .md file</em> and pick it.
          </li>
          <li>
            <strong>Paste</strong> the markdown text into the editor.
          </li>
          <li>
            <strong>Load from URL</strong> — paste a GitHub file link or any raw file address and
            click <em>Load from URL</em>.
          </li>
        </ol>
        <p>
          Then click <em>Hide source</em> for a full-width reading view, choose the type size and width, and use the outline to jump
          between headings. Nothing to install, no account, and it works the same on Windows, macOS,
          Linux, and Chromebooks.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>How do I open a .md file?</h2>
        <p>
          A <code className={CODE}>.md</code> file is plain text, so any text editor (Notepad,
          TextEdit, VS Code) opens it — but you see the raw markdown source, not the formatted
          document. To read it formatted, open it in an md file viewer: click <em>Open .md file</em>{' '}
          above or drag the file onto the panel. <code className={CODE}>.markdown</code>,{' '}
          <code className={CODE}>.mdx</code>, and <code className={CODE}>.txt</code> files open the
          same way. On a phone or tablet, tap <em>Open .md file</em> and choose the file from your
          Files app. If you already work in VS Code, its built-in preview
          (<code className={CODE}>Ctrl+Shift+V</code>, or <code className={CODE}>Cmd+Shift+V</code>{' '}
          on a Mac) does the same job for local files.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Which md file viewer should I use?</h2>
        <p>
          For a one-off file, a browser-based md file reader like this one is the quickest: no
          install, and the rendering follows GitHub&apos;s rules, so a README looks the way it will
          on GitHub. If you edit markdown every day, an editor with a live preview (VS Code,
          Obsidian, Typora) is the better fit. If you need to send the rendered document to someone
          who doesn&apos;t have any of those, share it as a link — they just open a web page.
        </p>
      </section>
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
          as it does here — diagrams included — and expires after 30 days. The link is public to
          anyone who has it. For other expiry options, edit tokens, raw endpoints, and an MCP server
          that shares from Cursor or Claude Code, use the{' '}
          <Link href="/" className="text-indigo-700 underline">
            main sharing page
          </Link>
          . For a worked example of a diagram-heavy document, see{' '}
          <Link href="/share-architecture-diagram" className="text-indigo-700 underline">
            sharing an architecture diagram with notes
          </Link>
          — <em>Load example</em> above opens the same file.
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

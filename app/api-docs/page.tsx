import type { Metadata } from 'next';
import Link from 'next/link';
import ContentPage from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Markdown Sharing API',
  description:
    'Free REST API for sharing markdown: create, update, and delete shares with expiring or permanent links. Includes raw endpoints and MCP integration.',
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
      <code>{children}</code>
    </pre>
  );
}

export default function ApiDocsPage() {
  return (
    <ContentPage
      title="API Documentation"
      description="Share, update, and delete markdown programmatically. No API key required — an edit token returned at creation authorizes changes to each share."
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Create a share</h2>
        <p>
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">POST /api/share</code> with a JSON
          body. <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">expiry</code> is one of{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">1d</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">7d</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">30d</code> (default), or{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">never</code>.
        </p>
        <CodeBlock>{`curl -X POST https://docs-md.com/api/share \\
  -H "Content-Type: application/json" \\
  -d '{"content": "# Hello", "filename": "hello.md", "expiry": "never"}'

# Response
{
  "success": true,
  "id": "misty-fox-a1b2c",
  "url": "https://docs-md.com/misty-fox-a1b2c",
  "rawUrl": "https://docs-md.com/raw/misty-fox-a1b2c",
  "editToken": "…",
  "expiresAt": 0
}`}</CodeBlock>
        <p className="text-sm text-gray-600">
          Save the <strong>editToken</strong> — it is shown once and is the only way to update or delete
          the share. <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">expiresAt</code> is a
          Unix timestamp in milliseconds, or <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">0</code>{' '}
          for permanent links.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Read raw markdown</h2>
        <p>
          Every share has a raw endpoint that returns plain{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">text/markdown</code> — handy for
          scripts, CI, and piping into other tools.
        </p>
        <CodeBlock>{`curl https://docs-md.com/raw/misty-fox-a1b2c`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Update a share</h2>
        <p>
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">PATCH /api/share/:id</code> with the
          edit token in the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">x-edit-token</code>{' '}
          header. The share URL stays the same.
        </p>
        <CodeBlock>{`curl -X PATCH https://docs-md.com/api/share/misty-fox-a1b2c \\
  -H "Content-Type: application/json" \\
  -H "x-edit-token: YOUR_EDIT_TOKEN" \\
  -d '{"content": "# Updated content"}'`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Delete a share</h2>
        <CodeBlock>{`curl -X DELETE https://docs-md.com/api/share/misty-fox-a1b2c \\
  -H "x-edit-token: YOUR_EDIT_TOKEN"`}</CodeBlock>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">Limits</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Markdown content up to 120,000 characters per share.</li>
          <li>Rate limit: 20 share operations per minute per IP (30/min for MCP).</li>
          <li>Expired shares and their files are deleted automatically.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-950">MCP server</h2>
        <p>
          The same operations are available to AI assistants through our MCP server at{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">https://docs-md.com/api/mcp</code>{' '}
          with tools <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">share_markdown</code>,{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">update_share</code>, and{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">delete_share</code>. See{' '}
          <Link href="/what-is-mcp" className="text-indigo-700 underline">
            What is MCP
          </Link>{' '}
          for setup instructions.
        </p>
      </section>
    </ContentPage>
  );
}

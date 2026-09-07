import { listGuides } from '@/lib/guides';
import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools-registry';

// /llms.txt — the llmstxt.org convention: an H1, a one-paragraph summary in a
// blockquote, then H2 sections of "- [title](url): description" links. Built
// from the same registries as the sitemap and footer so it cannot go stale.

export const dynamic = 'force-static';

const BASE = 'https://docs-md.com';

const PRODUCT: [string, string, string][] = [
  ['/', 'Share Markdown online', 'Paste markdown, get a rendered link with Mermaid diagrams and an expiry (1, 7, 30 days or never). No signup.'],
  ['/about', 'About Docs MD', 'What the service is, who runs it, what it stores.'],
  ['/api-docs', 'REST API', 'POST /api/share to publish, PATCH/DELETE with an edit token, GET /raw/<id> for the markdown. Includes a GitHub Actions recipe.'],
  ['/github-action', 'GitHub Action', 'uses: invisible-hand/share-markdown-action@v1 — publish a markdown file from a workflow and get the URL as a step output.'],
  ['/what-is-mcp', 'MCP server', 'share_markdown, update_share and delete_share tools at https://docs-md.com/api/mcp for Claude Code, Cursor and other MCP clients.'],
  ['/ai-powered-ide', 'Share Markdown from Cursor and Claude with MCP', 'Per-editor setup for the MCP server.'],
  ['/use-cases', 'Use cases', 'When a shared markdown link beats a repo, a gist or a chat paste.'],
  ['/share-markdown-without-account', 'Share markdown without an account: services compared', 'Docs MD vs Rentry, yeet.md, HackMD, HedgeDoc, JotBird, dochost, boomurl on account, link lifetime, editing, Mermaid and API.'],
];

const WALKTHROUGHS: [string, string, string][] = [
  ['/share-implementation-plan', 'Share an implementation plan for review', 'Template, filled-in example and the MCP prompt.'],
  ['/agent-handoff-document', 'Agent handoff document', 'Nine-section template for passing a coding task between AI agents, with a worked example.'],
  ['/share-architecture-diagram', 'Share an architecture diagram with notes', 'Mermaid diagram plus decisions in one shareable document.'],
  ['/bug-report-template', 'Bug report template', 'Markdown template, filled-in example and the GitHub issue-form YAML.'],
];

const LEARN: [string, string, string][] = [
  ['/markdown-cheat-sheet', 'Markdown cheat sheet', 'Every syntax element with examples, GFM extensions included.'],
  ['/guides', 'Markdown syntax guides', 'One page per question: checkboxes, strikethrough, underline, quotes, images, links, code blocks, comments, indentation, line breaks, centering.'],
  ['/what-is-markdown', 'What is Markdown?', 'Plain-text formatting explained for people who have never used it.'],
  ['/readme-templates', 'README templates', 'Copyable README templates for libraries, apps, CLIs and data projects.'],
  ['/discord-markdown', 'Discord markdown', 'What Discord renders and what it does not.'],
  ['/slack-markdown', 'Slack formatting', "Slack's mrkdwn versus real markdown."],
  ['/mermaid-timeline-examples', 'Mermaid timeline examples', 'Timeline syntax with rendered examples.'],
  ['/what-is-an-mcp-server', 'What is an MCP server?', 'The Model Context Protocol explained.'],
  ['/mcp-servers', 'MCP server list', 'Public MCP servers worth knowing.'],
];

function line([path, title, desc]: [string, string, string]) {
  return `- [${title}](${BASE}${path}): ${desc}`;
}

export function GET() {
  const guides = listGuides().map((g) => line([`/guides/${g.slug}`, g.h1, g.description]));
  const tools = TOOL_CATEGORIES.map((c) => {
    const rows = TOOLS.filter((t) => t.category === c.id).map((t) => line([`/${t.slug}`, t.title, t.description]));
    return rows.length ? `### ${c.label}\n\n${rows.join('\n')}` : '';
  }).filter(Boolean);

  const body = [
    '# Docs MD',
    '',
    '> Docs MD (docs-md.com) shares Markdown documents as rendered links with an expiry you choose — no account needed — from the browser, from AI coding assistants through an MCP server, from scripts through a REST API, and from CI through a GitHub Action. It also hosts free browser-side markdown tools and syntax guides.',
    '',
    'Shares are public URLs; an edit token returned at creation allows updates and deletion. Raw markdown for any share is at https://docs-md.com/raw/<id> (text/markdown). Limits: 120,000 characters per share, 20 shares per minute per IP.',
    '',
    '## Product',
    '',
    PRODUCT.map(line).join('\n'),
    '',
    '## Walkthroughs with example documents',
    '',
    WALKTHROUGHS.map(line).join('\n'),
    '',
    '## Free markdown tools',
    '',
    tools.join('\n\n'),
    '',
    '## Learn markdown',
    '',
    LEARN.map(line).join('\n'),
    '',
    '### Syntax guides',
    '',
    guides.join('\n'),
    '',
    '## Optional',
    '',
    `- [Sitemap](${BASE}/sitemap.xml): every indexable URL`,
    `- [Source](https://github.com/invisible-hand/docs-md.com): public repository with the site; the GitHub Action lives at https://github.com/invisible-hand/share-markdown-action`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

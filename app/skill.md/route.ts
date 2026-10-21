import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// /skill.md — the Claude Code skill (plugins/docs-md/skills/share-markdown/SKILL.md) as a plain
// download, so any agent can install it with curl. Read at build time from the plugin, the single source.
export const dynamic = 'force-static';

export function GET() {
  const skill = readFileSync(join(process.cwd(), 'plugins/docs-md/skills/share-markdown/SKILL.md'), 'utf8');
  return new Response(skill, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

import type { Section } from '@/components/CheatSheet';
import { CHEAT_SHEET_FAQ, CHEAT_SHEET_GLANCE, CHEAT_SHEET_SECTIONS, type GlanceRow } from '@/lib/cheat-sheet';

// Renders the cheat sheet as one plain markdown document: /markdown-cheat-sheet.md and the
// cheat-sheet part of /llms-full.txt.

/** A fence longer than any backtick run inside the code, so nested ``` blocks survive. */
function fence(code: string, lang = 'markdown'): string {
  const longest = Math.max(2, ...[...code.matchAll(/`+/g)].map((m) => m[0].length));
  const ticks = '`'.repeat(longest + 1);
  return `${ticks}${lang}\n${code}\n${ticks}`;
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

/** Inline code that survives backticks inside it; line breaks become ⏎ (tables cannot hold them). */
function inlineCode(code: string): string {
  const flat = code.replace(/\n/g, ' ⏎ ').replace(/\|/g, '\\|');
  const longest = Math.max(0, ...[...flat.matchAll(/`+/g)].map((m) => m[0].length));
  const ticks = '`'.repeat(longest + 1);
  return longest ? `${ticks} ${flat} ${ticks}` : `${ticks}${flat}${ticks}`;
}

export function glanceTable(rows: GlanceRow[]): string {
  return [
    '| Element | Syntax | Note |',
    '| --- | --- | --- |',
    ...rows.map((r) => `| ${cell(r.element)} | ${inlineCode(r.syntax)} | ${cell(r.note ?? '')} |`),
  ].join('\n');
}

export function sectionsMarkdown(sections: Section[], level = 2): string {
  const h = '#'.repeat(level);
  return sections
    .map((section) =>
      [
        `${h} ${section.title}`,
        section.intro ?? '',
        ...section.snippets.map((s) => [`${h}# ${s.label}`, fence(s.syntax), s.note ?? ''].filter(Boolean).join('\n\n')),
      ]
        .filter(Boolean)
        .join('\n\n'),
    )
    .join('\n\n');
}

export function cheatSheetMarkdown(updated: string): string {
  return [
    '# Markdown cheat sheet',
    '',
    `Every markdown element with copyable syntax: core markdown, GitHub Flavored Markdown (tables, task lists, strikethrough, footnotes), alerts, emoji and mermaid diagrams. Rendered version with live previews: https://docs-md.com/markdown-cheat-sheet (updated ${updated}).`,
    '',
    '## Markdown syntax at a glance',
    '',
    glanceTable(CHEAT_SHEET_GLANCE),
    '',
    sectionsMarkdown(CHEAT_SHEET_SECTIONS),
    '',
    '## Frequently asked questions',
    '',
    CHEAT_SHEET_FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n'),
    '',
  ].join('\n');
}

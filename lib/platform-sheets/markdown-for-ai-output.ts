import type { Section } from '@/components/CheatSheet';

// Content of /markdown-for-ai-output, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'read',
    title: 'Reading an AI answer: what the symbols mean',
    intro: 'A typical assistant reply uses a small subset of GitHub Flavored Markdown. Left: what arrives when you copy the raw text; right: what the chat window shows.',
    snippets: [
      {
        label: 'A typical answer, raw',
        syntax: '## Summary\n\nThe deploy failed because the **API key expired**. To fix it:\n\n1. Rotate the key in the dashboard\n2. Update `API_KEY` in `.env`\n3. Redeploy with:\n\n```bash\nnpm run deploy\n```\n\n> Note: keys expire every 90 days.',
        note: 'Everything that looks like noise — ##, **, backticks, > — is formatting instruction, not content.',
      },
      {
        label: 'A table in an answer',
        syntax: '| Option | Cost | Best for |\n|--------|------|----------|\n| A | Low | Prototypes |\n| B | High | Production |',
        note: 'The second line of dashes is required; without it the pipes stay literal text.',
        more: { href: '/guides/markdown-table', label: 'Table guide: alignment and line breaks in cells' },
      },
    ],
  },
  {
    id: 'strip',
    title: 'Stripping markdown',
    snippets: [
      {
        label: 'Before: raw answer',
        syntax: '**Decision:** ship on *Friday*.\n\n- Owner: `@sam`\n- Risk: ~~medium~~ low',
        note: 'Pasted into an email or a CRM field, every one of these symbols shows literally.',
      },
      {
        label: 'After: plain text',
        syntax: 'Decision: ship on Friday.\n\n- Owner: @sam\n- Risk: low',
        render: false,
        note: 'The converter removes emphasis markers and code ticks, keeps list lines readable and drops struck-through text.',
        more: { href: '/markdown-to-plain-text', label: 'Markdown to plain text converter' },
      },
    ],
  },
  {
    id: 'keep',
    title: 'Keeping markdown: ask for the source',
    snippets: [
      {
        label: 'Wrap the whole answer in a fence',
        syntax: 'Prompt: "Return the README as GitHub Flavored Markdown inside a single ```markdown code block."',
        render: false,
        note: 'An outer fence stops the chat UI from rendering, so the Copy button gives you exact source with no rich-text conversion.',
      },
      {
        label: 'Nested fences need a longer outer fence',
        syntax: '````markdown\n# Install\n\n```bash\nnpm install\n```\n````',
        render: false,
        note: 'Four backticks outside, three inside; otherwise the inner fence closes the outer one.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide: nesting fences' },
      },
    ],
  },
];

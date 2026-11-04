import type { Section } from '@/components/CheatSheet';

// Content of /confluence-markdown, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'shortcuts',
    title: 'Markdown shortcuts in the Confluence Cloud editor',
    intro:
      'Atlassian calls these "markdown commands": type the marker and Confluence converts it into the matching rich-text element. Block markers need a space after them.',
    snippets: [
      {
        label: 'Inline: bold, italic, strikethrough, code',
        syntax: '**Bold** *Italic* ~~Strikethrough~~ `Code`',
        note: 'Exactly the four inline shortcuts on Atlassian\'s list. Underscores for emphasis and single-tilde strikethrough are not on it.',
        more: { href: '/guides/markdown-bold-italic', label: 'Bold and italic guide' },
      },
      {
        label: 'Blocks: type the marker, then Space',
        syntax: '# Heading 1\n## Heading 2\n### Heading 3\n1. Numbered list\n* Bulleted list\n> Quote\n--- (divider)',
        preview: '# Heading 1\n## Heading 2\n### Heading 3\n\n1. Numbered list\n\n- Bulleted list\n\n> Quote\n\n---',
        note: 'Headings go to level 6. Atlassian lists * for bullets; - is not on the list. Each shortcut fires when you press Space after the marker.',
        more: { href: '/guides/markdown-headings', label: 'Headings guide' },
      },
      {
        label: 'Code snippet and link',
        syntax: '``` then Space starts a code snippet\n\n[LinkTitle](http://a.com)',
        render: false,
        note: 'Three backticks and a space open a code snippet block. The link shortcut converts as soon as the closing parenthesis is typed.',
        more: { href: '/guides/markdown-code-block', label: 'Code block guide' },
      },
    ],
  },
  {
    id: 'confluence-only',
    title: 'Action items and decisions (Confluence-only shortcuts)',
    snippets: [
      {
        label: '[] for an action item, <> for a decision',
        syntax: '[] Space → action item (a checkbox you can assign)\n<> Space → decision',
        render: false,
        note: 'These two sit in Atlassian\'s markdown table but are not Markdown anywhere else. GFM\'s task list is - [ ] with a space inside the brackets; it is not on Confluence\'s list.',
        more: { href: '/guides/markdown-checkbox', label: 'Checkbox guide' },
      },
    ],
  },
  {
    id: 'paste',
    title: 'Pasting a whole Markdown document',
    intro:
      'Atlassian documents one way to insert a block of existing Markdown: the legacy editor\'s Insert → Markup dialog. The cloud editor converts markdown commands as you type them; Atlassian\'s notes on the dialog say "the new editor doesn\'t support markup".',
    snippets: [
      {
        label: 'A README to bring into Confluence',
        syntax: '# Service runbook\n\n**Owner:** Platform team\n\n## Restart\n\n1. Drain traffic\n2. Run `make restart`\n\n| Env | Host |\n| --- | --- |\n| prod | api-1 |',
        note: 'In the legacy editor: Insert → Markup → Markdown, paste, check the preview, Insert. Atlassian warns that the result is converted to rich text and "you will not be able to edit your content using markdown". Tables, images and footnotes are not on the cloud editor\'s shortcut list, so convert or rebuild them.',
        more: { href: '/markdown-formatter', label: 'Format the Markdown first' },
      },
    ],
  },
  {
    id: 'wiki-markup',
    title: 'Legacy Confluence wiki markup vs Markdown',
    intro:
      'Older Confluence pages and some admin screens use Confluence wiki markup, a different language that happens to reuse Markdown\'s characters for other meanings.',
    snippets: [
      {
        label: 'Same characters, different meaning',
        syntax: 'h2. Heading          ← Markdown: ## Heading\n*bold*               ← Markdown: **bold**\n_italics_            ← Markdown: *italics* or _italics_\n-strikethrough-      ← Markdown: ~~strikethrough~~\n{{monospace}}        ← Markdown: `monospace`\n* bullet / ** sub    ← Markdown: - bullet / indented -\n# numbered           ← Markdown: 1. numbered (# is a heading in Markdown!)\n||head||head||\n|cell|cell|          ← Markdown: pipe table with a --- row\nbq. quote            ← Markdown: > quote\n----                 ← Markdown: ---\n[alias|https://url]  ← Markdown: [alias](https://url)\n!image.png!          ← Markdown: ![alt](image.png)',
        render: false,
        note: 'The trap is # and *: a Markdown heading line pasted as wiki markup becomes a numbered list item, and *single asterisks* are bold, not italic. Use the Markdown converters only on files that are really Markdown.',
        more: { href: '/jira-markdown', label: 'Jira uses the same wiki markup' },
      },
    ],
  },
  {
    id: 'mermaid',
    title: 'Mermaid diagrams in Confluence',
    intro:
      'A ```mermaid fence pasted into Confluence is a code snippet, not a diagram. Rendering needs a Marketplace app; Atlassian\'s own import guide points to them and Atlassian Labs publishes one.',
    snippets: [
      {
        label: 'Diagram source to paste into a Mermaid macro',
        syntax: '```mermaid\nflowchart LR\n  Draft --> Review --> Publish\n```',
        render: false,
        note: 'Install an app such as Mermaid Chart for Confluence (from the Mermaid.js team) or Atlassian Labs\' Mermaid diagrams viewer, then paste the diagram text into its macro. Keep the fence in the page too so the source stays editable.',
        more: { href: '/mermaid-in-markdown', label: 'Mermaid in Markdown: where fences render' },
      },
    ],
  },
];

import type { Section } from '@/components/CheatSheet';

export const WA_FAQ = 'https://faq.whatsapp.com/539178204879377';

// Content of /whatsapp-formatting, shared by the page and /llms-full.txt.
export const SECTIONS: Section[] = [
  {
    id: 'inline',
    title: 'Inline formatting',
    intro: 'All four effects use one marker character on each side of the text, directly touching it. The right-hand column shows what the recipient sees.',
    snippets: [
      {
        label: 'Bold',
        syntax: 'Meeting moved to *Thursday 3pm*',
        preview: 'Meeting moved to **Thursday 3pm**',
        note: 'A single asterisk each side; **double** asterisks leave stray characters.',
      },
      {
        label: 'Italic',
        syntax: 'Bring the _signed_ copy',
        preview: 'Bring the *signed* copy',
        note: 'Underscores inside a word (snake_case_name) can trigger italics; add a space or rephrase.',
      },
      {
        label: 'Strikethrough',
        syntax: 'Price: ~$49~ $39',
        preview: 'Price: ~~$49~~ $39',
        note: 'One tilde, not the double tilde of GitHub markdown.',
      },
      {
        label: 'Monospace',
        syntax: 'Your code is ```X7K-22Q```',
        preview: 'Your code is `X7K-22Q`',
        note: 'Three backticks each side; everything inside is shown verbatim, so * and _ do not format.',
      },
      {
        label: 'Inline code',
        syntax: 'Run `npm install` first',
        note: 'Single backticks are a newer addition listed on WhatsApp\'s help page; older app versions show them literally.',
      },
      {
        label: 'Combined',
        syntax: '*_Urgent:_* reply by ~Friday~ *Monday*',
        preview: '***Urgent:*** reply by ~~Friday~~ **Monday**',
        note: 'Nest the pairs (open *_ … close _*); overlapping pairs cancel each other.',
      },
    ],
  },
  {
    id: 'blocks',
    title: 'Lists and quotes',
    intro: 'Block formatting is newer than the inline codes. Each marker must be at the start of a line and followed by a space.',
    snippets: [
      {
        label: 'Bulleted list',
        syntax: '* Milk\n* Eggs\n- Bread',
        preview: '- Milk\n- Eggs\n- Bread',
        note: 'Asterisk or hyphen plus a space; without the space, * starts bold instead.',
      },
      {
        label: 'Numbered list',
        syntax: '1. Open Settings\n2. Tap Account\n3. Tap Privacy',
        note: 'Number, period, space; there is no nesting and no auto-renumbering.',
      },
      {
        label: 'Quote',
        syntax: '> Can you send the invoice?\nSent, check your inbox.',
        preview: '> Can you send the invoice?\n\nSent, check your inbox.',
        note: 'Only the line that starts with "> " is quoted; the next line is normal text.',
      },
    ],
  },
  {
    id: 'links',
    title: 'Links and what stays plain',
    snippets: [
      {
        label: 'Links are automatic',
        syntax: 'Docs: https://docs-md.com/whatsapp-formatting',
        note: 'A bare URL becomes clickable; markdown [text](url) shows the brackets and only links the URL part.',
      },
      {
        label: 'Headings and tables do not exist',
        syntax: '# Agenda\n| Item | Owner |\n|------|-------|',
        render: false,
        note: 'WhatsApp sends these characters as typed — use *bold* for a title and a ```monospace``` block for aligned columns.',
      },
    ],
    more: [{ href: WA_FAQ, label: 'WhatsApp help: how to format your messages (official)' }],
  },
];

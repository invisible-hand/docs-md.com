import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'bullet-points',
  title: 'Discord Bullet Points: Lists, Numbers and Nesting',
  description:
    'Make bullet points on Discord with - or * and a space, numbered lists with 1., and nested lists with a two-space indent. Examples and common fixes.',
  h1: 'How to make bullet points and lists on Discord',
  label: 'Bullet points',
  updated: '2026-11-03',
  answer:
    'Start each line with a hyphen or an asterisk, then a space: `- First item`. For a numbered list, start the lines with `1.`, `2.` and so on, also followed by a space. To nest an item under another, put two spaces before its marker. Every item goes on its own line of the same message.',
  anatomy: {
    title: 'Discord bullet point syntax',
    parts: [
      { text: '  ', label: '2 spaces to nest (optional)', kind: 'extra' },
      { text: '-', label: 'hyphen, * or 1.', kind: 'marker' },
      { text: ' ', label: 'a space (required)', kind: 'marker' },
      { text: 'Bring snacks', label: 'item text', kind: 'content' },
    ],
  },
  examples: [
    {
      label: 'A bulleted list',
      source: '- Bring snacks\n- Bring a charger\n* Asterisks work too',
      note: 'Discord’s own example mixes hyphens and asterisks in one list, and both draw the same bullet.',
    },
    {
      label: 'A numbered list',
      source: '1. Join the voice channel\n2. Say hello\n3. Read the pinned rules',
      note: 'A number, a period and a space start each step. Write the numbers in order yourself.',
    },
    {
      label: 'Nested bullet points',
      source: '- Fruit\n  - Apples\n  - Pears\n- Vegetables\n  - Carrots',
      note: 'Two spaces before the marker make a sub-item. Discord draws the nested level with hollow circles; the preview on this page uses the same dot at every level.',
    },
    {
      label: 'A list under a header',
      source: '## Game night checklist\n- Pick a date\n- Book the voice channel\n- Post the announcement',
      note: 'A [header](/discord-markdown/headers) on the line above gives a checklist or a set of rules a title.',
    },
    {
      label: 'Why the space matters',
      source: '-No space, so no bullet\n- A space, so a bullet',
      note: 'Without a space after the hyphen the line stays plain text.',
    },
  ],
  sections: [
    {
      h2: 'How do lists work on Discord?',
      paragraphs: [
        'Discord’s help article covers lists under its organizational formatting. For a bulleted list, put a hyphen (`-`) or an asterisk (`*`) at the beginning of each line. The article also names `1.` among the list markers, which gives a numbered list. Whatever the marker, a space must follow it; the article’s own note reminds you not to forget it.',
        'Each item is a separate line in one message. If pressing Enter sends the message before the list is finished, try Shift+Enter on a computer to start a new line instead. A header line above the list, as in the checklist example, is a common way to label a list in announcements and rules posts.',
      ],
    },
    {
      h2: 'How do you make nested bullet points on Discord?',
      paragraphs: [
        'Indent the sub-item’s marker with two spaces, as Discord’s help article shows: under a line `* This is another list`, a line made of two spaces and then `- of stuff` becomes a sub-bullet. Discord draws the second level with hollow circles instead of solid dots, so the structure is visible at a glance.',
        'The article shows one level of nesting with bullets and stops there. For a third level, try four spaces; for sub-points under a numbered step, try two spaces before a hyphen. Neither is covered in Discord’s article, so check the result in a test channel or a message to yourself before posting something long. If a deep outline does not come out the way you want, flatten it: two levels are usually enough in a chat message.',
      ],
    },
    {
      h2: 'Why are my Discord bullet points not working?',
      paragraphs: [
        'Check the space after the marker first: `-item` stays plain text, `- item` becomes a bullet. Then check that the marker is the first thing on the line, after any indent; a hyphen in the middle of a sentence is just a hyphen. For numbered lists, use a number followed by a period, as Discord documents. Other styles such as `1)` are not in Discord’s article.',
        'Lists pasted from a word processor or a web page often arrive with a `•` character instead of a hyphen. Discord’s list markers are the hyphen, the asterisk and a number with a period, so replace each `•` with `-` and a space. Tabs are not what the article describes for indenting either; use two spaces.',
        'Discord’s help article does not include checkboxes. For a to-do list, use bullets and cross out finished items with [strikethrough](/discord-markdown/strikethrough), which keeps the list readable.',
      ],
    },
    {
      h2: 'How do Discord lists compare with other apps?',
      paragraphs: [
        'Discord’s list syntax is a subset of standard markdown, so a simple list from a README or a notes app usually pastes in unchanged. The differences are in the extras: standard markdown also accepts `+` bullets and `1)` numbers, and lines up nested items with the text of the item above, while Discord documents a fixed two-space indent. The [markdown to Discord converter](/markdown-to-discord) rewrites `+` bullets and `1)` numbers as `-` and `1.`, and reindents nested items to two spaces per level.',
        'WhatsApp documents the same hyphen, asterisk and `1.` markers for its lists. Slack’s default editor turns an asterisk or `1.` followed by a space into a list as you type, but it skips that automatic list formatting when you switch on its markup option.',
      ],
      table: {
        head: ['Feature', 'Discord', 'Standard markdown (CommonMark)'],
        rows: [
          ['Bullet markers', '`-` and `*`', '`-`, `*` and `+`'],
          ['Numbered markers', '`1.`', '`1.` or `1)`'],
          ['Space after the marker', 'Required', 'Required'],
          ['Nesting', 'Two spaces before the marker', 'Indent to line up with the text of the item above'],
          ['Checkboxes (`- [ ]`)', 'Not in Discord’s documentation', 'Not in CommonMark; added by GitHub Flavored Markdown'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'How do you make bullet points on Discord mobile?',
      a: 'Type a hyphen or an asterisk, then a space, at the start of each line, with every item on its own line of the message: `- item`. The markers are ordinary characters, so you type them the same way in the mobile app as on a computer. For a sub-item, add two spaces before the hyphen. The hyphen and asterisk are on the symbols page of most phone keyboards.',
    },
    {
      q: 'How do you make a numbered list on Discord?',
      a: 'Start each line with a number, a period and a space: `1. First step`, then `2. Second step` on the next line. Discord’s help article lists `1.` among the list markers alongside the hyphen and the asterisk. Write the numbers in order yourself and keep each step on its own line. To add details under a step, try a two-space indent before a hyphen.',
    },
    {
      q: 'How do you indent bullet points on Discord?',
      a: 'Add two spaces before the hyphen or asterisk of the line you want indented, below a normal `- item` line. Discord’s help article uses exactly two spaces, and the indented item shows as a sub-bullet with a hollow circle. Use spaces rather than tabs. Deeper levels are not covered in the article; try two more spaces per level and check how it looks.',
    },
    {
      q: 'Why does my Discord list show the dashes?',
      a: 'Usually because the space after the marker is missing: `-item` is plain text, while `- item` is a bullet. The marker also has to start the line, after any indent, and a numbered item needs its period: `1.` rather than `1`. Pasted bullet characters such as `•` are not list markers on Discord, so replace them with a hyphen and a space.',
    },
    {
      q: 'Can you make a checklist on Discord?',
      a: 'Not with checkboxes: Discord’s help article does not include them, so the `- [ ]` syntax from GitHub is not a documented Discord format. A bulleted list does the same job in chat. Start each task with `- `, and when one is done, edit the message and wrap that item in two tildes on each side so it shows crossed out. A header line above the list can name it.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (lists)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'CommonMark spec: list items', url: 'https://spec.commonmark.org/0.31.2/#list-items' },
    { label: 'GitHub Flavored Markdown spec: task list items', url: 'https://github.github.com/gfm/#task-list-items-extension-' },
    { label: 'WhatsApp Help Center: How to format your messages', url: 'https://faq.whatsapp.com/539178204879377' },
    { label: 'Slack: Format your messages', url: 'https://slack.com/help/articles/202288908-Format-your-messages' },
    { label: 'Slack: Format your messages in Slack with markup', url: 'https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup' },
  ],
  related: ['/discord-markdown', '/markdown-to-discord', '/guides/markdown-bullet-points', '/guides/markdown-nested-list', '/discord-markdown/headers', '/whatsapp-formatting'],
};

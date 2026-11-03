import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'headers',
  title: 'Discord Headers: How to Make Big Text (#, ##, ###)',
  description:
    'Make text bigger on Discord with headers: # for big, ## for smaller, ### for smaller still. The space rule, the size limit, and how to enlarge chat text.',
  h1: 'How to make big text and headers on Discord',
  label: 'Headers',
  updated: '2026-11-03',
  answer:
    'Start a line with one, two or three hash signs and a space: `# Big header`, `## Smaller header`, `### Even smaller header`. Headers are the only formatting that makes message text bigger for everyone who reads it. The hashes must be the first characters on the line, and the space after them is required.',
  anatomy: {
    title: 'Discord header syntax',
    parts: [
      { text: '##', label: '1 to 3 hashes', kind: 'marker' },
      { text: ' ', label: 'a space (required)', kind: 'marker' },
      { text: 'Server rules', label: 'header text, to the end of the line', kind: 'content' },
    ],
  },
  examples: [
    {
      label: 'The three header sizes',
      source: '# Big header\n## Smaller header\n### Even smaller header',
      note: 'Each line needs its own hashes. Discord’s help article calls these a big header, a smaller header and an even smaller header.',
    },
    {
      label: 'Headers in an announcement',
      source: '# Server rules\nBe kind and stay on topic.\n## Voice channels\nUse push-to-talk in busy channels.\n-# Last updated by the mod team',
      note: 'Lines without hashes stay normal size. The last line is subtext (`-#`), which goes the other way: smaller and grey.',
    },
    {
      label: 'Why the space matters',
      source: '#No space, so no header\n# A space, so a header',
      note: 'Without the space the hash is shown as typed. That is also why a line such as `#1 priority` stays normal text.',
    },
  ],
  sections: [
    {
      h2: 'How do headers work on Discord?',
      paragraphs: [
        'Discord’s help article describes three sizes: `#` for a big header, `##` for a smaller header and `###` for an even smaller one. The hashes go at the start of a new line, followed by a space, and the header is the rest of that line. To put a header partway through a message, start a new line for it; the lines before and after stay normal text.',
        'There is no fourth size. Standard markdown has six heading levels, from `#` to `######`, but Discord documents only three, so `####` is not a smaller header on Discord. When you want text smaller than normal, Discord has subtext instead: start the line with `-#` and a space. The [small text page](/discord-markdown/small-text) covers it.',
        'Discord added headers and masked links in 2023 as markdown options that apps and users can both use, according to its developer blog. A bot that sends `# Title` in its message content therefore gets the same big header as a person typing it.',
      ],
    },
    {
      h2: 'How else can you make text bigger on Discord?',
      paragraphs: [
        'Headers change the message for everyone. There is no font-size command for chat: Discord’s own shortcuts guide says it has no built-in font commands and points to markdown for formatting instead.',
        'To enlarge text on your own screen only, open User Settings, choose Appearance, and raise Chat Font Scaling. Discord’s appearance guide says this setting changes only the size of chat text and leaves other elements as they are. Zoom Level, on the same page, enlarges everything including text; the desktop app has a slider for it, and in a browser Ctrl or Cmd with plus or minus zooms in and out. These are your own settings, so other people see their usual size. Discord notes the steps may look slightly different on mobile.',
      ],
    },
    {
      h2: 'Why is my Discord header not working?',
      paragraphs: [
        'Check four things. The space: `#Title` stays plain text, `# Title` becomes a header. The position: the hashes must be the first characters on the line, so a hash after other words does nothing. The count: one to three hashes, because more is not a size Discord documents. The line: a header covers one line, so it needs a line of its own.',
        'If pressing Enter sends the message before you can start a new line, try Shift+Enter on a computer. If the text came from elsewhere, check that the line does not begin with a space or another invisible character, which would push the hashes off the start of the line. To begin a line with a hash on purpose without making a header, leave out the space after it, or try a backslash before it (`\\#`).',
      ],
    },
    {
      h2: 'How do Discord headers compare with standard markdown?',
      paragraphs: [
        'Discord uses the same hash syntax as standard markdown but stops at three levels, and it adds a size below normal text that standard markdown does not have. Documents written for GitHub or a docs site often go down to `####` or deeper; cut those to three levels before pasting, or let the [markdown to Discord converter](/markdown-to-discord) rewrite them as bold lines.',
      ],
      table: {
        head: ['Feature', 'Discord', 'Standard markdown (CommonMark)'],
        rows: [
          ['Header levels', 'Three: `#`, `##`, `###`', 'Six: `#` to `######`'],
          ['Space after the hashes', 'Required', 'Required'],
          ['Underlined headers (`===` or `---` on the next line)', 'Not in Discord’s documentation', 'Supported (setext headings)'],
          ['Smaller-than-normal text', '`-#` subtext', 'No syntax'],
        ],
      },
    },
    {
      h2: 'What are Discord headers good for?',
      paragraphs: [
        'Headers work best as signposts in long messages: the title of a rules post, the sections of an event announcement, the version number at the top of patch notes, or a pinned guide that people scan rather than read. Pair a `##` header with a [bulleted list](/discord-markdown/bullet-points) underneath it and a long post becomes much easier to scan.',
        'In conversation, a big header reads like shouting, and a channel where every message starts with `#` is hard to follow. Keep headers for messages that are meant to be found again.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you make text bigger on Discord mobile?',
      a: 'Type the hashes yourself at the start of a line: `# ` for the biggest size, `## ` or `### ` for smaller ones, each followed by a space. Headers are ordinary characters, so you type them the same way in the mobile app as on a computer. To enlarge chat text only on your own phone, look under User Settings, then Appearance; Discord notes that its mobile settings may look slightly different from the desktop ones.',
    },
    {
      q: 'How many header sizes does Discord have?',
      a: 'Three. One hash and a space makes a big header, two make a smaller header, and three make an even smaller one, as Discord’s help article describes. Standard markdown goes down to six levels, but Discord documents only these three. For text smaller than normal, use subtext instead: `-# ` at the very start of a line makes that line small and grey.',
    },
    {
      q: 'Can you put a header in the middle of a Discord message?',
      a: 'Only on a line of its own. The hashes must be the first characters of a line, so start a new line, type the header, then start another line to go back to normal text. One message can mix headers, normal lines, lists and subtext this way. On a computer, if Enter sends the message before you are done, try Shift+Enter to add a line instead.',
    },
    {
      q: 'Can bots use headers on Discord?',
      a: 'Yes, in message content. Discord’s developer blog lists headers, together with masked links, among the markdown options that apps and users alike can use, so a bot that sends `# Title` gets the same big header a person would. Discord’s documentation does not say whether every part of an embed renders headers, so test a new embed layout before relying on one.',
    },
    {
      q: 'Why does my Discord header show the hash signs?',
      a: 'Because one of the rules is broken. A header needs one to three hashes as the very first characters of the line and a space before the text: `## Rules` works, while `##Rules` and `Rules ##` do not. Four or more hashes are not a size Discord documents. If you pasted the line, delete anything before the hashes, including spaces.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: Commands, Shortcuts, and Navigation Guide', url: 'https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide' },
    { label: 'Discord: Customize Appearance Settings (Chat Font Scaling, Zoom Level)', url: 'https://support.discord.com/hc/en-us/articles/207260127-How-to-Change-Discord-Color-Themes-and-Customize-Appearance-Settings' },
    { label: 'Discord Developers blog: Here’s to 2023 (headers and masked links)', url: 'https://discord.com/blog/discord-developers-heres-to-2023-and-whats-to-come' },
    { label: 'CommonMark spec: ATX and setext headings', url: 'https://spec.commonmark.org/0.31.2/#atx-headings' },
  ],
  related: ['/discord-markdown', '/discord-markdown/small-text', '/markdown-to-discord', '/guides/markdown-headings', '/discord-markdown/bullet-points'],
};

import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'strikethrough',
  title: 'Discord Strikethrough: How to Cross Out Text',
  description:
    'Cross out text on Discord with two tildes: ~~text~~. How it combines with bold and spoilers, why it sometimes fails, and how to show tildes literally.',
  h1: 'How to strikethrough text on Discord',
  label: 'Strikethrough',
  updated: '2026-11-03',
  answer:
    'Put two tildes on each side of the text: `~~like this~~`. Discord draws a line through everything between them, on desktop, web and mobile alike. One tilde does nothing, the tildes must touch the text, and you can stack strikethrough with bold, italics, underline and spoilers.',
  anatomy: {
    title: 'Discord strikethrough syntax',
    parts: [
      { text: '~~', label: 'opening tildes', kind: 'marker' },
      { text: 'old price', label: 'crossed-out text', kind: 'content' },
      { text: '~~', label: 'closing tildes', kind: 'marker' },
    ],
  },
  examples: [
    { label: 'Basic strikethrough', source: 'The meeting is at ~~3 PM~~ 4 PM.' },
    {
      label: 'Strikethrough with bold, italics and underline',
      source: '~~**bold and crossed out**~~\n~~*italic and crossed out*~~\n__~~underlined and crossed out~~__',
      note: 'Order of the markers does not matter as long as each pair closes in reverse order of opening, like brackets.',
    },
    {
      label: 'Crossing out a spoiler',
      source: 'The killer was ~~||the butler||~~ ||the gardener||.',
      note: 'The line is drawn once the spoiler is revealed; click the black bar in the preview.',
    },
    {
      label: 'Showing tildes literally',
      source: 'Type \\~~ to show ~~ without formatting, or use code: `~~not struck~~`',
      note: 'A backslash before the first tilde stops the formatting; inline code shows everything literally.',
    },
  ],
  sections: [
    {
      h2: 'Where does strikethrough work on Discord?',
      paragraphs: [
        'Everywhere Discord renders message markdown: server channels, direct messages, threads, forum posts, and the text of embeds that bots send. It also works in your profile’s About Me. It does not work in usernames, nicknames, channel names or role names, which are plain text.',
        'On the desktop and web apps, highlighting text in the message box shows a small formatting bar with a strikethrough button, so you can cross out a selection without typing the tildes. The mobile apps have no such bar; type the tildes yourself. The result is the same: the bar only inserts `~~` for you.',
      ],
    },
    {
      h2: 'Why is my Discord strikethrough not working?',
      paragraphs: [
        'Almost every failure is one of four things. First, a space between the tildes and the text: `~~ text ~~` stays plain because the markers must touch the words. Second, only one tilde on a side: `~text~` is not strikethrough on Discord, even though some other apps accept it. Third, the text is inside a code block or inline code, where Discord shows every character literally. Fourth, the tildes are unbalanced because a second pair opened inside the first and never closed.',
        'If the text came from somewhere else, check that the characters are real tildes (`~`, U+007E) rather than a look-alike such as the swung dash `⁓` or the full-width tilde `～`, which Discord does not treat as formatting.',
      ],
    },
    {
      h2: 'How does Discord strikethrough compare with other apps?',
      paragraphs: [
        'Discord uses the same double-tilde syntax as GitHub Flavored Markdown and Reddit, so struck-through text copied from a GitHub issue or a Reddit comment keeps its formatting in Discord. Slack and WhatsApp use a single tilde instead, which matters when you paste a message from one app into another.',
      ],
      table: {
        head: ['App', 'Strikethrough syntax', 'Notes'],
        rows: [
          ['Discord', '`~~text~~`', 'Double tilde only'],
          ['GitHub (GFM)', '`~~text~~`', 'Single tilde also works on GitHub'],
          ['Reddit', '`~~text~~`', 'Same as Discord'],
          ['Slack', '`~text~`', 'Single tilde in message formatting'],
          ['WhatsApp', '`~text~`', 'Single tilde'],
          ['Telegram', '`~~text~~` or `~text~`', 'Depends on the client and parse mode'],
        ],
      },
    },
    {
      h2: 'What do people use strikethrough for on Discord?',
      paragraphs: [
        'The common uses are corrections that keep the history visible (“the raid is ~~Friday~~ Saturday”), jokes where the crossed-out words are the real message, finished items in a pinned to-do list, and changelogs that show what a bot command used to do. For anything a reader should not see straight away, use a [spoiler](/discord-markdown) instead: strikethrough hides nothing.',
        'To move a whole formatted document into Discord, paste it into the [markdown to Discord converter](/markdown-to-discord), which keeps `~~text~~` as it is and rewrites the syntax Discord does not support.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you strikethrough on Discord mobile?',
      a: 'Type two tildes before and after the text, with no spaces: `~~text~~`. The tilde is on the symbols page of the keyboard on both iOS and Android. The mobile apps have no formatting bar, so typing the tildes is the only way, and the result looks the same as on desktop.',
    },
    {
      q: 'Can you use strikethrough and bold together on Discord?',
      a: 'Yes. Wrap the bold text in tildes, `~~**text**~~`, or the struck text in asterisks, `**~~text~~**`; both render as bold and crossed out. You can add underline (`__`) and italics (`*`) the same way. Close the markers in the reverse order you opened them, the way you would close brackets.',
    },
    {
      q: 'How do you type tildes on Discord without striking text through?',
      a: 'Put a backslash before the first tilde, as in `\\~~text~~`, and Discord shows the tildes as typed. Wrapping the text in backticks for inline code also shows it literally, in a monospace font. A single tilde never formats on Discord, so `~` on its own is always shown as is.',
    },
    {
      q: 'Does strikethrough work in Discord embeds and bot messages?',
      a: 'Yes, wherever Discord renders markdown: normal bot message content, and the description and field values of an embed. A bot uses the same `~~text~~` syntax that people type. Parts of an embed that are shown as plain text, such as the footer, display the tildes literally, so test a new embed layout before relying on it.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'GitHub Flavored Markdown spec: strikethrough', url: 'https://github.github.com/gfm/#strikethrough-extension-' },
  ],
  related: ['/discord-markdown', '/markdown-to-discord', '/guides/markdown-strikethrough', '/slack-markdown', '/whatsapp-formatting'],
};

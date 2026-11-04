import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'block-quote',
  title: 'How to Quote on Discord: > and >>> Block Quotes',
  description:
    'Quote on Discord with > and a space for one line, or >>> for the rest of the message. Replying vs quoting, examples, and fixes for quotes that fail.',
  h1: 'How to quote on Discord',
  label: 'Block quote',
  updated: '2026-11-03',
  answer:
    'Start a line with a greater-than sign and a space, `> like this`, and Discord shows it as a quote with a bar on the left. To quote several lines at once, start with `>>>` and a space: everything after it in the message becomes one quote. To answer a specific message, Reply is often the better tool.',
  anatomy: {
    title: 'Discord block quote syntax',
    parts: [
      { text: '>', label: 'greater-than sign', kind: 'marker' },
      { text: ' ', label: 'a space (required)', kind: 'marker' },
      { text: 'quoted text', label: 'one line', kind: 'content' },
    ],
  },
  examples: [
    {
      label: 'Quoting one line',
      source: '> Can captains confirm the roster for tonight?\nConfirmed for Team Lemon, all five of us.',
      note: 'Only the line that starts with `>` is quoted. The next line is your own text.',
    },
    {
      label: 'Quoting the rest of the message with >>>',
      source: '>>> Rule 1: be kind.\nRule 2: no spam.\nRule 3: keep it on topic.',
      note: 'Everything after `>>>` is quoted until the end of the message, so anything you want outside the quote has to come before it.',
    },
    {
      label: 'Several lines with > on each',
      source: '> Is the event still on Saturday?\n> And do we need to sign up?\nYes to both. Sign-ups close Friday.',
      note: 'Starting each line with `> ` quotes several lines and still lets you write below the quote.',
    },
    {
      label: 'Formatting inside a quote',
      source: '> **Announcement:** game night moves to ~~Friday~~ Saturday.\n> - Doors open at 7 PM\n> - Bring your own snacks',
      note: 'Bold, strikethrough, lists and other formatting work inside quotes.',
    },
  ],
  sections: [
    {
      h2: 'What is the difference between > and >>> on Discord?',
      paragraphs: [
        'A single `>` quotes one line: the line it starts. A triple `>>>` quotes the line it starts and every line after it, to the end of the message. Discord’s help article shows the difference with the same three lines typed both ways: with `>` only the first line gets the quote bar, with `>>>` all three do. Both need a space after the angle brackets.',
        'Standard markdown has no `>>>` shortcut: it quotes several lines by putting `>` at the start of each one. That works on Discord too, and it is the way to quote a few lines and then keep writing, because a `>>>` quote cannot be ended inside the same message. In standard markdown, `>>>` means a quote nested three levels deep, so text written for Discord looks different when pasted into other markdown tools.',
      ],
      table: {
        head: ['You type', 'What is quoted', 'Use it for'],
        rows: [
          ['`> text`', 'That line only', 'One sentence, with your answer below it'],
          ['`>>> text`', 'That line and everything after it in the message', 'A long passage, a set of rules, or pasted text at the end of your message'],
          ['`> ` at the start of each line', 'Only the lines that start with it', 'Several lines with your own text before or after them'],
        ],
      },
    },
    {
      h2: 'Should you reply or quote on Discord?',
      paragraphs: [
        'Replying is Discord’s built-in way to respond to a message. On desktop, hover over the message and click Reply, or use the three-dot menu or a right-click; on mobile, long-press the message and tap Reply. Your message then shows a preview of the original above it. Replies ping the original author by default; switch that off with the mention toggle shown while you write the reply.',
        'Quote instead when you want only part of a message, when you combine lines from several messages, when the text comes from outside Discord (an article, a rule, an email), or when the original is in another channel. A quote is text you wrote, so it does not link to the source and does not change if the original is edited or deleted. The two combine well: the example in Discord’s own help article is a reply whose text is a quote.',
        'To share a whole message in another channel or a DM, Discord also has Forward. It posts a copy labeled Forwarded, without the original author’s name, and the copy does not update if the original is edited.',
      ],
      table: {
        head: ['Method', 'How', 'What readers see'],
        rows: [
          ['Reply', 'Reply button on hover (desktop), or long-press and Reply (mobile)', 'A preview of the original above your message; the author is pinged by default'],
          ['Quote', 'Type `> ` and paste the words you want', 'Only the quoted words, with a bar beside them; nobody is notified unless you mention them'],
          ['Forward', 'Forward button on hover (desktop), or long-press and Forward (mobile)', 'A copy labeled Forwarded, without the original author'],
        ],
      },
    },
    {
      h2: 'Why is my Discord quote not working?',
      paragraphs: [
        'Most failures are one of four things. There is no space after the angle bracket: `>text` is shown as typed, and Discord’s help article specifically reminds you to add the space. The `>` is not the first character on the line. The quote is inside inline code or a code block, where everything is shown literally. Or the character is a look-alike, such as the single angle quotation mark `›` or the full-width `＞`, which can appear in text pasted from other apps.',
        'If a `>>>` quote swallowed text you meant to keep outside it, that is how it works: it runs to the end of the message. Move your own words above the quote, put `> ` at the start of each quoted line instead, or send the rest as a second message.',
      ],
    },
    {
      h2: 'How do you quote someone on Discord?',
      paragraphs: [
        'Copy the words you want, start a new line in the message box with `> `, paste them, and write your answer on the next line. To show who said it, add their name or @mention them under the quote; a mention notifies them, a plain name does not. On desktop and web you can also highlight text in the message box and use the quote button in the formatting bar that appears: Discord’s Spoiler Tags help article pictures that bar with quote, code and spoiler buttons.',
        'Keep quotes short and quote only what you are answering. For a long passage, `>>>` at the end of your message reads better than many `>` lines, and for code or logs a [code block](/discord-markdown/code-block) keeps the spacing that a quote would lose. To move a document with quotes into Discord, the [markdown to Discord converter](/markdown-to-discord) keeps `>` lines as they are; the [blockquote guide](/guides/markdown-quote) covers quotes in other markdown tools.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you quote on Discord mobile?',
      a: 'Type a greater-than sign and a space at the start of a line, then the text: `> like this`. For several lines, start with `>>>` and a space. The greater-than sign is on the symbols page of the phone keyboard. To respond to one particular message instead, long-press it and tap Reply, which shows the original above your message.',
    },
    {
      q: 'How do you end a block quote on Discord?',
      a: 'A `>` quote ends by itself at the end of its line, so the next line without `>` is normal text. A `>>>` quote cannot be ended: it runs to the end of the message. To write something after a multi-line quote, put `>` and a space at the start of each quoted line instead of using `>>>`, or send your answer as a separate message.',
    },
    {
      q: 'What is the difference between replying and quoting on Discord?',
      a: 'A reply is attached to the original message: Discord shows a preview of it above yours and pings its author unless you switch that off. A quote is text you copy into your own message after `>`; it shows only the words you chose, notifies no one unless you @mention them, and stays the same if the original is edited. Replies suit quick back-and-forth; quotes suit picking out one line.',
    },
    {
      q: 'Does replying on Discord notify the person?',
      a: 'Yes, by default. Discord’s Replies FAQ says replies ping the author of the original message, and you can turn that off with the mention toggle while writing the reply. Bots work the other way round: in Discord’s API the `replied_user` option of allowed mentions defaults to false, so a bot’s reply pings the author only when the bot turns it on.',
    },
    {
      q: 'Why does my Discord quote show the > symbol?',
      a: 'Usually because there is no space after it: Discord needs `> text`, not `>text`. Also check that the `>` is the first character on the line, that the line is not inside inline code or a code block, and that you typed a real greater-than sign rather than a look-alike pasted from another app. To show a `>` on purpose, put a backslash in front of it.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), Block Quotes', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: Replies FAQ', url: 'https://support.discord.com/hc/en-us/articles/360057382374-Replies-FAQ' },
    { label: 'Discord: Message Forwarding', url: 'https://support.discord.com/hc/en-us/articles/24640649961367-Message-Forwarding' },
    { label: 'Discord: Spoiler Tags (formatting bar screenshot)', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord blog: 9 Tips for Hanging Out on Discord (formatted quote example)', url: 'https://discord.com/blog/9-tips-for-hanging-out-on-discord' },
    { label: 'Discord developer docs: Message resource (replies, allowed mentions)', url: 'https://docs.discord.com/developers/resources/message' },
    { label: 'CommonMark spec: block quotes', url: 'https://spec.commonmark.org/0.31.2/#block-quotes' },
  ],
  related: ['/discord-markdown', '/discord-markdown/code-block', '/guides/markdown-quote', '/markdown-to-discord', '/slack-markdown', '/reddit-markdown'],
};

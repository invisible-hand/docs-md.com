import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'code-block',
  title: 'Discord Code Blocks: Inline Code and Syntax Highlighting',
  description:
    'Make a code block on Discord: one backtick for inline code, three for a block, plus a language name for syntax highlighting. Examples and fixes.',
  h1: 'How to make a code block on Discord',
  label: 'Code block',
  updated: '2026-11-03',
  answer:
    'Wrap a short piece of text in single backticks for inline code, as in `npm install`. For several lines, put three backticks on their own line above and below the text. Add a language name right after the opening three backticks, such as `py`, and Discord colors the code. Formatting characters inside code are shown exactly as typed.',
  anatomy: {
    title: 'Discord code block syntax',
    parts: [
      { text: '```', label: 'three backticks', kind: 'marker' },
      { text: 'py', label: 'language (optional)', kind: 'extra' },
      { text: 'print("hello")', label: 'code, from the next line', kind: 'content' },
      { text: '```', label: 'three backticks', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'Inline code in a sentence',
      source: 'Run `npm install`, then start the bot with `node index.js`.',
    },
    {
      label: 'Multi-line code block',
      source: '```\nname: lemon-bot\nprefix: !\nlog_level: info\n```',
      note: 'Line breaks and spaces are kept exactly, in a monospace font.',
    },
    {
      label: 'Code block with syntax highlighting',
      source: '```py\ndef greet(name):\n    return f"Hello, {name}!"\n```',
      note: 'Discord colors the code according to the language name. This preview shows the block in a single color.',
    },
    {
      label: 'Markdown is ignored inside code',
      source: 'This is **bold**, but `**this is not**`.\n```\n**still not bold** ||and not hidden||\n```',
      note: 'Inline code and code blocks show asterisks, underscores and spoiler bars as typed.',
    },
    {
      label: 'Inline code inside a list',
      source: '- Install: `npm i discord.js`\n- Run: `node bot.js`\n- Stop: `Ctrl+C`',
    },
  ],
  sections: [
    {
      h2: 'Inline code or a code block: which one?',
      paragraphs: [
        'Discord has two kinds of code formatting. Single backticks around a word or phrase make inline code: the text stays in the sentence, in a monospace font on a darker background. Discord’s help article calls this a one-line code block and its patch notes call it an inline code block; it is the same thing. Three backticks make a code block: a separate box that keeps every line break and space exactly as typed.',
        'Use inline code for commands, file names, settings and anything a reader might copy. Use a code block for more than one line: code, logs, error messages, configuration, or plain-text tables that need their columns lined up. Discord shows a Copy Code button inside code blocks (its April 2025 patch notes moved the button into the block), so readers can copy the contents in one click.',
      ],
      table: {
        head: ['Format', 'You type', 'Best for'],
        rows: [
          ['Inline code', 'One backtick on each side of the text', 'A command, file name or short value inside a sentence'],
          ['Code block', 'Three backticks on the line above and the line below', 'Several lines where spacing matters: code, logs, config'],
          ['Highlighted code block', 'Three backticks plus a language name, such as `js`, then the code on the next line', 'Code you want colored by language'],
        ],
      },
    },
    {
      h2: 'How do you add syntax highlighting to a Discord code block?',
      paragraphs: [
        'Write the language name directly after the opening three backticks, on the same line and with no space, then start the code on the next line. Close the block with three backticks on a line of their own. Discord’s known-issues page for its message box notes that highlighting is turned off on the last line when the closing backticks do not end on their own line, which is one more reason to give them a separate line.',
        'Discord lists syntax highlighting among its features but does not publish the language names it recognizes. Common languages are worth trying by their full name and by their usual short form or file extension: `python` or `py`, `javascript` or `js`, `typescript` or `ts`, `json`, `css`, `html`, `bash`, `sql`. If the block arrives in a single color, Discord most likely did not recognize the name, so try the other spelling.',
      ],
    },
    {
      h2: 'Can you make colored text with a code block?',
      paragraphs: [
        'Colored text on Discord is usually made with a code block whose language name is `ansi`, with escape codes inside that switch colors on and off. Discord’s help center does not document this, so treat it as unofficial behavior that could change. The [Discord colored text generator](/discord-colored-text-generator) builds the block for you, so you do not have to type the escape codes by hand.',
      ],
    },
    {
      h2: 'Why is my Discord code block not working?',
      paragraphs: [
        'The most common cause is the wrong character. The backtick is the key to the left of the 1 key on US keyboards, under Esc, and it is not the same as an apostrophe (`\'`) or an accent mark (`´`). On phone keyboards it is on a symbols page, and on some keyboards it hides behind a long press on the apostrophe key.',
        'If the block never ends, check that the closing three backticks are there: without them Discord has nothing to end the block on. If highlighting does not appear, check that the language name touches the opening backticks with no space and that the code starts on the next line. Discord’s help article also shows the backticks attached directly to the first and last lines of text, which works for plain blocks, but separate lines are easier to read and to edit.',
        'To show a backtick inside inline code, try wrapping the code in two backticks on each side instead of one, which is how standard markdown handles it. Inside a three-backtick block, a single backtick is just another character.',
      ],
    },
    {
      h2: 'Where do code blocks work on Discord?',
      paragraphs: [
        'Code blocks are part of message formatting, so they work in channels, direct messages and threads, and in the content of messages that bots send. A code block can also be hidden: put [spoiler](/discord-markdown/spoiler) bars around the whole block and readers click to reveal it. Discord’s October 6, 2026 patch notes fixed how such spoilered code blocks reveal on desktop and Android.',
        'Discord has no table syntax, so a code block is also the usual way to share a table: the monospace font keeps padded columns aligned. The [markdown to Discord converter](/markdown-to-discord) does this for you, turning markdown tables into an aligned grid inside a code block and keeping the language names on code blocks.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you make a code block on Discord mobile?',
      a: 'Type the same characters as on desktop: three backticks, a new line, your code, a new line, and three more backticks. Inline code is one backtick on each side. The backtick is on the symbols page of the keyboard, or behind a long press on the apostrophe on some keyboards. Code blocks display in the phone apps too; recent patch notes include fixes to how Android draws them.',
    },
    {
      q: 'What languages does Discord syntax highlighting support?',
      a: 'Discord does not publish a list. Write the language name right after the opening three backticks and try the common forms: `python` or `py`, `javascript` or `js`, `typescript` or `ts`, `json`, `css`, `html`, `bash`, `sql`. If the code comes out in one color, try the other spelling. The `ansi` name is used for colored text rather than code, and Discord does not document it.',
    },
    {
      q: 'How do you copy code from a Discord code block?',
      a: 'Use the Copy Code button that Discord shows inside the code block; its April 2025 patch notes moved the button into the block itself. If you do not see the button, select the text and copy it as usual. Inline code has no button, so select it by hand, or ask the sender to put longer snippets in a full code block.',
    },
    {
      q: 'Does formatting work inside a Discord code block?',
      a: 'No. Bold, italics, underline, strikethrough and spoilers are all shown as typed inside inline code and code blocks. Discord’s Spoiler Tags article says so for spoilers, and Discord’s engineering blog describes formatting inside code blocks as something that should not happen. That makes code the simplest way to show markdown characters literally, for example to explain a command that contains asterisks.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), Code Blocks', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: Spoiler Tags (spoilers are not hidden in code blocks)', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord: [Known Issues] New Chat Text Box (syntax highlighting)', url: 'https://support.discord.com/hc/en-us/articles/360037842511--Known-Issues-New-Chat-Text-Box' },
    { label: 'Discord Patch Notes: April 3, 2025 (Copy Code button)', url: 'https://discord.com/blog/discord-patch-notes-april-3-2025' },
    { label: 'Discord Patch Notes: October 6, 2026 (spoilered and inline code blocks)', url: 'https://discord.com/blog/discord-patch-notes-october-6-2026' },
    { label: 'Discord blog: Why open source communities use Discord (syntax highlighting)', url: 'https://discord.com/blog/why-reactiflux-vue-land-yarn-and-other-open-source-communities-use-discord' },
    { label: 'Discord blog: How Discord Renders Rich Messages on the Android App', url: 'https://discord.com/blog/how-discord-renders-rich-messages-on-the-android-app' },
    { label: 'GitHub Flavored Markdown spec: fenced code blocks and info strings', url: 'https://github.github.com/gfm/#fenced-code-blocks' },
  ],
  related: ['/discord-markdown', '/discord-colored-text-generator', '/discord-markdown/spoiler', '/guides/markdown-code-block', '/markdown-to-discord'],
};

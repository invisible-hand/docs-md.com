import type { DiscordGuide } from './types';

// The example sources contain the real escape character (U+001B, written \u001b below) so that the
// copy button gives text that works when pasted into Discord. It is invisible in the "You type" pane.
export const GUIDE: DiscordGuide = {
  slug: 'colored-text',
  title: 'Discord Colored Text: How to Color Text (ANSI)',
  description:
    'Color text on Discord with an ansi code block and ESC[31m-style codes: 8 text and 8 background colors, bold, underline, the mobile caveat, the diff trick.',
  h1: 'How to make colored text on Discord',
  label: 'Colored text',
  updated: '2026-11-03',
  answer:
    'Put the text in a code block tagged `ansi` and start each colored part with an escape code like `ESC[31m` (red), where ESC is the invisible escape character U+001B. Discord has no color markdown and leaves this trick undocumented; community reports say it works on desktop and web, not on mobile. The [colored text generator](/discord-colored-text-generator) writes the codes.',
  anatomy: {
    title: 'One ANSI color code inside an ansi code block',
    parts: [
      { text: 'ESC[', label: 'escape character + bracket', kind: 'marker' },
      { text: '1;31', label: 'bold ; red', kind: 'extra' },
      { text: 'm', label: 'ends the code', kind: 'marker' },
      { text: 'Warning', label: 'your text', kind: 'content' },
      { text: 'ESC[0m', label: 'reset', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'Red text',
      source: '```ansi\n\u001b[31mThis line is red\u001b[0m\n```',
      note: 'The escape character is invisible, so the “You type” box seems to be missing something before each `[`. It is there, and the copy button includes it. That invisibility is why most people paste from a generator rather than typing the codes.',
    },
    {
      label: 'All eight text colors',
      source: '```ansi\n\u001b[30mGray (30)\u001b[0m\n\u001b[31mRed (31)\u001b[0m\n\u001b[32mGreen (32)\u001b[0m\n\u001b[33mYellow (33)\u001b[0m\n\u001b[34mBlue (34)\u001b[0m\n\u001b[35mPink (35)\u001b[0m\n\u001b[36mCyan (36)\u001b[0m\n\u001b[37mWhite (37)\u001b[0m\n```',
      note: 'Codes 30 to 37 set the text color. Each one stays in force until the next code, so every line here ends with `ESC[0m`, the reset.',
    },
    {
      label: 'Bold, underline and backgrounds',
      source: '```ansi\n\u001b[1mBold (1)\u001b[0m  \u001b[4mUnderline (4)\u001b[0m  \u001b[1;4;32mBold, underlined, green\u001b[0m\n\u001b[41mOrange background (41)\u001b[0m  \u001b[37;45mWhite on indigo (37;45)\u001b[0m\n```',
      note: 'Several codes go in one sequence, separated by semicolons: `1;4;32` is bold, underlined and green. Codes 40 to 47 set the background.',
    },
    {
      label: 'Colors only exist inside the ansi block',
      source: 'Outside a code block there is no color syntax: **bold** works, red does not.\n```ansi\n\u001b[31mInside an ansi block, red works.\u001b[0m\n```',
      note: 'Discord’s formatting article has no color option, and markdown such as `**bold**` does nothing inside the block. You choose one or the other for each piece of text.',
    },
  ],
  sections: [
    {
      h2: 'How does colored text work on Discord?',
      paragraphs: [
        'Discord’s Markdown Text 101 article lists everything you can do to message text, and color is not on the list: there is no color button, no slash command and no markdown for it. What people call colored text is a side effect of code blocks. Discord highlights code blocks by language, and when the language name after the opening backticks is `ansi`, it reads the terminal color codes inside the block, the same ANSI escape sequences that color text in a command line, and paints the text accordingly.',
        'A sequence is the escape character (U+001B, usually written `ESC` or `\\u001b` in documentation), then `[`, then one or more numbers separated by semicolons, then `m`. `ESC[31m` turns the text red from that point on, `ESC[1;31m` makes it bold and red, and `ESC[0m` resets everything to normal. The codes apply until the next sequence, so a line usually starts with a color and ends with a reset. The escape character cannot be typed on a normal keyboard, which is the main reason the [colored text generator](/discord-colored-text-generator) exists: it assembles the block and copies the invisible characters with it.',
        'Discord does not document any of this. Neither its help center nor its developer docs mention the `ansi` language or the color codes; the facts on this page come from community guides, principally the Python Discord guide to colored messages, and from threads on Discord’s own feedback forum. Treat it as behavior Discord could change without notice, and keep anything important readable in plain text as well.',
      ],
    },
    {
      h2: 'Which color codes does Discord show?',
      paragraphs: [
        'Eight text colors, eight background colors, bold and underline. The numbers are the standard ANSI ones, but Discord maps them to its own fixed palette, so a code gives you Discord’s red, not a red you choose: there is no code for an arbitrary hex or RGB color. The names below are the ones the Python Discord guide uses; the generator shows a swatch of each.',
      ],
      table: {
        head: ['Code', 'Effect', 'Code', 'Effect'],
        rows: [
          ['`0`', 'Reset (normal text)', '`40`', 'Dark blue background'],
          ['`1`', 'Bold', '`41`', 'Orange background'],
          ['`4`', 'Underline', '`42`', 'Marble blue background'],
          ['`30`', 'Gray text', '`43`', 'Greyish turquoise background'],
          ['`31`', 'Red text', '`44`', 'Gray background'],
          ['`32`', 'Green text', '`45`', 'Indigo background'],
          ['`33`', 'Yellow text', '`46`', 'Light gray background'],
          ['`34`', 'Blue text', '`47`', 'White background'],
          ['`35`', 'Pink text', '', ''],
          ['`36`', 'Cyan text', '', ''],
          ['`37`', 'White text', '', ''],
        ],
      },
    },
    {
      h2: 'Does Discord colored text work on mobile?',
      paragraphs: [
        'Not according to every report we could find, and Discord has published nothing either way. The Python Discord guide states that the change reached all stable desktop clients and that ANSI is not supported on mobile. An archived thread on Discord’s own feedback forum, titled “ANSI formatting is unreadable on mobile”, describes the codes showing up unescaped on iOS and Android at the time it was written; more recent community reports describe the mobile apps showing the block as plain uncolored text. We could not verify the current mobile behavior in any Discord documentation, so test with a phone before you rely on it.',
        'The practical rule: if a meaningful share of your server reads on phones, never let color carry the meaning on its own. Put the status word in the text (“PASS”, “FAIL”) and let the color be a bonus for desktop readers. For emphasis that works everywhere, Discord’s regular [bold, italics and underline](/discord-markdown/bold-italics-underline) need no special characters.',
      ],
    },
    {
      h2: 'What is the syntax-highlighting trick with diff, css and json?',
      paragraphs: [
        'The older way to get color is to borrow a programming language’s highlighting. Discord lists syntax highlighting among its features, and its known-issues notes for the chat box mention highlighting in code blocks, so a block tagged with a language name is colored according to that language’s grammar. Community guides most often use `diff`, where lines beginning with `-` and `+` are highlighted as removed and added lines, and `css`, `yaml` or `json`, where property names, strings and numbers each get their own color. The text has to be shaped like code in that language, which limits what you can write.',
        'Compared with `ansi`, this method gives you no control over which word gets which color, but it needs no invisible characters, so it survives being retyped. Discord publishes neither the list of languages it highlights nor the color theme, so try a block and look. The preview on this page does not show syntax highlighting for these languages; the [code block page](/discord-markdown/code-block) covers language tags in general.',
      ],
    },
    {
      h2: 'Why is my Discord colored text not working?',
      paragraphs: [
        'Start with the block itself: the language name must be `ansi`, directly after the three opening backticks with no space, and the block needs its closing backticks. Then check the escape character. If the message shows text such as `[0;31m` in plain gray, the escape character was lost somewhere between the generator and the message box, usually because the text was retyped or passed through something that strips control characters; copy it again from the generator and paste it straight in. If the text comes from a bot, the code must send the real character, `\\u001b` in most programming languages, not the four letters.',
        'If the block looks right on your computer and plain on a phone, that is the mobile limitation above, not a mistake. If one color leaks into the next line, add a reset, `ESC[0m`, at the end of each colored part. And if a code does nothing at all, it is probably outside the set Discord renders: only the numbers in the table are known to work, and a thread on Discord’s feedback forum asks for RGB sequences such as `38;2;…` precisely because they are not supported.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you make red text on Discord?',
      a: 'Send a code block whose language is `ansi`, with the sequence `ESC[31m` before the words and `ESC[0m` after them, where ESC is the invisible escape character U+001B. Because that character cannot be typed, the simplest route is the colored text generator: pick red, type the words, copy the block and paste it into Discord. Red is code 31; the other text colors are 30 to 37.',
    },
    {
      q: 'Can you color text on Discord without a code block?',
      a: 'No. Discord’s formatting article documents bold, italics, underline, strikethrough, spoilers, headers, subtext, lists, quotes, masked links and code, and no color. The only colored text in a message is inside a code block, either an `ansi` block with escape codes or a block tagged with a programming language whose highlighting colors parts of the text. Both are monospaced and neither accepts ordinary markdown inside.',
    },
    {
      q: 'Why does my colored text show [0;31m instead of colors?',
      a: 'Because the escape character in front of each `[` is missing, so Discord sees ordinary text. It is an invisible control character that gets dropped when the codes are retyped by hand or passed through a tool that strips such characters. Copy the message again with the generator’s button and paste it straight into Discord. In a bot, make sure the code sends the real character (`\\u001b` in most languages) rather than those six letters.',
    },
    {
      q: 'Does Discord colored text work on mobile?',
      a: 'Community reports say no, and Discord has not documented the feature at all. The Python Discord guide states that ANSI is not supported on mobile, and threads on Discord’s own feedback forum describe the block appearing without colors, or with the raw codes, on iOS and Android. We could not verify the current behavior in Discord’s documentation. Keep the meaning in the words, not just the color, so readers on phones are not left out.',
    },
    {
      q: 'Which colors can you use in Discord colored text?',
      a: 'Eight text colors, codes 30 to 37: gray, red, green, yellow, blue, pink, cyan and white. Eight background colors, codes 40 to 47. Plus bold (1) and underline (4), with 0 resetting everything. Discord maps each code to a fixed shade of its own, so you cannot pick an arbitrary hex or RGB value, and some combinations are hard to read on the dark theme. The generator shows a swatch of every code.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), no color option; code blocks', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: [Known Issues] New Chat Text Box (syntax highlighting in code blocks)', url: 'https://support.discord.com/hc/en-us/articles/360037842511--Known-Issues-New-Chat-Text-Box' },
    { label: 'Discord blog: Why open source communities use Discord (syntax highlighting)', url: 'https://discord.com/blog/why-reactiflux-vue-land-yarn-and-other-open-source-communities-use-discord' },
    { label: 'Python Discord: Discord Messages with Colors (community guide: codes, palette, mobile note)', url: 'https://pythondiscord.com/pages/guides/python-guides/discord-messages-with-colors/' },
    { label: 'Discord feedback forum (community, archived): ANSI formatting is unreadable on mobile', url: 'https://support.discord.com/hc/en-us/community/posts/8128597744919-ANSI-formatting-is-unreadable-on-mobile' },
  ],
  related: ['/discord-colored-text-generator', '/discord-markdown', '/discord-markdown/code-block', '/discord-markdown/bold-italics-underline'],
};

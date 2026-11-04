import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'big-text',
  title: 'Big Text on Discord: How to Make Text Bigger',
  description:
    'Discord has no font size for messages. Make text bigger with headers (# ## ###), see what bold, emoji and font generators really do, and why the # shows.',
  h1: 'How to make text bigger on Discord',
  label: 'Big text',
  updated: '2026-11-03',
  answer:
    'Start a line with a hash and a space: `# Big text`. Discord has no font-size setting for messages, so headers are the only markdown that makes text larger for everyone who reads it: `#` is the biggest, `##` and `###` are smaller, and `-#` goes below normal size. The hashes must open the line, and the space is required.',
  anatomy: {
    title: 'Discord big text (header) syntax',
    parts: [
      { text: '#', label: 'one hash: biggest size', kind: 'marker' },
      { text: ' ', label: 'a space (required)', kind: 'marker' },
      { text: 'Big text here', label: 'the rest of the line', kind: 'content' },
    ],
  },
  examples: [
    {
      label: 'The three sizes above normal text',
      source: '# Biggest text\n## Bigger text\n### Slightly bigger text\nNormal text, for comparison',
      note: 'Discord’s help article calls these a big header, a smaller header and an even smaller header. Each line needs its own hashes.',
    },
    {
      label: 'A big title above a normal message',
      source: '# Movie night is on\nWe start at 8 PM in the voice channel. Bring snacks.\n-# Subtext is the smallest size Discord has.',
      note: 'The layout from Discord’s own example: a header for the title, normal text for the message, subtext for the small print.',
    },
    {
      label: 'Bold is heavier, not bigger',
      source: '**Bold text stays the same size.**\n# A header is actually bigger.',
      note: 'Two asterisks change the weight of the letters, not their size. For larger letters, use a header.',
    },
    {
      label: 'Why the hash sometimes shows',
      source: '#No space, so the hash stays\nRules # a hash in the middle of a line does nothing\n# A space after an opening hash makes big text',
      note: 'Discord’s help article: the hashes must be the first characters on a new line, followed by a space.',
    },
  ],
  sections: [
    {
      h2: 'Does Discord have a font size setting for messages?',
      paragraphs: [
        'No. Discord’s own shortcuts guide says it plainly: Discord does not have built-in font commands, and it points to markdown for formatting instead. Its Markdown Text 101 article lists everything you can do to message text (bold, italics, underline, strikethrough, headers, subtext, masked links, lists, code blocks, block quotes and spoilers) and none of those is a size or a font picker. There is no slash command, menu or setting that makes one message bigger for other people.',
        'What Discord does have is a scale of line sizes. Three header levels sit above normal text and one subtext level sits below it. Discord’s blog describes the scale as “REALLY BIG, kinda big, sorta big, or itty bitty”. Every search for big text on Discord ends at the same answer: the single-hash header.',
      ],
      table: {
        head: ['You type', 'Discord shows', 'Size'],
        rows: [
          ['`# Text`', 'A big header', 'Largest, in bold'],
          ['`## Text`', 'A smaller header', 'Large'],
          ['`### Text`', 'An even smaller header', 'Slightly larger than normal'],
          ['Text', 'Normal message text', 'Normal'],
          ['`-# Text`', 'Subtext', 'Smaller and dimmer than normal'],
        ],
      },
    },
    {
      h2: 'How do you make text bigger with headers?',
      paragraphs: [
        'Type one, two or three hash signs as the very first characters of a line, then a space, then the words. The header runs to the end of that line, so to go back to normal size start a new line without hashes. One message can hold several headers and several normal lines, which is how announcements, rules posts and patch notes are usually laid out. The [headers page](/discord-markdown/headers) goes through the syntax in detail.',
        'Three rules cover almost every problem. The hashes must open the line: a hash after other words is just a hash. The space after the hashes is required: `#Text` stays as typed. And there are exactly three levels: Discord documents `#`, `##` and `###`, so four hashes are not a fourth size. A header inside inline code or a code block is shown as typed too, because code turns markdown off.',
        'Headers are part of message markdown, so a bot that puts `# Title` in its message content gets the same big text a person would. Standard markdown goes down to six heading levels, which matters when you paste a document in: the [markdown to Discord converter](/markdown-to-discord) rewrites anything below `###` as a bold line.',
      ],
    },
    {
      h2: 'What about bold, emoji and font generators?',
      paragraphs: [
        'Bold is the most common wrong turn. Discord’s blog introduces bold as a way to make your words “BIG and BOLD”, and two asterisks do make text stand out, but what changes is the weight of the letters, not their height. Put a header on the line if you want both; the [bold, italics and underline page](/discord-markdown/bold-italics-underline) covers the emphasis markers.',
        'Emoji are the one thing Discord enlarges on its own. Its emoji article says that a message with no other characters and just emoji is shown as a “wumboji”, a bigger version of the emoji, up to 27 of them in one message before they size back down. Add a single letter and the emoji shrink back to text size. The article also notes that emoji do not get the wumboji treatment in Compact mode. The preview on this page does not enlarge emoji.',
        '“Big text generators” and “fancy font” sites do something different again. They replace each letter with a Unicode look-alike, such as 𝗕𝗼𝗹𝗱 𝗹𝗲𝗧𝗧𝗲𝗿𝘀 from the mathematical alphabets. Those are different characters, not formatting, so they survive where markdown does nothing, such as a nickname, but they are the same height as normal text, screen readers may read them oddly or skip them, and people searching the chat for the ordinary word will not find them. Inside a message, a header does the job with real letters.',
      ],
    },
    {
      h2: 'How do you make Discord text bigger just for yourself?',
      paragraphs: [
        'If the problem is reading, not writing, change your own display instead of the message. Discord’s appearance settings article describes two sliders under User Settings, then Appearance. Chat Font Scaling changes only the size of chat text and leaves other elements as they are. Zoom Level changes the size of everything in Discord, text included; the desktop app has a slider for it, and in a browser you use the browser’s own zoom with Ctrl or Cmd and plus or minus. The article notes that zoom amplifies whatever font size you chose, so the two stack.',
        'These settings affect only your screen. Everyone else keeps their own sizes, and nothing in the message changes. Discord adds that the steps may look slightly different on mobile.',
      ],
    },
    {
      h2: 'Why is my big text not working on Discord?',
      paragraphs: [
        'Check the line character by character. The hashes must be the first thing on the line, with nothing before them, not even a space or an emoji. There must be a space between the hashes and the words. There must be one to three hashes, not more. The line must not be inside a code block or inline code, where every character is shown as typed. If you pasted the text from somewhere else, delete and retype the opening hashes to be sure nothing invisible is in front of them. When all of that is right and the text is still normal size, you are probably looking at `-#`, which is subtext and goes the other way: see the [small text page](/discord-markdown/small-text).',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you make text bigger on Discord mobile?',
      a: 'Type a hash and a space at the start of the line, then your text: `# Big text`. Discord’s help article describes headers for chat messages without separate steps for the phone apps, and the hash is on the symbols page of the keyboard. For a smaller header use `##` or `###`. To enlarge chat text only on your own phone, look for the appearance settings under User Settings; Discord notes that the steps may look slightly different on mobile.',
    },
    {
      q: 'What is the biggest text you can make on Discord?',
      a: 'A single-hash header, `# like this`, is the largest text Discord documents for a message. Nothing goes above it: four hashes are not a bigger header, and bold only changes the weight of the letters. The one exception is emoji. Discord’s emoji article says a message that contains nothing but emoji is shown at a larger size, which it calls a wumboji, for up to 27 emoji in one message.',
    },
    {
      q: 'Can you change the font size of a Discord message?',
      a: 'Not for other people. Discord’s shortcuts guide says there are no built-in font commands; headers are the only markdown that changes the size of message text, and they come in three fixed sizes. For your own screen, Discord’s appearance settings have a Chat Font Scaling slider that changes only the size of chat text, and a Zoom Level that changes everything, so you can make all messages easier to read without touching what anyone else sees.',
    },
    {
      q: 'Does bold make text bigger on Discord?',
      a: 'No. Two asterisks, `**like this**`, make the letters heavier, which Discord’s blog describes as making your words big and bold, but their size does not change. If you want actually larger text, start the line with a hash and a space to make a header. Bold still has its place for a few words inside a normal sentence, where a header would turn the whole line into a title.',
    },
    {
      q: 'Why does Discord show four hashes instead of a header?',
      a: 'Because Discord documents three header levels, not six. Its help article lists `#`, `##` and `###`; a line that starts with `####` is not a header, so Discord shows the hashes as typed. Standard markdown goes down to `######`, which is why text pasted from a document or a README can arrive with too many hashes. Cut them to three or fewer, or let the markdown to Discord converter rewrite the deeper headings as bold lines.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), Headers and Subtext', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord blog: How to Make Your Discord Messages Bold, Italic, Underlined & Tons More (headers section)', url: 'https://discord.com/blog/make-your-discord-messages-bold-italic-underlined-and-more' },
    { label: 'Discord: Commands, Shortcuts, and Navigation Guide (no built-in font commands)', url: 'https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide' },
    { label: 'Discord: Customize Appearance Settings (Chat Font Scaling, Zoom Level)', url: 'https://support.discord.com/hc/en-us/articles/207260127-How-to-Change-Discord-Color-Themes-and-Customize-Appearance-Settings' },
    { label: 'Discord: How to Add Emojis on Discord (Wumboji)', url: 'https://support.discord.com/hc/en-us/articles/360041139231-How-to-Add-Emojis-on-Discord' },
  ],
  related: ['/discord-markdown', '/discord-markdown/headers', '/discord-markdown/small-text', '/discord-markdown/bold-italics-underline', '/markdown-to-discord'],
};

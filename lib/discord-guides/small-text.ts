import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'small-text',
  title: 'Discord Small Text: How to Use Subtext (-# text)',
  description:
    'Make small text on Discord with subtext: type -# and a space at the start of a line. How it compares with headers, where it works, and why it fails.',
  h1: 'How to make small text on Discord',
  label: 'Small text (subtext)',
  updated: '2026-11-03',
  answer:
    'Start the line with a hyphen, a hash and a space: `-# like this`. Discord shows that line smaller and dimmer than normal text, a format it calls subtext. The `-#` must be the very first thing on the line, the space after it is required, and every line you want small needs its own `-#`.',
  anatomy: {
    title: 'Discord subtext syntax',
    parts: [
      { text: '-#', label: 'hyphen and hash', kind: 'marker' },
      { text: ' ', label: 'a space (required)', kind: 'marker' },
      { text: 'small print here', label: 'your text, one line', kind: 'content' },
    ],
  },
  examples: [
    {
      label: 'Basic subtext',
      source: 'The tournament starts Friday at 7 PM.\n-# Check-in closes 15 minutes before the start.',
    },
    {
      label: 'Header, message and small print',
      source: '# Server update\nVoice channels are working again after this morning’s outage.\n-# Questions? Ask in the support thread.',
      note: 'This is the layout Discord’s help article uses for its own example: a header for the title, normal text for the message, subtext for the small print.',
    },
    {
      label: 'Several small lines',
      source: '-# Photo: taken by the mods\n-# Map data: community wiki\nThis line has no marker, so it stays normal size.',
      note: 'Subtext covers one line. Start every line you want small with its own `-#`.',
    },
    {
      label: 'Showing -# without formatting',
      source: '\\-# This line starts with a backslash, so it stays normal size.\nOr use inline code: `-# not small`',
      note: 'A backslash before the hyphen, or inline code, shows the marker exactly as typed.',
    },
  ],
  sections: [
    {
      h2: 'What does subtext look like on Discord?',
      paragraphs: [
        'Subtext is a line format, like a header but in the other direction. Discord’s help article puts it next to headers and says it works the same way: the marker goes at the very beginning of a line, followed by a space. The line comes out in a smaller font and a dimmer gray than the rest of the message, so it reads as a footnote rather than part of the conversation. Discord’s own blog shows it as the last step of the header scale and calls it a tiny header.',
        'Only the look changes. The words are ordinary text: readers can select and copy them, and the line sits in the message like any other. The table shows the full scale from biggest to smallest.',
      ],
      table: {
        head: ['You type', 'Discord shows'],
        rows: [
          ['`# Big header`', 'The largest header, in bold'],
          ['`## Smaller header`', 'A medium header'],
          ['`### Even smaller header`', 'The smallest header'],
          ['Plain text', 'Normal message text'],
          ['`-# Subtext`', 'Smaller and dimmer than normal text'],
        ],
      },
    },
    {
      h2: 'Why is my Discord subtext not working?',
      paragraphs: [
        'Almost every failure is one of four things. First, there is no space after the hash: `-#text` stays as typed, because Discord needs the hyphen, the hash and then a space. Second, something comes before the marker on the same line, as in `Note: -# small`; Discord’s help article says the `-#` must be at the very beginning of the line. Third, the characters are reversed: `#-` is not subtext. Fourth, the line is inside inline code or a code block, where Discord shows every character literally.',
        'If the text came from a document or a website, check that the first character is a plain hyphen-minus (`-`) and not an en dash (`–`) or a minus sign (`−`). They look almost the same but are different characters, and word processors can swap them in automatically.',
        'Remember that subtext covers one line. A second line without its own `-#` goes back to normal size, which is easy to mistake for subtext failing. In a profile’s About Me, a desktop bug made subtext appear only while editing and revert to the raw `-#` once saved; Discord’s October 6, 2026 patch notes list it as fixed, so update the app if you still see it.',
      ],
    },
    {
      h2: 'Where can you use subtext on Discord?',
      paragraphs: [
        'Discord’s help article says you can add subtext to any chat message, so it works in server channels, direct messages and threads alike. It also works in your profile’s About Me, which is where the October 2026 fix above applied. Bots and apps can use it too: Discord renders the markdown in a message’s content whoever sends it.',
        'Names are a different matter. Discord shows usernames and channel names as written; its September 8, 2026 patch notes even fixed a case where formatting characters in voice channel names were wrongly rendered as markdown in scheduled events. Typing `-#` in a name just adds two characters.',
      ],
    },
    {
      h2: 'What is subtext good for?',
      paragraphs: [
        'Discord’s own example puts it under an announcement: a header, the main text, then a subtext line with the small print about when to be in the voice channel. That pattern covers most uses: footnotes, sources, credits, disclaimers, last-updated notes, and asides that should be visible without competing with the main message.',
        'Keep it for information people can skip. Because subtext is smaller and lower in contrast, it is harder to read, so rules, deadlines and warnings belong in normal text or a [header](/discord-markdown/headers). For emphasis inside a sentence, use [bold, italics or underline](/discord-markdown/bold-italics-underline) instead of changing the size.',
        'Standard markdown has no equivalent of `-#`, so a document converted with the [markdown to Discord converter](/markdown-to-discord) will not contain subtext. Add the `-#` lines by hand after converting.',
      ],
    },
    {
      h2: 'Is subtext the same as a small text generator?',
      paragraphs: [
        'No. Websites that offer small text for Discord usually replace each letter with a Unicode look-alike, such as superscript letters (ˢᵐᵃˡˡ) or small capitals (ꜱᴍᴀʟʟ). Those are different characters, not formatting, so they can also appear where markdown does nothing, such as a nickname. The trade-offs: not every letter has a small form, screen readers may read them oddly or skip them, and people searching for the normal word may not find your message.',
        'Subtext keeps your text as normal letters and only changes how Discord draws the line, which makes it the better choice inside messages. For raised and lowered text in other markdown tools, see the [superscript](/guides/markdown-superscript) and [subscript](/guides/markdown-subscript) guides.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does Discord subtext work on mobile?',
      a: 'Discord’s help article describes subtext for any chat message and gives no separate steps for the phone apps, so type it the same way: a hyphen, a hash and a space at the start of a line, then your text. Both characters are on the symbols page of the keyboard. If the line still shows `-#`, check the space after the hash and make sure nothing, not even an emoji, comes before the hyphen.',
    },
    {
      q: 'What is the difference between -# and # on Discord?',
      a: 'Both apply to a whole line and both need a space after the marker. A single `#` makes the line a big bold header, `##` and `###` make smaller headers, and `-#` goes the other way: it makes the line smaller and dimmer than normal text. Discord’s own blog presents them as one scale and calls `-#` a tiny header. Use headers for titles and subtext for small print.',
    },
    {
      q: 'How do you make a whole message small on Discord?',
      a: 'Put `-#` and a space at the start of every line. Subtext applies to one line at a time, so a message with three lines needs three markers, and any line without one is shown at normal size. Discord documents no marker that shrinks a whole message at once, the way `>>>` quotes everything after it. Keep long passages in normal text: subtext is harder to read.',
    },
    {
      q: 'How do you type -# on Discord without making text small?',
      a: 'Put a backslash in front, as in `\\-# not small`: the hyphen and hash are shown as typed because the line no longer starts with the marker. Wrapping the text in backticks also works, since inline code shows every character literally in a monospace font. A `-#` anywhere other than the start of a line is always shown as typed.',
    },
    {
      q: 'Can you make text even smaller than subtext on Discord?',
      a: 'No. Discord documents three header sizes and one subtext size, and nothing smaller than subtext, so there is no further level to choose. If an aside is too long to sit comfortably in small print, move it out of the main message instead: a thread or a linked document keeps the announcement short and the details one click away.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), Subtext', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord blog: How to Make Your Discord Messages Bold, Italic, Underlined & Tons More', url: 'https://discord.com/blog/make-your-discord-messages-bold-italic-underlined-and-more' },
    { label: 'Discord Patch Notes: October 6, 2026 (subtext in profile bios)', url: 'https://discord.com/blog/discord-patch-notes-october-6-2026' },
    { label: 'Discord Patch Notes: September 8, 2026 (channel names shown as written)', url: 'https://discord.com/blog/discord-patch-notes-september-8-2026' },
    { label: 'Discord developer docs: Message formatting', url: 'https://docs.discord.com/developers/reference' },
  ],
  related: ['/discord-markdown', '/discord-markdown/headers', '/discord-markdown/bold-italics-underline', '/markdown-to-discord', '/guides/markdown-superscript'],
};

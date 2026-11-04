import type { DiscordGuide } from './types';

// All example codes use 1798747200 = 31 December 2026, 20:00 UTC.
export const GUIDE: DiscordGuide = {
  slug: 'timestamps',
  title: 'Discord Timestamp Format: The <t:UNIX:STYLE> Code Explained',
  description:
    'Discord’s timestamp code <t:UNIX:STYLE> shows one moment in each reader’s time zone. All nine style letters, how to get the Unix number, where it fails.',
  h1: 'How Discord timestamp codes work',
  label: 'Timestamps',
  updated: '2026-11-03',
  answer:
    'Type `<t:1798747200:F>`: the letter t, a Unix time in seconds and an optional style letter, all inside angle brackets. Discord replaces the code with that moment written in each reader’s own time zone and language, so one message is right for everyone. The [Discord timestamp generator](/discord-timestamp-generator) builds the code from a date you pick.',
  anatomy: {
    title: 'Discord timestamp syntax',
    parts: [
      { text: '<t:', label: 'opens the code', kind: 'marker' },
      { text: '1798747200', label: 'Unix time, in seconds', kind: 'content' },
      { text: ':R', label: 'style letter (optional)', kind: 'extra' },
      { text: '>', label: 'closes it', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'A timestamp with the default style',
      source: 'The New Year’s Eve party starts <t:1798747200>',
      note: 'Without a style letter Discord uses `f`, long date with short time. The preview shows the moment in your browser’s time zone, the way Discord shows it in each reader’s.',
    },
    {
      label: 'All nine styles',
      source: 't  <t:1798747200:t>\nT  <t:1798747200:T>\nd  <t:1798747200:d>\nD  <t:1798747200:D>\nf  <t:1798747200:f>\nF  <t:1798747200:F>\ns  <t:1798747200:s>\nS  <t:1798747200:S>\nR  <t:1798747200:R>',
      note: 'The same moment nine ways. Upper and lower case are different styles: `t` is a short time, `T` adds seconds; `d` is a numeric date, `D` spells the month out.',
    },
    {
      label: 'Date and countdown together',
      source: 'Raid night: <t:1798747200:F> (<t:1798747200:R>)',
      note: 'A common pattern for events: `F` gives the full date with the weekday, `R` says how far away it is.',
    },
    {
      label: 'Showing the code as text',
      source: 'Type `<t:1798747200:R>` and Discord shows <t:1798747200:R>',
      note: 'Inline code shows the characters as typed; outside the backticks the same code becomes a live time.',
    },
  ],
  sections: [
    {
      h2: 'What does each part of a Discord timestamp mean?',
      paragraphs: [
        'Discord’s developer reference lists two forms under message formatting: `<t:TIMESTAMP>` and `<t:TIMESTAMP:STYLE>`. The angle brackets and the lowercase `t` mark the code, the number is a Unix timestamp, and the optional letter after the second colon picks how the moment is written. The reference states that timestamps are expressed in seconds and are displayed in the user’s time zone and locale.',
        'That last sentence is the whole point of the feature. A plain “8 PM” means a different moment to every reader; a timestamp code holds one exact moment, and Discord does the conversion for each person who reads it. Someone in Tokyo and someone in New York see different clock times for the same code, and both are right. Because the code is message markdown, it works the same whether a person types it or a bot sends it.',
      ],
    },
    {
      h2: 'Which timestamp styles does Discord support?',
      paragraphs: [
        'Nine, listed in the developer reference with the example outputs below. The letters are case-sensitive: `t` and `T`, `d` and `D`, `f` and `F`, `s` and `S` are four pairs of related styles, and `R` stands alone. Leaving the letter out is the same as `f`.',
        'The examples come from Discord’s documentation and use its locale; the exact order and punctuation follow each reader’s own language settings, so the same code can read `20/04/2021` for one person and in another order for someone else. Only the moment is fixed.',
      ],
      table: {
        head: ['Style', 'Name', 'Example output'],
        rows: [
          ['`t`', 'Short time', '16:20'],
          ['`T`', 'Medium time', '16:20:30'],
          ['`d`', 'Short date', '20/04/2021'],
          ['`D`', 'Long date', 'April 20, 2021'],
          ['`f` (default)', 'Long date, short time', 'April 20, 2021 at 16:20'],
          ['`F`', 'Full date, short time', 'Tuesday, April 20, 2021 at 16:20'],
          ['`s`', 'Short date, short time', '20/04/2021, 16:20'],
          ['`S`', 'Short date, medium time', '20/04/2021, 16:20:30'],
          ['`R`', 'Relative time', '4 years ago'],
        ],
      },
    },
    {
      h2: 'How do you get the Unix timestamp for a date?',
      paragraphs: [
        'A Unix timestamp is the number of seconds since 1 January 1970, 00:00 UTC. The quickest route is the [Discord timestamp generator](/discord-timestamp-generator): pick the date, time and time zone and copy any of the nine codes with the number already filled in. It also decodes a code you paste in, so you can check what moment someone else’s timestamp stands for.',
        'If you prefer a terminal or code: `date +%s` prints the current Unix time in most shells, `Math.floor(Date.now() / 1000)` does it in JavaScript, and `int(time.time())` in Python. Mind the unit: Discord wants seconds, and JavaScript’s `Date.now()` returns milliseconds. A 13-digit number is a millisecond value; divide it by 1,000 before putting it in the code.',
      ],
    },
    {
      h2: 'How do time zones work with Discord timestamps?',
      paragraphs: [
        'There is no time zone in the code, and that is deliberate. A Unix time is the same number everywhere on Earth, so Discord can take that one number and write it out in each reader’s zone and locale, as its developer reference says. You never convert anything for your readers; you only need the right Unix number for the moment you mean, which is why the generator asks for the time zone you are thinking in.',
        'The relative style `R` is special in one way: it is written from the reader’s point of view at the time they look at the message, so “in 2 hours” for someone reading now is “in 5 minutes” for someone reading later, and “3 days ago” the week after. Pair it with an absolute style such as `F` when the exact date matters.',
      ],
    },
    {
      h2: 'Where do Discord timestamps not render?',
      paragraphs: [
        'Inside inline code and code blocks, which show text as typed. That is how to display the code itself, for example when you are explaining timestamps to someone. Outside code, the format has to match one of the two documented forms exactly: lowercase `t`, colons, digits only, one of the nine letters, no spaces, both angle brackets. Anything else is not a timestamp.',
        'Discord’s developer reference lists timestamps under message formatting, which is what bots and people both send as message content. It does not say which parts of an embed render them, so test an embed layout before you rely on a timestamp in a title, field or footer.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the Discord timestamp format?',
      a: 'The format is `<t:UNIX:STYLE>`, where UNIX is a Unix time in seconds and STYLE is one of nine letters: `t`, `T`, `d`, `D`, `f`, `F`, `s`, `S` or `R`. The style is optional; `<t:1798747200>` alone uses `f`, long date with short time. Discord’s developer reference documents both forms and says the result is shown in each reader’s own time zone and locale.',
    },
    {
      q: 'How do you make a countdown timer on Discord?',
      a: 'Use the relative style: `<t:1798747200:R>` reads as “in 3 days” or “in 20 minutes” depending on when the reader looks, and switches to “2 hours ago” once the moment has passed. It is text that Discord writes from the reader’s point of view, not a ticking clock, so pair it with an absolute style such as `<t:1798747200:F>` when people need the exact date and time as well.',
    },
    {
      q: 'Why does my Discord timestamp show as plain text?',
      a: 'The code does not match the documented form. Check for a lowercase `t`, two colons at most, digits only in the number, one of the nine style letters, no spaces, and both angle brackets. Also check the number itself: Discord wants seconds, so a 13-digit millisecond value gives a date thousands of years away rather than the one you meant. And a code inside backticks is shown as typed on purpose, since inline code turns formatting off.',
    },
    {
      q: 'Do Discord timestamps work on mobile?',
      a: 'The timestamp code is message markdown, and Discord’s developer reference describes it without any platform restriction: the moment is displayed in the user’s time zone and locale wherever the message is read. The only difference on a phone is typing it: the angle brackets and colon are on the symbols page of the keyboard, so most people copy the code from a generator and paste it into the message.',
    },
    {
      q: 'Can you set a time zone in a Discord timestamp?',
      a: 'No, and you do not need to. The code holds a Unix time, which is one exact moment that is the same everywhere; Discord then shows that moment in each reader’s own zone. If you want to say “8 PM Eastern”, convert that to a Unix time once, with the generator or a calendar, and send the code. Everyone sees it as their own local time, and nobody has to do the arithmetic.',
    },
  ],
  sources: [
    { label: 'Discord developer docs: Reference, Message Formatting and Timestamp Styles', url: 'https://docs.discord.com/developers/reference' },
    { label: 'Discord: Markdown Text 101 (Chat Formatting), code blocks', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
  ],
  related: ['/discord-timestamp-generator', '/discord-markdown', '/discord-markdown/headers', '/discord-markdown/hyperlink', '/discord-markdown/code-block'],
};

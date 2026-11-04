import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'bold-italics-underline',
  title: 'Discord Bold, Italics and Underline Syntax',
  description:
    'Bold, italic and underlined text on Discord: **bold**, *italics*, __underline__, every combination, the keyboard shortcuts, and why __ is not bold here.',
  h1: 'How to bold, italicize and underline text on Discord',
  label: 'Bold, italics, underline',
  updated: '2026-11-03',
  answer:
    'Wrap the text in markers: two asterisks for bold (`**bold**`), one asterisk or one underscore for italics (`*italics*` or `_italics_`), and two underscores for underline (`__underline__`). Stack them for combinations such as `__**underline bold**__`. On desktop and in the browser, Ctrl+B, Ctrl+I and Ctrl+U (Cmd on a Mac) do the same.',
  anatomy: {
    title: 'Discord underline bold italics syntax',
    parts: [
      { text: '__', label: 'underline', kind: 'marker' },
      { text: '**', label: 'bold', kind: 'marker' },
      { text: '*', label: 'italics', kind: 'marker' },
      { text: 'your text', label: 'formatted text', kind: 'content' },
      { text: '*', label: 'italics', kind: 'marker' },
      { text: '**', label: 'bold', kind: 'marker' },
      { text: '__', label: 'underline', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'Bold, italics and underline',
      source: '**bold**\n*italics* or _italics_\n__underline__',
      note: 'One asterisk and one underscore both give italics; two underscores give underline, not bold.',
    },
    {
      label: 'Underline combined with italics and bold',
      source: '__*underline italics*__\n__**underline bold**__',
      note: 'These are the combinations Discord’s help article lists: underscores on the outside, asterisks on the inside, closed in reverse order. Three asterisks give bold italics; see the table below.',
    },
    {
      label: 'Several styles in one sentence',
      source: 'You can **bold** one word, *italicize* another and __underline__ a third.',
    },
    {
      label: 'Showing asterisks and underscores as typed',
      source: '\\*\\*not bold\\*\\* and \\_\\_not underlined\\_\\_',
      note: 'A backslash before each marker is the usual markdown way to show it as typed. Discord’s help article does not cover escaping, so check the result before you rely on it.',
    },
  ],
  sections: [
    {
      h2: 'Every bold, italic and underline combination on Discord',
      paragraphs: [
        'Discord’s help article lists the text styles below, built from three markers: asterisks for italics and bold, underscores for italics and underline, and tildes for strikethrough. Combinations stack the markers, with the underline’s double underscores on the outside. However you combine them, close the markers in the reverse order you opened them, the way you would close brackets.',
      ],
      table: {
        head: ['Style', 'You type', 'Notes'],
        rows: [
          ['Italics', '`*italics*` or `_italics_`', 'One asterisk or one underscore'],
          ['Bold', '`**bold**`', 'Two asterisks'],
          ['Bold italics', '`***bold italics***`', 'Three asterisks'],
          ['Underline', '`__underline__`', 'Two underscores; means bold in most other markdown'],
          ['Underline italics', '`__*underline italics*__`', 'Underscores outside the asterisk'],
          ['Underline bold', '`__**underline bold**__`', 'Underscores outside the asterisks'],
          ['Underline bold italics', '`__***underline bold italics***__`', 'All three at once'],
          ['Strikethrough', '`~~strikethrough~~`', 'See [strikethrough](/discord-markdown/strikethrough)'],
        ],
      },
    },
    {
      h2: 'Why does __text__ underline on Discord but turn bold elsewhere?',
      paragraphs: [
        'In standard markdown, as defined by CommonMark and used by GitHub, two underscores mean strong emphasis, which displays as bold, exactly like two asterisks. Discord gives the double underscore its own meaning: underline. A single underscore still means italics in both.',
        'This matters when text moves between apps. A README that uses `__important__` for bold comes out underlined when pasted into Discord, and a Discord message with `__underline__` turns bold on GitHub. To keep bold in both places, use asterisks: `**bold**`. The [markdown to Discord converter](/markdown-to-discord) rewrites double-underscore bold as asterisks for you, and the [underline guide](/guides/markdown-underline) covers how other markdown flavors handle underline.',
      ],
    },
    {
      h2: 'Keyboard shortcuts for bold, italics and underline',
      paragraphs: [
        'Discord’s shortcuts guide lists Ctrl+B for bold, Ctrl+I for italics and Ctrl+U for underline on Windows, and Cmd+B, Cmd+I and Cmd+U on a Mac. The same guide says keyboard shortcuts are available only in the browser and desktop versions of Discord, so on a phone you type the markers yourself. Highlighting text in the message box also brings up a small formatting bar; Discord’s spoiler article describes using it to mark a spoiler.',
        'Typed markers and shortcuts can be mixed in one message. For the combinations, such as underline bold italics, typing the markers lets you see and control their order, which is the first thing to check when a combination comes out wrong.',
      ],
    },
    {
      h2: 'Why is my Discord bold or italic text not working?',
      paragraphs: [
        'Most failures come from the markers. Count them: one asterisk is italics, two is bold, three is both, and the closing side needs the same number as the opening side, so `**text*` leaves a stray asterisk. If `** text **` shows its asterisks, remove the spaces between the markers and the words. For combinations, check the order: `__**underline bold**__` closes the asterisks before the underscores.',
        'Text pasted from elsewhere can carry look-alike characters, such as the full-width asterisk `＊`, which is not a markdown marker; retype the markers with the plain `*` and `_` keys. And if the text is meant for Slack or WhatsApp too, remember their markers differ, as the next section shows.',
      ],
    },
    {
      h2: 'How do Discord bold and italics compare with other apps?',
      paragraphs: [
        'Discord’s bold and italics match standard markdown. Slack’s markup and WhatsApp use a single asterisk for bold and a single underscore for italics, and neither documents an underline marker. A message written for Slack or WhatsApp therefore comes out italic on Discord, where one asterisk means italics. See [Slack formatting](/slack-markdown) and [WhatsApp formatting](/whatsapp-formatting) for their full syntax.',
      ],
      table: {
        head: ['App', 'Bold', 'Italics', 'Underline'],
        rows: [
          ['Discord', '`**bold**`', '`*italics*` or `_italics_`', '`__underline__`'],
          ['Standard markdown (CommonMark, GitHub)', '`**bold**` or `__bold__`', '`*italics*` or `_italics_`', 'No markdown syntax'],
          ['Slack (markup on)', '`*bold*`', '`_italics_`', 'Toolbar only'],
          ['WhatsApp', '`*bold*`', '`_italics_`', 'Not in WhatsApp’s formatting help'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'How do you bold text on Discord mobile?',
      a: 'Type two asterisks before and after the text, with the asterisks touching the words: `**text**`. Discord’s keyboard shortcuts work only in the desktop and browser versions, so typing the markers is the reliable way on a phone. The asterisk is on the symbols page of most phone keyboards. Italics take one asterisk or underscore, and underline takes two underscores, typed the same way.',
    },
    {
      q: 'How do you underline text on Discord?',
      a: 'Put two underscores on each side: `__underline__`. Discord’s help article lists it next to bold and italics, and it combines with them: `__*underline italics*__`, `__**underline bold**__` and `__***underline bold italics***__`. On desktop or in the browser, Ctrl+U (Cmd+U on a Mac) is the keyboard shortcut. In most other markdown, two underscores mean bold, so the underline is specific to Discord.',
    },
    {
      q: 'How do you make text bold and italic at the same time on Discord?',
      a: 'Use three asterisks on each side: `***bold italics***`, the form Discord’s help article lists. Add two underscores outside for underline as well: `__***underline bold italics***__`. The markers must match on both sides, so count them when the result looks wrong: three opening asterisks need three closing ones, and the underscores close last.',
    },
    {
      q: 'How do you type asterisks on Discord without formatting?',
      a: 'Discord’s help article does not cover escaping, but the usual markdown approach is worth trying: put a backslash before each asterisk or underscore, as in `\\*not italic\\*`. Wrapping the text in single backticks to make inline code is another option to try; the text then appears in a monospace font. Check the result in your own client before relying on either.',
    },
    {
      q: 'Does bold text work in Discord embeds and bot messages?',
      a: 'Bot message content uses the same markdown that people type, so `**bold**` from a bot is bold. For embeds, Discord’s moderator guidance on webhooks and embeds says markdown is also supported in an embed, but it does not list which embed fields render it. Test a new layout before relying on bold or underline in a title, field name or footer.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting: Bold, Italic, Underline)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: Commands, Shortcuts, and Navigation Guide (text formatting shortcuts)', url: 'https://support.discord.com/hc/en-us/articles/31232432266647-Discord-Commands-Shortcuts-and-Navigation-Guide' },
    { label: 'Discord: Spoiler Tags', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord Moderator Academy: Using Webhooks and Embeds', url: 'https://discord.com/safety/using-webhooks-and-embeds' },
    { label: 'CommonMark spec: emphasis and strong emphasis', url: 'https://spec.commonmark.org/0.31.2/#emphasis-and-strong-emphasis' },
    { label: 'Slack: Format your messages in Slack with markup', url: 'https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup' },
    { label: 'Slack: Format your messages', url: 'https://slack.com/help/articles/202288908-Format-your-messages' },
    { label: 'WhatsApp Help Center: How to format your messages', url: 'https://faq.whatsapp.com/539178204879377' },
  ],
  related: ['/discord-markdown', '/discord-markdown/strikethrough', '/markdown-to-discord', '/guides/markdown-bold-italic', '/guides/markdown-underline', '/slack-markdown'],
};

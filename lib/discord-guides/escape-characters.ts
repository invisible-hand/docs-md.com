import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'escape-characters',
  title: 'Discord Escape Characters: Type * _ # Without Formatting',
  description:
    'Show * _ ~ | > # literally on Discord with a backslash or inline code, stop a link preview with <url>, and keep @everyone from pinging with \\@everyone.',
  h1: 'How to escape characters on Discord',
  label: 'Escape characters',
  updated: '2026-11-03',
  answer:
    'Put a backslash before the symbol: `\\*not italic\\*` shows the asterisks. Inline code (backticks) shows everything inside it exactly as typed, which is the method Discord’s own help article gives. Angle brackets around a link, `<https://example.com>`, stop the preview card, and `\\@everyone` stops the mention.',
  anatomy: {
    title: 'Discord backslash escape',
    parts: [
      { text: '\\', label: 'backslash (hidden)', kind: 'marker' },
      { text: '*', label: 'symbol, shown as typed', kind: 'content' },
      { text: 'not italic', label: 'your text', kind: 'content' },
      { text: '\\*', label: 'the closing one too', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'Asterisks, underscores and tildes as symbols',
      source: '\\*\\*not bold\\*\\* and \\_\\_not underlined\\_\\_ and \\~\\~not struck\\~\\~',
      note: 'One backslash per symbol, on both sides. The backslashes themselves are not shown.',
    },
    {
      label: 'Markers at the start of a line',
      source: '\\# Not a header\n\\- Not a bullet\n\\> Not a quote\n\\-# Not subtext',
      note: 'These symbols only format at the very start of a line, so one backslash in front is enough.',
    },
    {
      label: 'Inline code shows everything as typed',
      source: 'Use `**stars**`, `__lines__` and `||bars||` to show the markers in code style.',
      note: 'Nothing inside backticks is formatted. This is the way Discord’s help article gives for sending text without markdown.',
    },
    {
      label: 'A link without a preview card',
      source: 'Read the rules: <https://example.com/rules>',
      note: 'Discord’s auto-embed article: wrapping a link in angle brackets cancels the embed for that one link. The address is still clickable. The preview on this page never draws embed cards.',
    },
    {
      label: 'A mention that does not ping',
      source: 'Please do not type \\@everyone in chat.',
      note: 'Discord’s March 6, 2026 patch notes: `\\@everyone` and `\\@here` are now respected as escaped on the server too, so they notify nobody.',
    },
  ],
  sections: [
    {
      h2: 'How does the backslash work on Discord?',
      paragraphs: [
        'A backslash tells Discord to treat the next character as text rather than as a formatting marker, and the backslash itself disappears. This is the same escape rule standard markdown uses: in CommonMark any punctuation character can be escaped with a backslash. Discord’s Markdown Text 101 article does not describe the backslash at all, but Discord’s own patch notes call it an escape character and use `\\@everyone` as their example, so it is part of how Discord reads messages.',
        'Discord does not publish the list of characters the backslash covers. The ones worth escaping are the symbols Discord uses for formatting, because those are the only characters that can change your message: the asterisk, underscore, tilde, vertical bar, greater-than sign, hash, hyphen and backtick, plus the at sign in front of a mention. The table shows what each one does when it is not escaped. For anything that must come out exactly, such as a command or a file path, inline code is the surer route; the next section explains why.',
      ],
      table: {
        head: ['Symbol', 'What it does unescaped', 'To show it'],
        rows: [
          ['`*`', 'Italics (one) or bold (two) around text', '`\\*`'],
          ['`_`', 'Italics (one) or underline (two) around text', '`\\_`'],
          ['`~`', 'Strikethrough (two) around text', '`\\~`'],
          ['`|`', 'Spoiler (two) around text', '`\\|`'],
          ['`>`', 'Block quote, at the start of a line', '`\\>`'],
          ['`#`', 'Header, at the start of a line (`-#` subtext)', '`\\#` or `\\-#`'],
          ['`-`', 'Bullet point, at the start of a line', '`\\-`'],
          ['Backtick', 'Inline code (one) or a code block (three)', 'Put it inside a longer run of backticks'],
          ['`@`', 'Mention, as in @everyone or @here', '`\\@`'],
        ],
      },
    },
    {
      h2: 'When should you use inline code instead of a backslash?',
      paragraphs: [
        'Whenever the text has to be exact. Nothing inside backticks is read as formatting, so `**stars**`, `__lines__`, `||bars||` and `# hashes` all come out as typed, backslashes included. An earlier version of Discord’s help article put it in one line: don’t want to use markdown? Pop your message in a code block and you’re good to go. The current article still notes that a code block cancels spoiler tags, and Discord’s spoiler article repeats that spoilered text inside a code block is not hidden. Code is the one escape Discord documents, and it never needs a second thought about which character to protect.',
        'The trade-off is the look. Inline code is monospaced on a darker box, which is right for commands, file names, code snippets and Windows paths such as `C:\\Users\\name`, and wrong for a sentence that should read as ordinary prose. Use a backslash when one symbol in normal text is the problem, and code when the whole phrase is technical. Three backticks make a block for several lines; see the [code block page](/discord-markdown/code-block).',
      ],
    },
    {
      h2: 'How do you stop a link preview or a mention?',
      paragraphs: [
        'A URL in a message normally gets an embed, the preview card with the page’s title and image. Discord’s auto-embed article gives the escape for one link: wrap it in angle brackets, `<https://example.com>`, and no card appears while the address stays clickable. The same article points to User Settings, under Text & Images, to turn previews off for everything you see. Masked links and spoilered links are on the [hyperlink page](/discord-markdown/hyperlink).',
        'Mentions have their own escape. Discord’s March 6, 2026 patch notes explain that `\\@everyone` used to display as plain text on the client but still notify a role on the server, and that escape characters are now respected on the backend for @everyone and @here, so an escaped mention no longer pings anyone. For users, roles and channels, Discord’s developer reference lists the mention forms `<@USER_ID>`, `<@&ROLE_ID>` and `<#CHANNEL_ID>`; it does not describe escaping them, so put one in inline code when you want to show it as text.',
      ],
    },
    {
      h2: 'Why is the backslash showing in my Discord message?',
      paragraphs: [
        'Three reasons cover most cases. First, the backslash is inside inline code or a code block, where every character is shown as typed, backslashes included; take it out of the code, or leave it if you meant to show it. Second, the message came from a bot or a tool that escaped the text twice: in JSON and most programming languages a backslash is itself written as `\\\\`, so a string that already contained `\\*` arrives as two characters when it is escaped again. Third, the backslash is before a character that Discord does not treat as markdown; Discord does not document what it does in that case, so check the result in your own client, and prefer inline code for text that mixes backslashes with ordinary words.',
        'If the escaped symbol still formats, the usual cause is a missing partner. Paired markers need the backslash on both sides, `\\*text\\*`, because an unescaped closing asterisk can pair with another one later in the message. Line-start markers (`#`, `-`, `>`, `-#`) only need the one at the front.',
      ],
    },
    {
      h2: 'How does this compare with other apps?',
      paragraphs: [
        'The backslash is standard markdown, so text escaped for Discord usually shows the same symbols on GitHub, Reddit and in a markdown editor, and a document escaped for those renders correctly when pasted into a Discord message. The [markdown to Discord converter](/markdown-to-discord) adds the backslashes for you when a document contains literal asterisks or underscores. The full CommonMark list, the table-pipe problem and the rules for Slack and other chat apps are in the general [markdown escape characters guide](/guides/markdown-escape-characters).',
      ],
    },
  ],
  faq: [
    {
      q: 'How do you type an asterisk on Discord without making text italic?',
      a: 'Put a backslash in front of it: `\\*` shows a single asterisk, and `\\*not italic\\*` shows both asterisks around the words with no italics. The backslashes are not displayed. If the asterisk is part of something technical, such as a wildcard pattern or a command, wrap the whole thing in backticks instead: inline code shows every character as typed and is the method Discord’s own help article gives for text without markdown.',
    },
    {
      q: 'How do you send a link on Discord without the preview?',
      a: 'Wrap the address in angle brackets: `<https://example.com>`. Discord’s auto-embed help article gives this as the way to cancel the embed for one specific link, and the address is still posted as a clickable link. To stop previews for every link you see, the same article points to User Settings, under Text & Images, which changes your view only. Bots can also send a message with the `SUPPRESS_EMBEDS` flag from Discord’s developer docs.',
    },
    {
      q: 'How do you write @everyone without pinging everyone on Discord?',
      a: 'Type a backslash before the at sign: `\\@everyone`. Discord’s March 6, 2026 patch notes say escape characters are now respected on the backend for @everyone and @here, so the escaped form shows as text and notifies nobody; before that fix the client showed it as plain text but the server could still send the notification. Inline code, `@everyone` between backticks, is the other option and also works for user and role mentions.',
    },
    {
      q: 'Does the backslash work inside a Discord code block?',
      a: 'No, and it does not need to. Inside inline code or a code block Discord shows every character as typed, so there is nothing to escape, and a backslash you put there is shown too. That makes code the place for Windows paths, regular expressions and anything else full of backslashes. Outside code, the backslash is the escape: it hides itself and shows the next symbol as plain text.',
    },
    {
      q: 'Which characters need escaping on Discord?',
      a: 'Only the ones Discord uses for formatting: `*`, `_`, `~`, `|`, the backtick, `>`, `#` and `-`, plus `@` in front of a mention. Everything else is ordinary text and needs nothing. `>`, `#`, `-` and `-#` only format at the start of a line, so a hash or dash in the middle of a sentence is fine as it is. Discord does not publish an official list, so when a message has to be exact, inline code is the documented way.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (Chat Formatting), code blocks and spoilers', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: Markdown Text 101, 2021 version (“Pop your message in a code block”), archived', url: 'https://web.archive.org/web/20210516231929/https://support.discord.com/hc/en-us/articles/210298617' },
    { label: 'Discord Patch Notes: March 6, 2026 (escaped mentions)', url: 'https://discord.com/blog/discord-patch-notes-march-6-2026' },
    { label: 'Discord: How do I disable auto-embed?', url: 'https://support.discord.com/hc/en-us/articles/206342858--How-do-I-disable-auto-embed' },
    { label: 'Discord: Spoiler Tags (spoilers inside code blocks)', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord blog: How Discord Renders Rich Messages on the Android App (formatting should not work inside code blocks)', url: 'https://discord.com/blog/how-discord-renders-rich-messages-on-the-android-app' },
    { label: 'Discord developer docs: Reference, Message Formatting (mention forms)', url: 'https://docs.discord.com/developers/reference' },
    { label: 'Discord developer docs: Message resource (SUPPRESS_EMBEDS)', url: 'https://docs.discord.com/developers/resources/message' },
    { label: 'CommonMark spec: backslash escapes', url: 'https://spec.commonmark.org/0.31.2/#backslash-escapes' },
  ],
  related: ['/guides/markdown-escape-characters', '/discord-markdown', '/discord-markdown/code-block', '/discord-markdown/hyperlink', '/discord-markdown/spoiler'],
};

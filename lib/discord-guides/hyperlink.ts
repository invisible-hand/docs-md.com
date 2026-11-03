import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'hyperlink',
  title: 'Discord Hyperlinks: Masked Links with [text](url)',
  description:
    'Hyperlink text on Discord with a masked link, [text](https://url). Stop link previews with <>, spoiler a link, and why Discord asks before opening links.',
  h1: 'How to hyperlink text on Discord (masked links)',
  label: 'Hyperlinks',
  updated: '2026-11-03',
  answer:
    'Type the words people should click in square brackets, then the full address in parentheses right after them. Discord calls this a masked link: `[our rules](https://example.com/rules)` shows only “our rules”, and clicking or tapping it opens the address. To post a plain address without a preview card, wrap it in angle brackets: `<https://example.com>`.',
  anatomy: {
    title: 'Discord masked link syntax',
    parts: [
      { text: '[', label: 'open bracket', kind: 'marker' },
      { text: 'our rules', label: 'text people see', kind: 'content' },
      { text: '](', label: 'close bracket, open paren', kind: 'marker' },
      { text: 'https://example.com/rules', label: 'full address', kind: 'extra' },
      { text: ')', label: 'close paren', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'A masked link in a sentence',
      source: 'Read [the server rules](https://example.com/rules) before you post.',
      note: 'Discord shows only the words in brackets, in link colour. The links in these previews do not open.',
    },
    {
      label: 'A plain link with and without a preview card',
      source: 'With a preview card: https://example.com\nNo preview card: <https://example.com>',
      note: 'The preview on this page never draws link preview cards (embeds). In Discord the first address can get a card under the message; the angle brackets stop that for the second one, which is still posted as a link.',
    },
    {
      label: 'A link behind a spoiler',
      source: 'Trailer, if you want it: ||https://example.com/trailer||',
      note: 'Two bars on each side mark a link as a spoiler, per Discord’s spoiler article. Click the black bar in the preview to reveal it. Server invite embeds cannot be hidden this way.',
    },
    {
      label: 'A masked link without a preview card',
      source: '[Patch notes](<https://example.com/patch-notes>)',
      note: 'Angle brackets inside the parentheses are a common way to keep a masked link from producing a preview card. Discord’s help articles do not document this form, so check the result in your own client.',
    },
  ],
  sections: [
    {
      h2: 'How do masked links work on Discord?',
      paragraphs: [
        'Discord’s help article describes masked links as a way to make text a clickable or pressable hyperlink: the text you want displayed goes in square brackets, followed by the URL in parentheses. Keep the closing bracket and the opening parenthesis together, and write the full address, starting with `https://`.',
        'Masked links are the standard markdown link syntax, so a link copied from a README or a documentation page usually keeps working when pasted into Discord. Discord’s developer blog says masked links were added in 2023 as a markdown option that apps and users can both use, so a bot writes them in its message content the same way a person does. Bots and webhooks can also put hyperlinked text inside embeds, the boxed cards they post; Discord’s moderator guidance mentions this and tells readers to check where such a link really goes.',
      ],
    },
    {
      h2: 'Why does Discord ask before opening a link?',
      paragraphs: [
        'Because a masked link hides its address, the words can say one thing while the link goes somewhere else. Discord’s moderator guidance gives exactly this example: text that looks like `https://discord.com` but is hyperlinked to another site, which it describes as one way attackers disguise malicious URLs. Discord’s safety advice is simple: don’t click links from unknown senders or links that look suspicious.',
        'Discord can show a confirmation dialog before it opens an outside link. Its developer documentation shows that dialog: it names the address the link will take you to, asks whether you are sure, and offers Trust this Domain, after which the dialog no longer appears for that domain. Read the address in the dialog before you continue, and trust only domains you know. When you post links yourself, keep the visible words honest about where they lead.',
      ],
    },
    {
      h2: 'How do you stop a link preview (embed) on Discord?',
      paragraphs: [
        'When a message contains a URL, Discord can add an embed under it: a preview card that may show the page’s title, description or an image. To skip the card for one link, wrap the address in angle brackets, `<https://example.com>`. Discord’s help article on auto-embed gives this as the way to cancel the embed for a single link, and its screenshot shows the address still posted as a link.',
        'To turn previews off for yourself everywhere, the same article points to User Settings, under Text & Images, where you can switch off embeds for links posted in chat and for files uploaded to Discord. That changes what you see, not what other people see.',
        'Bots have another option. Discord’s developer docs define a `SUPPRESS_EMBEDS` message flag that leaves a message’s embeds out. A bot can set it when it sends a message, and when a message is edited, its author can set it, or anyone else with the Manage Messages permission in that channel.',
      ],
      table: {
        head: ['You type', 'Discord shows', 'Preview card'],
        rows: [
          ['`https://example.com`', 'The address as a link', 'Can appear under the message'],
          ['`<https://example.com>`', 'The address as a link', 'Not for this link'],
          ['`[docs](https://example.com)`', 'The word “docs” as a link', 'Not covered in Discord’s help articles; to avoid one, try `<…>` inside the parentheses'],
          ['`||https://example.com||`', 'The address behind a spoiler', 'Hidden with the spoiler, except server invite embeds'],
        ],
      },
    },
    {
      h2: 'Masked links on Discord and in other apps',
      paragraphs: [
        'Discord uses the same bracket-and-parenthesis form as standard markdown and GitHub, so links move between them unchanged. Slack accepts `[your text](https://example.com)` only when its markup formatting preference is turned on; with its default formatting toolbar you add links another way, as the [Slack formatting](/slack-markdown) page explains. To bring a whole document into Discord, paste it into the [markdown to Discord converter](/markdown-to-discord), which keeps masked links as they are.',
      ],
    },
  ],
  faq: [
    {
      q: 'Why is my Discord masked link not working?',
      a: 'Check the shape. Discord’s help article puts the display text in square brackets followed by the URL in parentheses, so keep `](` together with nothing between them. Use the full address starting with `https://`, and make sure every bracket and parenthesis is closed. If it still shows as typed, copy the address again: an address with spaces or line breaks in it is not a valid URL.',
    },
    {
      q: 'Can you hyperlink text on Discord mobile?',
      a: 'Yes. A masked link is made of ordinary characters, so you type it the same way in the mobile app: the words in square brackets, then the full address in parentheses. Discord’s help article calls the result a clickable or pressable hyperlink, so readers on a phone tap it to open it. Brackets and parentheses are on the symbols page of most phone keyboards.',
    },
    {
      q: 'How do you send a link without an embed on Discord?',
      a: 'Wrap the address in angle brackets: `<https://example.com>`. Discord’s help article on auto-embed gives this as the way to cancel the embed for a single link, and the address is still posted as a link. To stop link previews for yourself in every chat, use the Text & Images section of User Settings, which the same article points to. Bots can send messages with the `SUPPRESS_EMBEDS` flag instead.',
    },
    {
      q: 'Are masked links on Discord safe to click?',
      a: 'Treat them with care. A masked link can open a different address from the one its words suggest, and Discord’s moderator guidance names this as one way attackers disguise malicious URLs. When Discord shows a confirmation dialog, read the address it names before continuing, and choose Trust this Domain only for sites you know. Discord’s safety advice is not to click links from unknown senders or links that look suspicious.',
    },
    {
      q: 'Can bots and webhooks use masked links on Discord?',
      a: 'Yes. Discord’s developer blog lists masked links among the markdown options that apps and users can both use, so bot message content takes the same `[text](https://example.com)` form. Bots and webhooks can also hyperlink text inside embeds, which Discord’s moderator guidance mentions when it advises checking where a link really goes. Test a new embed layout before relying on a link in a particular field.',
    },
  ],
  sources: [
    { label: 'Discord: Markdown Text 101 (masked links)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord: How do I disable auto-embed?', url: 'https://support.discord.com/hc/en-us/articles/206342858--How-do-I-disable-auto-embed' },
    { label: 'Discord: Spoiler Tags', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord developer docs: Message resource (SUPPRESS_EMBEDS, embeds)', url: 'https://docs.discord.com/developers/resources/message' },
    { label: 'Discord developer docs: User Actions (external link dialog)', url: 'https://docs.discord.com/developers/activities/development-guides/user-actions' },
    { label: 'Discord Moderator Academy: Moderating Safely and Securely', url: 'https://discord.com/community/moderating-safely-and-securely-discord' },
    { label: 'Discord Safety: Protecting Against Scams on Discord', url: 'https://discord.com/safety/protecting-users-from-scams-on-discord' },
    { label: 'Discord Developers blog: Here’s to 2023 (masked links and headers)', url: 'https://discord.com/blog/discord-developers-heres-to-2023-and-whats-to-come' },
    { label: 'Slack: Format your messages in Slack with markup', url: 'https://slack.com/help/articles/360039953113-Format-your-messages-in-Slack-with-markup' },
  ],
  related: ['/discord-markdown', '/markdown-to-discord', '/guides/markdown-link', '/discord-markdown/spoiler', '/slack-markdown'],
};

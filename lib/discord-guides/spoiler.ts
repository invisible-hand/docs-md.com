import type { DiscordGuide } from './types';

export const GUIDE: DiscordGuide = {
  slug: 'spoiler',
  title: 'Discord Spoiler Tags: Hide Text, Images and Links',
  description:
    'How to spoiler on Discord: two bars on each side of the text, ||like this||, or /spoiler. Hide images, files and links too, on desktop and mobile.',
  h1: 'How to spoiler text and images on Discord',
  label: 'Spoiler',
  updated: '2026-11-03',
  answer:
    'Put two vertical bars on each side of the text: `||like this||`. Discord hides it behind a solid box until a reader clicks or taps it. You can also type `/spoiler` before a message to hide all of it, and mark an image or file as a spoiler with the eye icon before you send it.',
  anatomy: {
    title: 'Discord spoiler syntax',
    parts: [
      { text: '||', label: 'two vertical bars', kind: 'marker' },
      { text: 'the ending', label: 'hidden text', kind: 'content' },
      { text: '||', label: 'two more bars', kind: 'marker' },
    ],
  },
  examples: [
    {
      label: 'Hiding part of a message',
      source: 'Just finished the book. The twist is that ||the narrator was the villain all along||.',
      note: 'Click the dark box in the preview to reveal it, the way a reader would in Discord.',
    },
    {
      label: 'Several spoilers in one message',
      source: 'Quiz answers: 1. ||Canberra|| 2. ||1969|| 3. ||the blue whale||',
      note: 'Each pair of bars makes a separate box.',
    },
    {
      label: 'Spoilering a link and its preview',
      source: 'New trailer is out: ||https://example.com/trailer||',
      note: 'In Discord the link’s preview card is hidden too; this preview shows only the link. Server invites are the exception: Discord cannot hide their embeds.',
    },
    {
      label: 'Formatting inside a spoiler',
      source: 'Final score: ||**3–2**, after extra time||',
      note: 'Bold, italics and other inline formatting work inside the bars and show once the spoiler is revealed.',
    },
    {
      label: 'Spoilers inside code are not hidden',
      source: '`||visible||` in inline code\n```\n||also visible in a code block||\n```',
      note: 'Discord shows the bars literally inside code, so the text stays readable.',
    },
  ],
  sections: [
    {
      h2: 'How do you spoiler text on Discord desktop and web?',
      paragraphs: [
        'There are three ways, and they give the same result. Type two vertical bars before and after the text, as in `||text||`. Or highlight the text in the message box and click the eye icon in the formatting bar that appears, which adds the bars for you. Or start the message with the `/spoiler` command followed by your text, which sends the whole message as a spoiler.',
        'The bar is the pipe character (`|`); on US and UK keyboards it is Shift plus the backslash key. It has to be doubled on both sides. One bar on each side, as in `|text|`, is shown exactly as typed.',
      ],
    },
    {
      h2: 'How do you spoiler on Discord mobile?',
      paragraphs: [
        'Discord’s help article says the phone apps use the same syntax as desktop: wrap the text in two bars on each side and it shows as a spoiler once posted. Links work the same way. The bar is on the symbols page of the keyboard.',
        'On iOS there is also a menu option: select the text in the message box, tap it to open the context menu, and choose Mark as Spoiler, which wraps the selection in bars. The help article describes this for iOS only and gives no equivalent for Android, so on Android type the bars yourself.',
      ],
    },
    {
      h2: 'How do you spoiler an image, video or file on Discord?',
      paragraphs: [
        'Attach the file, then click the eye icon on the attachment preview before you send. Discord’s tooltip calls it Spoiler Attachment and the help article calls it Mark as Spoiler. The image or video is blurred until someone clicks it. The help article’s screenshots show the desktop app; on a phone, look for the same option on the attachment before sending.',
        'If you forget, you do not have to delete and re-post: Discord’s blog says images can now be hidden behind a spoiler after they have been sent, and Discord’s API lets an edited message change the spoiler setting of attachments it already has.',
        'For a link, put the bars around the address: `||https://example.com||`. Discord then hides the preview card as well as the URL. The one documented exception is server invites, whose embeds cannot be hidden with spoiler tags.',
      ],
    },
    {
      h2: 'How do readers reveal spoilers, and can they turn them off?',
      paragraphs: [
        'Click or tap the box to reveal it. To hide revealed spoilers again, leave the channel; Discord’s help article says that re-hides them.',
        'Each reader decides how spoilers behave for them with the Show spoiler content setting: On click, which is the normal behavior; On servers I moderate, which reveals them where you have a role with the Manage Messages permission; or Always. Discord’s help article says the setting exists only on desktop and in the browser, but Discord’s October 6, 2026 patch notes added it to mobile.',
        'A spoiler is a courtesy, not access control: anyone can reveal it, and readers who chose Always never see the box. For a whole channel of spoilers, Discord added spoiler channels in August 2026, which ask members to confirm before they view the channel.',
      ],
    },
    {
      h2: 'Why is my Discord spoiler not working?',
      paragraphs: [
        'Check four things. The bars must be doubled on both sides; `|text|` stays plain. The text must not be inside inline code or a code block, where Discord shows the bars literally; Discord’s patch notes do mention spoilered code blocks, which you get by putting the bars outside the code instead. Every opening pair needs a closing pair in the same message. And the characters must be real vertical bars (`|`), not look-alikes such as the broken bar `¦` or the full-width bar `｜`, which can arrive in text pasted from elsewhere.',
        'If the spoiler works for you but a friend sees the text uncovered, their Show spoiler content setting is probably Always, or they moderate the server and chose On servers I moderate.',
      ],
    },
    {
      h2: 'How do Discord spoilers compare with other apps?',
      paragraphs: [
        'Telegram uses the same double bars, so a spoiler copied between Telegram and Discord keeps working. Reddit uses its own markers, and WhatsApp and Slack have no spoiler formatting, so the bars show as typed there. Use the [markdown to Discord converter](/markdown-to-discord) to bring a whole document across: it leaves `||spoiler||` bars untouched.',
      ],
      table: {
        head: ['App', 'Spoiler syntax', 'Notes'],
        rows: [
          ['Discord', '`||text||`', 'Also `/spoiler` and the eye icon'],
          ['Telegram', '`||text||`', 'Same bars in the app and in MarkdownV2'],
          ['Reddit', '`>!text!<`', 'No spaces just inside the markers'],
          ['WhatsApp', 'None', 'The bars show literally'],
          ['Slack', 'None', 'No spoiler formatting'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'Is the spoiler syntax the same on the Discord mobile app?',
      a: 'Type two vertical bars before and after the text, `||like this||`, the same as on desktop; Discord’s help article confirms the syntax works on mobile, links included. On iOS you can also select the text in the message box, tap it and choose Mark as Spoiler. The vertical bar is on the symbols page of the phone keyboard.',
    },
    {
      q: 'How do you mark an image as a spoiler on Discord?',
      a: 'Attach the image, then click the eye icon on its preview before sending, and Discord blurs it until someone clicks. If you have already sent it, Discord’s blog says images can now be hidden behind a spoiler after sending. For an image shared as a link, wrap the URL in two bars on each side, which hides the preview as well.',
    },
    {
      q: 'Can you spoiler a whole Discord message?',
      a: 'Yes. Type `/spoiler` followed by your text and Discord sends the whole message as a spoiler. You can also wrap the entire message in bars, `||everything here||`. Both hide the text until a reader clicks it. Attachments are marked separately, with the eye icon on each image or file before you send.',
    },
    {
      q: 'Why can I still see spoilers on Discord?',
      a: 'Usually because of the Show spoiler content setting: Always reveals every spoiler, and On servers I moderate reveals them where you have the Manage Messages permission. Set it back to On click to see the boxes again. Also, spoiler bars inside a code block never hide anything, and server invite embeds cannot be hidden at all.',
    },
    {
      q: 'How do bots send spoilers on Discord?',
      a: 'A bot writes the same `||text||` in its message content, since Discord renders markdown in message content whoever sends it. For files, Discord’s API has an `is_spoiler` field on each attachment, which sets the `IS_SPOILER` flag so the file is blurred until clicked, and an edit can change it on attachments already posted. Thumbnails and media gallery items in components have their own `spoiler` option.',
    },
  ],
  sources: [
    { label: 'Discord: Spoiler Tags', url: 'https://support.discord.com/hc/en-us/articles/360022320632-Spoiler-Tags' },
    { label: 'Discord: Markdown Text 101 (Chat Formatting)', url: 'https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline' },
    { label: 'Discord blog: How to Make Your Discord Messages Bold, Italic, Underlined & Tons More', url: 'https://discord.com/blog/make-your-discord-messages-bold-italic-underlined-and-more' },
    { label: 'Discord blog: Display settings (Show spoiler content)', url: 'https://discord.com/blog/making-discord-on-desktop-look-just-right-display-settings-to-ease-the-eyes' },
    { label: 'Discord blog: Adding the Discord Updates YOU Want to See (spoiler after sending)', url: 'https://discord.com/blog/adding-the-discord-updates-you-want-to-see' },
    { label: 'Discord Patch Notes: October 6, 2026', url: 'https://discord.com/blog/discord-patch-notes-october-6-2026' },
    { label: 'Discord Update: August 11, 2026 Changelog (spoiler channels)', url: 'https://discord.com/blog/discord-update-august-11-2026-changelog' },
    { label: 'Discord developer docs: Message resource (attachments, is_spoiler)', url: 'https://docs.discord.com/developers/resources/message' },
    { label: 'Discord developer docs: Component reference (spoiler on media)', url: 'https://docs.discord.com/developers/components/reference' },
  ],
  related: ['/discord-markdown', '/discord-markdown/code-block', '/discord-markdown/strikethrough', '/telegram-markdown', '/reddit-markdown', '/markdown-to-discord'],
};

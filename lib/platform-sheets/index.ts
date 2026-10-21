// Platform cheat sheets whose content lives in lib/platform-sheets/<slug>.ts (used by /llms-full.txt).
import type { Section } from '@/components/CheatSheet';
import { SECTIONS as DiscordMarkdown } from './discord-markdown';
import { SECTIONS as GithubFlavoredMarkdown } from './github-flavored-markdown';
import { SECTIONS as JiraMarkdown } from './jira-markdown';
import { SECTIONS as MarkdownFlavors } from './markdown-flavors';
import { SECTIONS as MarkdownForAiOutput } from './markdown-for-ai-output';
import { SECTIONS as MdxCheatSheet } from './mdx-cheat-sheet';
import { SECTIONS as NotionMarkdown } from './notion-markdown';
import { SECTIONS as RedditMarkdown } from './reddit-markdown';
import { SECTIONS as ObsidianMarkdown } from './obsidian-markdown';
import { SECTIONS as PandocMarkdown } from './pandoc-markdown';
import { SECTIONS as SlackMarkdown } from './slack-markdown';
import { SECTIONS as TelegramMarkdown } from './telegram-markdown';
import { SECTIONS as WhatsappFormatting } from './whatsapp-formatting';

export const PLATFORM_SHEETS: Array<{ slug: string; title: string; sections: Section[] }> = [
  { slug: 'discord-markdown', title: 'Discord Markdown — Text Formatting Cheat Sheet', sections: DiscordMarkdown },
  { slug: 'github-flavored-markdown', title: 'GitHub Flavored Markdown (GFM) Cheat Sheet', sections: GithubFlavoredMarkdown },
  { slug: 'jira-markdown', title: 'Jira Wiki Markup vs Markdown Cheat Sheet', sections: JiraMarkdown },
  { slug: 'markdown-flavors', title: 'Markdown Flavors Compared: GFM, Slack, Discord…', sections: MarkdownFlavors },
  { slug: 'markdown-for-ai-output', title: 'Markdown in ChatGPT and Claude Answers: Read, Strip, Keep', sections: MarkdownForAiOutput },
  { slug: 'mdx-cheat-sheet', title: 'MDX Cheat Sheet — JSX, Imports, Expressions, Gotchas', sections: MdxCheatSheet },
  { slug: 'notion-markdown', title: 'Notion Markdown: Shortcuts, Import and Export', sections: NotionMarkdown },
  { slug: 'reddit-markdown', title: 'Reddit Markdown Formatting Cheat Sheet', sections: RedditMarkdown },
  { slug: 'obsidian-markdown', title: 'Obsidian Markdown Cheat Sheet: Wikilinks, Callouts', sections: ObsidianMarkdown },
  { slug: 'pandoc-markdown', title: 'Pandoc Markdown Cheat Sheet (R Markdown and Quarto)', sections: PandocMarkdown },
  { slug: 'slack-markdown', title: 'Slack Markdown — Message Formatting Cheat Sheet', sections: SlackMarkdown },
  { slug: 'telegram-markdown', title: 'Telegram Markdown (MarkdownV2) Cheat Sheet', sections: TelegramMarkdown },
  { slug: 'whatsapp-formatting', title: 'WhatsApp Text Formatting: Bold, Italic, Strikethrough, Mono', sections: WhatsappFormatting },
];

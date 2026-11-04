import type { AnatomyPart } from '@/components/SyntaxAnatomy';

/**
 * One Discord formatting topic page at /discord-markdown/<slug>. Contract: docs/discord-guides.md.
 * Text fields accept two inline forms only: `code` in backticks and [label](/internal-path or https://url).
 */
export type DiscordGuide = {
  /** URL segment under /discord-markdown, lowercase kebab-case. */
  slug: string;
  /** <title> without the site suffix, ≤ 50 characters (60 rendered). */
  title: string;
  /** Meta description, 80–155 characters. */
  description: string;
  /** The page H1. */
  h1: string;
  /** Short label for the hub's topic list, e.g. "Strikethrough". */
  label: string;
  /** YYYY-MM-DD of the last substantive change. */
  updated: string;
  /** The opening paragraph: answers the H1 in ≤ 60 words, no link in the first sentence. */
  answer: string;
  /** A vector diagram of the core syntax. */
  anatomy: { title: string; parts: AnatomyPart[] };
  /** Copyable examples, each shown as the typed text and a Discord-style preview. 2–6. */
  examples: { label: string; source: string; note?: string }[];
  /** Body sections; every `h2` is a question or a plain heading. ≥ 3. */
  sections: { h2: string; paragraphs: string[]; table?: { head: string[]; rows: string[][] } }[];
  /** ≥ 4; each answer stands alone (30–120 words). Emitted as FAQPage JSON-LD. */
  faq: { q: string; a: string }[];
  /** External sources checked while writing (Discord's support articles first). */
  sources: { label: string; url: string }[];
  /** 2–6 internal paths shown under "Related". */
  related: string[];
};

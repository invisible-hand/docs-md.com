/**
 * A "Mermaid <chart> examples" page: copyable diagrams rendered live, then answers.
 * Contract: docs/mermaid-examples.md. Text fields accept `code` and [label](href) only.
 */
export type MermaidExamplesPage = {
  /** Top-level route without the slash, e.g. "mermaid-pie-chart-examples". Needs app/<slug>/page.tsx. */
  slug: string;
  /** <title> without the site suffix, ≤ 60 characters. */
  title: string;
  /** Meta description, 80–155 characters. */
  description: string;
  h1: string;
  /** Short label for cross-links, e.g. "Pie chart". */
  label: string;
  updated: string;
  /** Opening paragraph, ≤ 60 words, answers the H1, no link in the first sentence. */
  answer: string;
  /** 3–8 examples; `code` is the Mermaid source without the ```mermaid fence (the copy button adds it). */
  examples: { id: string; title: string; intro: string; code: string }[];
  /** ≥ 3 sections after the examples. */
  sections: { h2: string; paragraphs: string[]; table?: { head: string[]; rows: string[][] } }[];
  /** ≥ 4; answers 30–120 words. */
  faq: { q: string; a: string }[];
  /** Mermaid's own docs first. */
  sources: { label: string; url: string }[];
  /** 2–6 internal paths. */
  related: string[];
};

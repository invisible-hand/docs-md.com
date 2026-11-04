import Link from 'next/link';
import FrontMatterGenerator from '@/components/tools/FrontMatterGenerator';
import ToolPage, { CODE, H2, toolMetadata } from '@/components/tools/ToolPage';

export const metadata = toolMetadata('front-matter-generator');

export default function FrontMatterGeneratorPage() {
  return (
    <ToolPage
      slug="front-matter-generator"
      intro="Pick your static site generator, fill in title, date, tags, and slug, and get front matter with the right key names and every value quoted correctly — as YAML, TOML, or JSON. The validate pane explains which strings had to be quoted and why."
      tool={<FrontMatterGenerator />}
      faq={[
        {
          q: 'What is front matter in markdown?',
          a: 'A block of metadata at the very top of a markdown file, fenced by --- lines for YAML (or +++ for TOML), holding fields like title, date, tags, and draft. Static site generators such as Jekyll, Hugo, Astro, and Docusaurus read it to build the page; Obsidian shows it as note properties.',
        },
        {
          q: 'When does a YAML value need quotes?',
          a: 'When a bare value would be parsed as something other than text: yes, no, on, off, true, false, and null become booleans or null; 1.10 becomes the number 1.1; 2026-09-03 becomes a date; anything starting with a character like *, &, !, %, @, [, {, or # is a YAML indicator; and a “: ” inside the value starts a nested mapping. This tool quotes exactly those cases.',
        },
        {
          q: 'Which date format should I use?',
          a: 'ISO 8601. A full date-time with timezone offset, 2026-09-03T14:30:00+02:00, is unambiguous everywhere; a bare date like 2026-09-03 is fine when time of day does not matter. Hugo, Astro, and Jekyll all accept both.',
        },
        {
          q: 'Does Hugo use YAML or TOML front matter?',
          a: 'Either, plus JSON. YAML is fenced with ---, TOML with +++, JSON with a bare { } object. Hugo detects the format from the fence, so choose whichever your existing content uses.',
        },
        {
          q: 'How do tags differ from categories?',
          a: 'By convention categories are broad, few, and hierarchical (one or two per post), while tags are many and specific. Jekyll, Hugo, and Gatsby treat both as taxonomies that generate listing pages; Astro and Docusaurus only have tags by default.',
        },
      ]}
    >
      <section className="space-y-3">
        <h2 className={H2}>Which front matter keys does each generator expect?</h2>
        <p>
          The same idea has a different name in every tool. Jekyll wants{' '}
          <code className={CODE}>layout</code> and <code className={CODE}>permalink</code>; Hugo uses{' '}
          <code className={CODE}>slug</code>, <code className={CODE}>lastmod</code>, and{' '}
          <code className={CODE}>weight</code>; Astro content collections use{' '}
          <code className={CODE}>pubDate</code>, <code className={CODE}>updatedDate</code>, and{' '}
          <code className={CODE}>heroImage</code>; Docusaurus orders pages with{' '}
          <code className={CODE}>sidebar_position</code>; Obsidian&apos;s built-in properties are{' '}
          <code className={CODE}>tags</code>, <code className={CODE}>aliases</code>, and{' '}
          <code className={CODE}>cssclasses</code>. The presets above set the right names and hide
          fields the generator ignores. Anything else — a <code className={CODE}>series</code>,{' '}
          <code className={CODE}>featured: true</code>, a reading-time override — goes in the custom
          fields with an explicit type so numbers and booleans are not emitted as strings.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>Why does a wrong front matter value break the build?</h2>
        <p>
          Because YAML is typed. <code className={CODE}>title: 2026 Roadmap</code> is fine, but{' '}
          <code className={CODE}>title: 2026</code> is an integer, <code className={CODE}>version: 1.10</code>{' '}
          becomes 1.1, <code className={CODE}>published: no</code> is the boolean false, and{' '}
          <code className={CODE}>description: Note: read this first</code> is a parse error. Astro and
          Docusaurus validate front matter against a schema and refuse the page; Hugo and Jekyll
          silently use the wrong value. Quoting the string, which the generator does automatically,
          removes the ambiguity. The{' '}
          <Link href="/markdown-lint" className="text-indigo-700 underline">
            markdown linter
          </Link>{' '}
          catches the other common mistake — text before the opening <code className={CODE}>---</code>,
          which turns the whole block into a horizontal rule.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className={H2}>What else goes at the top of a post?</h2>
        <p>
          After the front matter, a level-one heading if your theme does not print the title, then
          the body. The{' '}
          <Link href="/markdown-cheat-sheet" className="text-indigo-700 underline">
            cheat sheet
          </Link>{' '}
          covers the syntax; the{' '}
          <Link href="/markdown-toc-generator" className="text-indigo-700 underline">
            table of contents generator
          </Link>{' '}
          adds a linked outline for long posts; the{' '}
          <Link href="/markdown-word-counter" className="text-indigo-700 underline">
            word counter
          </Link>{' '}
          gives you the reading time some themes expect as a field.
        </p>
      </section>
    </ToolPage>
  );
}

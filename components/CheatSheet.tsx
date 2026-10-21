import Link from 'next/link';
import CopyButton from '@/components/CopyButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';

/** One copyable snippet: syntax on the left, rendered result on the right. */
export interface Snippet {
  /** Short title shown above the block (also the React key — keep it unique within a section). */
  label: string;
  /** The exact characters the user should type. Goes into the Copy button and the code column. */
  syntax: string;
  /** One-sentence gotcha shown under the block. */
  note?: string;
  /** Set to false for snippets that cannot be rendered (nested fences, non-GFM dialects). Default true. */
  render?: boolean;
  /**
   * GFM markdown to render in the right column INSTEAD of `syntax`. Use it for dialects whose
   * syntax differs from GFM (Slack `*bold*`, Discord `||spoiler||`) so the preview still shows
   * what the platform displays.
   */
  preview?: string;
  /** Optional "full guide" link rendered after the note. */
  more?: { href: string; label: string };
}

export interface Section {
  /** Anchor id (`#id`) used by the chip nav. */
  id: string;
  /** H2 text. */
  title: string;
  /** Optional one-paragraph intro under the H2. */
  intro?: string;
  snippets: Snippet[];
  /** Optional related links rendered after the snippets. */
  more?: { href: string; label: string }[];
}

export function SnippetBlock({ snippet, copyLabels }: { snippet: Snippet; copyLabels?: { copy: string; copied: string } }) {
  const renderable = snippet.render !== false;
  return (
    <div className="cheat-snippet rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{snippet.label}</h3>
        <CopyButton content={snippet.syntax} labels={copyLabels} />
      </div>
      <div className={`cheat-snippet-grid grid gap-4 ${renderable ? 'lg:grid-cols-2' : ''}`}>
        <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-200">
          <code>{snippet.syntax}</code>
        </pre>
        {renderable ? (
          <div className="overflow-x-auto rounded-xl border border-dashed border-gray-200 px-4 py-3">
            <MarkdownRenderer content={snippet.preview ?? snippet.syntax} />
          </div>
        ) : null}
      </div>
      {snippet.note ? <p className="mt-3 text-sm text-gray-600">{snippet.note}</p> : null}
      {snippet.more ? (
        <p className="mt-2 text-sm">
          <Link href={snippet.more.href} className="text-indigo-700 underline">
            {snippet.more.label} →
          </Link>
        </p>
      ) : null}
    </div>
  );
}

/** Anchor-chip navigation over the sections. Place it in the page header. */
export function SectionNav({ sections, className = 'mt-5 flex flex-wrap gap-2 text-xs' }: { sections: Section[]; className?: string }) {
  return (
    <nav className={className}>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}

/** The sections themselves: one `<section id>` with an H2 and a SnippetBlock per snippet. */
export default function CheatSheet({
  sections,
  copyLabels,
}: {
  sections: Section[];
  copyLabels?: { copy: string; copied: string };
}) {
  return (
    <div className="cheat-sheet space-y-12">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-8 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-950">{section.title}</h2>
          {section.intro ? <p className="text-base text-gray-600">{section.intro}</p> : null}
          {section.snippets.map((snippet) => (
            <SnippetBlock key={snippet.label} snippet={snippet} copyLabels={copyLabels} />
          ))}
          {section.more && section.more.length > 0 ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {section.more.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="text-indigo-700 underline">
                    {m.label} →
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

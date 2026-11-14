'use client';

import { createElement, isValidElement, ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
  /**
   * For documents that live somewhere else (a GitHub repo): relative links resolve against
   * `page` (another rendered page on this site) and relative image sources against `raw`
   * (the file host). Without it, relative links render as plain text (see `a` below).
   */
  relativeBase?: { page: string; raw: string; pageRoot?: string; rawRoot?: string };
  /**
   * Shift every heading down by this many levels (h1→h2 … h5→h6; h6 stays h6). Preview and
   * example panes pass 1 so a sample document's `# Title` does not become a second page <h1>.
   */
  headingOffset?: number;
  /** Only demote `#` headings to h2 (article bodies: the page already has its own <h1>). */
  demoteH1?: boolean;
  /**
   * Shared documents whose author is not trusted yet (docs/agent-protocol.md): a link to another
   * site is shown as its text followed by the URL, and images from other hosts are not loaded.
   * Links to docs-md.com itself, relative links and anchors keep working.
   */
  inertLinks?: boolean;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
const HEADINGS: HeadingTag[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/** Component overrides that render each heading one or more levels lower. */
function shiftedHeadings(offset: number, h1Only: boolean): Partial<Components> {
  const out: Partial<Components> = {};
  HEADINGS.forEach((tag, i) => {
    const target = HEADINGS[Math.min(5, i + offset)];
    if (target === tag || (h1Only && tag !== 'h1')) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` must not reach the DOM
    out[tag] = ({ node: _node, ...props }) => createElement(target, props);
  });
  return out;
}

const ABSOLUTE = /^(https?:\/\/|\/|#|mailto:|data:)/i;
const OWN_SITE = /^https?:\/\/(www\.)?docs-md\.com(?=[/?#]|$)/i;
/** A destination on another site (or a mailto:/data: target): what `inertLinks` withholds. */
const isForeign = (target: string) => /^(https?:\/\/|mailto:|data:|\/\/)/i.test(target) && !OWN_SITE.test(target);
const PAGE_LIKE = /(\.(md|mdx|markdown|mdown|mkd|txt|rst)|\/)(#.*)?$/i;

/** Join a relative path onto a base, resolving ./ and ../ (never above the base's root). */
function joinRelative(base: string, rel: string): string {
  const [pathPart, hash = ''] = rel.split(/(?=#)/);
  const stack = base.replace(/\/+$/, '').split('/');
  for (const seg of pathPart.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') { if (stack.length > 1) stack.pop(); continue; }
    stack.push(seg);
  }
  return stack.join('/') + hash;
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return '';
}

export default function MarkdownRenderer({ content, relativeBase, headingOffset = 0, demoteH1 = false, inertLinks = false }: MarkdownRendererProps) {
  const headings = headingOffset > 0 ? shiftedHeadings(headingOffset, false) : demoteH1 ? shiftedHeadings(1, true) : {};
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          ...headings,
          // User-generated links must not pass SEO value (anti link-spam).
          // Relative repo-style links (e.g. `[MIT](LICENSE)` in a README) cannot resolve on
          // docs-md.com and would 404 — render them as plain text instead of a dead link.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` must not reach the DOM
          a: ({ children, href, node: _node, ...props }) => {
            const h = href ?? '';
            if (inertLinks && isForeign(h)) {
              const label = extractText(children).trim();
              const shown = h.replace(/^mailto:/i, '');
              // An autolink already shows its URL; a named link gets the URL after it, so nothing is hidden.
              return label && label !== shown && label !== h ? (
                <span className="inert-link">
                  {children} <span className="inert-link-url">({shown})</span>
                </span>
              ) : (
                <span className="inert-link">{shown}</span>
              );
            }
            // In a repository README a leading "/" means the repository root, not docs-md.com's root.
            const repoRootLink = Boolean(relativeBase?.pageRoot) && /^\/(?!\/)/.test(h);
            if (!ABSOLUTE.test(h) || repoRootLink) {
              if (relativeBase) {
                // Markdown pages stay on this site; any other file goes to the file host.
                const isPage = PAGE_LIKE.test(h) || !/\.[a-z0-9]{1,5}(#.*)?$/i.test(h);
                const pageBase = repoRootLink ? relativeBase.pageRoot! : relativeBase.page;
                const rawBase = repoRootLink ? (relativeBase.rawRoot ?? relativeBase.raw) : relativeBase.raw;
                const target = isPage ? joinRelative(pageBase, h) : joinRelative(rawBase, h);
                const external = /^https?:\/\//i.test(target);
                return (
                  <a href={target} {...(external ? { rel: 'nofollow ugc noopener noreferrer' } : {})} {...props}>
                    {children}
                  </a>
                );
              }
              return <span title={h}>{children}</span>;
            }
            return (
              <a
                href={href}
                {...(/^https?:\/\//i.test(h) ? { rel: 'nofollow ugc noopener noreferrer' } : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` must not reach the DOM
          img: ({ src, alt, node: _node, ...props }) => {
            const s = typeof src === 'string' ? src : '';
            if (inertLinks) {
              // No image is loaded at all in this mode: its alt text and address are shown instead.
              // (react-markdown has already dropped data: and javascript: sources, so `s` may be empty.)
              return (
                <span className="inert-link">
                  [image{alt ? `: ${alt}` : ''}]{s ? <span className="inert-link-url"> ({s})</span> : null}
                </span>
              );
            }
            const repoRootSrc = Boolean(relativeBase?.rawRoot) && /^\/(?!\/)/.test(s);
            const resolved = !relativeBase || !s
              ? s
              : repoRootSrc
                ? joinRelative(relativeBase.rawRoot!, s)
                : !ABSOLUTE.test(s)
                  ? joinRelative(relativeBase.raw, s)
                  : s;
            // A source react-markdown refused (data:, javascript:) arrives empty: show the alt text, not a broken image.
            if (!resolved) return alt ? <span>[image: {alt}]</span> : null;
            // eslint-disable-next-line @next/next/no-img-element -- user content from arbitrary hosts
            return <img src={resolved} alt={alt ?? ''} loading="lazy" {...props} />;
          },
          pre: ({ children, ...props }) => {
            const child = Array.isArray(children) ? children[0] : children;
            if (
              isValidElement<{ className?: string; children?: ReactNode }>(child) &&
              /\blanguage-mermaid\b/.test(child.props.className ?? '')
            ) {
              return <MermaidDiagram chart={extractText(child.props.children).trim()} />;
            }
            return <pre {...props}>{children}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

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

export default function MarkdownRenderer({ content, relativeBase, headingOffset = 0, demoteH1 = false }: MarkdownRendererProps) {
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
            const repoRootSrc = Boolean(relativeBase?.rawRoot) && /^\/(?!\/)/.test(s);
            const resolved = !relativeBase || !s
              ? s
              : repoRootSrc
                ? joinRelative(relativeBase.rawRoot!, s)
                : !ABSOLUTE.test(s)
                  ? joinRelative(relativeBase.raw, s)
                  : s;
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

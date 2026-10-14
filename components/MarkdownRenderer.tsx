'use client';

import { isValidElement, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
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
  relativeBase?: { page: string; raw: string };
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

export default function MarkdownRenderer({ content, relativeBase }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          // User-generated links must not pass SEO value (anti link-spam).
          // Relative repo-style links (e.g. `[MIT](LICENSE)` in a README) cannot resolve on
          // docs-md.com and would 404 — render them as plain text instead of a dead link.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- `node` must not reach the DOM
          a: ({ children, href, node: _node, ...props }) => {
            const h = href ?? '';
            if (!ABSOLUTE.test(h)) {
              if (relativeBase) {
                // Markdown pages stay on this site; any other file goes to the file host.
                const target = PAGE_LIKE.test(h) || !/\.[a-z0-9]{1,5}(#.*)?$/i.test(h)
                  ? joinRelative(relativeBase.page, h)
                  : joinRelative(relativeBase.raw, h);
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
            const resolved = relativeBase && s && !ABSOLUTE.test(s) ? joinRelative(relativeBase.raw, s) : s;
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

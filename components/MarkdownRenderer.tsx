'use client';

import { isValidElement, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import MermaidDiagram from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
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

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
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
            if (!/^(https?:\/\/|\/|#|mailto:)/i.test(h)) {
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

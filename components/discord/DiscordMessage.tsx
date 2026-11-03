'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { formatTimestamp, parseAnsi, parseMessage, type Block, type Inline } from '@/lib/discord/render';

interface DiscordMessageProps {
  /** The raw message as typed into Discord. */
  source: string;
  /** Display name shown above the message. */
  author?: string;
  /** Stretch to the container width instead of a chat-bubble width. */
  className?: string;
}

/**
 * A preview of how a message renders in Discord's dark theme. Built from lib/discord/render.ts,
 * not from Discord itself: it is accurate for the documented syntax and approximate for edge cases.
 */
export default function DiscordMessage({ source, author = 'You', className = '' }: DiscordMessageProps) {
  const blocks = parseMessage(source);
  return (
    <div
      className={`not-prose rounded-xl bg-[#313338] p-4 text-[15px] leading-[1.375rem] text-[#dbdee1] ${className}`}
      style={{ fontFamily: '"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif' }}
      aria-label="Discord message preview"
    >
      <div className="flex gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
          <circle cx="20" cy="20" r="20" fill="#5865f2" />
          <path d="M13 15c2-1 4-1.6 7-1.6s5 .6 7 1.6c1.4 2.6 2 5.3 1.8 8.4-1.7 1.3-3.4 2-5 2.4l-1-1.6c.9-.3 1.7-.7 2.5-1.2-2.8 1.3-7.8 1.3-10.6 0 .8.5 1.6.9 2.5 1.2l-1 1.6c-1.6-.4-3.3-1.1-5-2.4-.2-3.1.4-5.8 1.8-8.4Z" fill="#fff" />
          <circle cx="16.6" cy="20.4" r="1.6" fill="#5865f2" />
          <circle cx="23.4" cy="20.4" r="1.6" fill="#5865f2" />
        </svg>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[#f2f3f5]">{author}</span>
            <span className="text-xs text-[#949ba4]">Today at 4:20 PM</span>
          </div>
          <div className="space-y-1">
            {blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }): ReactNode {
  switch (block.kind) {
    case 'paragraph':
      return <p className="whitespace-pre-wrap break-words">{inlines(block.inline)}</p>;
    case 'header': {
      const size = block.level === 1 ? 'text-[24px] leading-[1.375]' : block.level === 2 ? 'text-[20px] leading-[1.375]' : 'text-[16px] leading-[1.375]';
      return <div className={`mt-2 font-bold text-[#f2f3f5] ${size}`}>{inlines(block.inline)}</div>;
    }
    case 'subtext':
      return <div className="text-[13px] leading-[1.1rem] text-[#949ba4]">{inlines(block.inline)}</div>;
    case 'quote':
      return (
        <div className="flex gap-2">
          <div className="w-1 shrink-0 rounded bg-[#4e5058]" />
          <div className="min-w-0 space-y-1">
            {block.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </div>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={block.ordered ? 'list-decimal pl-6' : 'list-disc pl-6'} start={block.ordered ? block.start : undefined}>
          {block.items.map((it, i) => (
            <li key={i} style={{ marginLeft: it.depth * 16 }}>
              {inlines(it.inline)}
            </li>
          ))}
        </Tag>
      );
    }
    case 'codeblock':
      return (
        <pre className="mt-1 overflow-x-auto rounded-md border border-[#1e1f22] bg-[#2b2d31] p-2 text-[13px] leading-[1.125rem] text-[#dbdee1]" style={{ fontFamily: 'Consolas,"Andale Mono WT","Courier New",monospace' }}>
          <code>
            {block.lang === 'ansi'
              ? parseAnsi(block.text).map((s, i) => (
                  <span
                    key={i}
                    style={{
                      color: s.fg,
                      backgroundColor: s.bg,
                      fontWeight: s.bold ? 700 : undefined,
                      textDecoration: s.underline ? 'underline' : undefined,
                    }}
                  >
                    {s.text}
                  </span>
                ))
              : block.text}
          </code>
        </pre>
      );
  }
}

function inlines(nodes: Inline[]): ReactNode[] {
  return nodes.map((n, i) => <InlineView key={i} node={n} />);
}

function InlineView({ node }: { node: Inline }): ReactNode {
  switch (node.kind) {
    case 'text':
      return node.text;
    case 'bold':
      return <strong className="font-bold">{inlines(node.children)}</strong>;
    case 'italic':
      return <em>{inlines(node.children)}</em>;
    case 'underline':
      return <span className="underline">{inlines(node.children)}</span>;
    case 'strike':
      return <s>{inlines(node.children)}</s>;
    case 'spoiler':
      return <Spoiler>{inlines(node.children)}</Spoiler>;
    case 'code':
      return (
        <code className="rounded bg-[#2b2d31] px-1 py-px text-[85%]" style={{ fontFamily: 'Consolas,"Andale Mono WT","Courier New",monospace' }}>
          {node.text}
        </code>
      );
    case 'link':
      return <span className="cursor-pointer text-[#00a8fc] hover:underline">{inlines(node.children)}</span>;
    case 'url':
      return <span className="cursor-pointer break-all text-[#00a8fc] hover:underline">{node.href}</span>;
    case 'timestamp':
      return <Timestamp unix={node.unix} style={node.style} />;
  }
}

function Spoiler({ children }: { children: ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setShown(true)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShown(true)}
      title={shown ? undefined : 'Click to reveal spoiler'}
      className={shown ? 'rounded bg-[rgba(255,255,255,0.1)] px-0.5' : 'cursor-pointer rounded bg-[#1e1f22] px-0.5 text-transparent [&_*]:!text-transparent'}
    >
      {children}
    </span>
  );
}

const noop = () => () => {};

/** Server and first paint use UTC/en-US; the reader's browser then shows its own locale and timezone, as Discord does. */
function Timestamp({ unix, style }: { unix: number; style: string }) {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const text = isClient
    ? formatTimestamp(unix, style, navigator.language || 'en-US')
    : formatTimestamp(unix, style, 'en-US', unix * 1000, 'UTC');
  return <span className="rounded bg-[rgba(255,255,255,0.06)] px-0.5">{text}</span>;
}

'use client';

import { useMemo, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { BTN_PRIMARY, useCopy } from '@/components/tools/toolkit';

type Tab = 'link' | 'image' | 'code';

const LANGS = ['text', 'js', 'ts', 'python', 'bash', 'json', 'yaml', 'html', 'css', 'sql', 'go', 'rust', 'diff'];

export default function LinkGenerator() {
  const [tab, setTab] = useState<Tab>('link');
  const [copied, copy] = useCopy();

  const [text, setText] = useState('markdown cheat sheet');
  const [url, setUrl] = useState('https://docs-md.com/markdown-cheat-sheet');
  const [title, setTitle] = useState('');
  const [refStyle, setRefStyle] = useState(false);

  const [alt, setAlt] = useState('A diagram of the request flow');
  const [imgUrl, setImgUrl] = useState('https://example.com/diagram.png');
  const [linkTarget, setLinkTarget] = useState('');
  const [width, setWidth] = useState('');

  const [lang, setLang] = useState('js');
  const [code, setCode] = useState("const answer = 6 * 7;\nconsole.log(answer);");

  const snippet = useMemo(() => {
    if (tab === 'link') {
      const t = title.trim() ? ` "${title.trim()}"` : '';
      if (refStyle) {
        const label = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ref';
        return `[${text}][${label}]\n\n[${label}]: ${url}${t}`;
      }
      return `[${text}](${url}${t})`;
    }
    if (tab === 'image') {
      let img = `![${alt}](${imgUrl})`;
      if (width.trim()) img = `<img src="${imgUrl}" alt="${alt}" width="${width.trim()}">`;
      return linkTarget.trim() && !width.trim() ? `[${img}](${linkTarget.trim()})` : img;
    }
    const fence = code.includes('```') ? '````' : '```';
    return `${fence}${lang}\n${code}\n${fence}`;
  }, [tab, text, url, title, refStyle, alt, imgUrl, linkTarget, width, lang, code]);

  const field = 'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none';
  const label = 'block text-xs font-semibold uppercase tracking-wide text-gray-500';

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-6">
      <div className="mb-5 inline-flex rounded-full border border-gray-200 p-1">
        {(['link', 'image', 'code'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-700'
            }`}
          >
            {t === 'code' ? 'Code block' : t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {tab === 'link' && (
            <>
              <div>
                <label className={label} htmlFor="lg-text">Link text</label>
                <input id="lg-text" className={field} value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="lg-url">URL</label>
                <input id="lg-url" className={field} value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="lg-title">Tooltip title (optional)</label>
                <input id="lg-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={refStyle} onChange={(e) => setRefStyle(e.target.checked)} />
                Reference-style (URL defined at the bottom)
              </label>
            </>
          )}
          {tab === 'image' && (
            <>
              <div>
                <label className={label} htmlFor="lg-alt">Alt text (describe the image)</label>
                <input id="lg-alt" className={field} value={alt} onChange={(e) => setAlt(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="lg-imgurl">Image URL or path</label>
                <input id="lg-imgurl" className={field} value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="lg-width">Width in px (optional — switches to HTML img)</label>
                <input id="lg-width" className={field} value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 300" />
              </div>
              <div>
                <label className={label} htmlFor="lg-target">Make it a clickable link to (optional)</label>
                <input id="lg-target" className={field} value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} placeholder="https://…" />
              </div>
            </>
          )}
          {tab === 'code' && (
            <>
              <div>
                <label className={label} htmlFor="lg-lang">Language</label>
                <select id="lg-lang" className={field} value={lang} onChange={(e) => setLang(e.target.value)}>
                  {LANGS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="lg-code">Code</label>
                <textarea
                  id="lg-code"
                  className={`${field} h-40 resize-y font-mono`}
                  spellCheck={false}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Markdown</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-gray-800">{snippet}</pre>
            <button type="button" className={`${BTN_PRIMARY} absolute right-3 top-3`} onClick={() => copy(snippet)}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
            <MarkdownRenderer content={snippet} />
          </div>
        </div>
      </div>
    </div>
  );
}

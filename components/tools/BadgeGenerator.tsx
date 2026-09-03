'use client';

import { useMemo, useState } from 'react';
import { BTN_DARK, BTN_GHOST, useCopy } from '@/components/tools/toolkit';

type Style = 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
const STYLES: Style[] = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];

const NAMED_COLORS: { name: string; hex: string }[] = [
  { name: 'brightgreen', hex: '#4c1' },
  { name: 'green', hex: '#97ca00' },
  { name: 'yellowgreen', hex: '#a4a61d' },
  { name: 'yellow', hex: '#dfb317' },
  { name: 'orange', hex: '#fe7d37' },
  { name: 'red', hex: '#e05d44' },
  { name: 'blue', hex: '#007ec6' },
  { name: 'lightgrey', hex: '#9f9f9f' },
  { name: 'blueviolet', hex: '#8a2be2' },
  { name: 'success', hex: '#4c1' },
  { name: 'important', hex: '#fe7d37' },
  { name: 'critical', hex: '#e05d44' },
  { name: 'informational', hex: '#007ec6' },
  { name: 'inactive', hex: '#9f9f9f' },
];

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none';
const LABEL_CLASS = 'mb-1 block text-xs font-semibold text-gray-700';
const SELECT_CLASS =
  'w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm focus:border-indigo-400 focus:outline-none';

/** shields.io static-badge path segment encoding: `-` → `--`, `_` → `__`, then percent-encode. */
function seg(text: string): string {
  return encodeURIComponent(text.replace(/-/g, '--').replace(/_/g, '__'));
}

/** Strip a leading `#` so `#ff0000` becomes `ff0000`, which shields accepts. */
function color(c: string): string {
  return c.trim().replace(/^#/, '');
}

interface StaticFields {
  label: string;
  message: string;
  color: string;
  labelColor: string;
  style: Style;
  logo: string;
  logoColor: string;
  link: string;
}

const STATIC_DEFAULTS: StaticFields = {
  label: 'build',
  message: 'passing',
  color: 'brightgreen',
  labelColor: '',
  style: 'flat',
  logo: '',
  logoColor: '',
  link: '',
};

function staticUrl(f: StaticFields): string {
  const base = `https://img.shields.io/badge/${seg(f.label)}-${seg(f.message)}-${color(f.color) || 'blue'}`;
  return withParams(base, f);
}

function withParams(base: string, f: Pick<StaticFields, 'style' | 'logo' | 'logoColor' | 'labelColor'>): string {
  const params = new URLSearchParams();
  if (f.style !== 'flat') params.set('style', f.style);
  if (f.logo.trim()) params.set('logo', f.logo.trim());
  if (f.logoColor.trim()) params.set('logoColor', color(f.logoColor));
  if (f.labelColor.trim()) params.set('labelColor', color(f.labelColor));
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

interface Badge {
  alt: string;
  url: string;
  link: string;
}

function toMarkdown(b: Badge): string {
  const img = `![${b.alt}](${b.url})`;
  return b.link ? `[${img}](${b.link})` : img;
}
function toHtml(b: Badge): string {
  const img = `<img src="${b.url}" alt="${b.alt.replace(/"/g, '&quot;')}">`;
  return b.link ? `<a href="${b.link}">${img}</a>` : img;
}
function toRst(b: Badge): string {
  const lines = [`.. image:: ${b.url}`, `   :alt: ${b.alt}`];
  if (b.link) lines.push(`   :target: ${b.link}`);
  return lines.join('\n');
}

const FORMATS = [
  { id: 'markdown', label: 'Markdown', render: toMarkdown },
  { id: 'html', label: 'HTML', render: toHtml },
  { id: 'rst', label: 'reStructuredText', render: toRst },
  { id: 'url', label: 'URL', render: (b: Badge) => b.url },
] as const;

interface DynamicPreset {
  id: string;
  label: string;
  needs: 'repo' | 'npm' | 'pypi' | 'docker' | 'workflow';
  build: (ctx: DynamicCtx) => Badge | null;
}

interface DynamicCtx {
  repo: string;
  npm: string;
  pypi: string;
  docker: string;
  workflow: string;
  style: Style;
}

const DYNAMIC_PRESETS: DynamicPreset[] = [
  {
    id: 'npm-version',
    label: 'npm version',
    needs: 'npm',
    build: ({ npm }) => ({ alt: 'npm version', url: `https://img.shields.io/npm/v/${npm}`, link: `https://www.npmjs.com/package/${npm}` }),
  },
  {
    id: 'npm-downloads',
    label: 'npm downloads / month',
    needs: 'npm',
    build: ({ npm }) => ({ alt: 'npm downloads', url: `https://img.shields.io/npm/dm/${npm}`, link: `https://www.npmjs.com/package/${npm}` }),
  },
  {
    id: 'bundle-size',
    label: 'Bundle size (bundlephobia)',
    needs: 'npm',
    build: ({ npm }) => ({ alt: 'bundle size', url: `https://img.shields.io/bundlephobia/minzip/${npm}`, link: `https://bundlephobia.com/package/${npm}` }),
  },
  {
    id: 'license',
    label: 'License',
    needs: 'repo',
    build: ({ repo }) => ({ alt: 'license', url: `https://img.shields.io/github/license/${repo}`, link: `https://github.com/${repo}/blob/main/LICENSE` }),
  },
  {
    id: 'stars',
    label: 'GitHub stars',
    needs: 'repo',
    build: ({ repo }) => ({ alt: 'GitHub stars', url: `https://img.shields.io/github/stars/${repo}`, link: `https://github.com/${repo}/stargazers` }),
  },
  {
    id: 'last-commit',
    label: 'GitHub last commit',
    needs: 'repo',
    build: ({ repo }) => ({ alt: 'last commit', url: `https://img.shields.io/github/last-commit/${repo}`, link: `https://github.com/${repo}/commits` }),
  },
  {
    id: 'issues',
    label: 'GitHub open issues',
    needs: 'repo',
    build: ({ repo }) => ({ alt: 'open issues', url: `https://img.shields.io/github/issues/${repo}`, link: `https://github.com/${repo}/issues` }),
  },
  {
    id: 'ci',
    label: 'CI (GitHub Actions)',
    needs: 'workflow',
    build: ({ repo, workflow }) =>
      repo
        ? { alt: 'CI', url: `https://img.shields.io/github/actions/workflow/status/${repo}/${workflow}`, link: `https://github.com/${repo}/actions` }
        : null,
  },
  {
    id: 'codecov',
    label: 'Codecov coverage',
    needs: 'repo',
    build: ({ repo }) => ({ alt: 'coverage', url: `https://img.shields.io/codecov/c/github/${repo}`, link: `https://codecov.io/gh/${repo}` }),
  },
  {
    id: 'pypi',
    label: 'PyPI version',
    needs: 'pypi',
    build: ({ pypi }) => ({ alt: 'PyPI version', url: `https://img.shields.io/pypi/v/${pypi}`, link: `https://pypi.org/project/${pypi}/` }),
  },
  {
    id: 'docker',
    label: 'Docker pulls',
    needs: 'docker',
    build: ({ docker }) => ({ alt: 'Docker pulls', url: `https://img.shields.io/docker/pulls/${docker}`, link: `https://hub.docker.com/r/${docker}` }),
  },
];

function applyStyle(url: string, style: Style): string {
  if (style === 'flat') return url;
  return `${url}${url.includes('?') ? '&' : '?'}style=${style}`;
}

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-1 transition ${active ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}>
      {children}
    </button>
  );
}

function BadgePreview({ badge, height = 'h-5' }: { badge: Badge; height?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- remote shields.io SVG, sized by the service
  return <img src={badge.url} alt={badge.alt} className={`${height} w-auto`} />;
}

function OutputBlock({ text, label }: { text: string; label: string }) {
  const [copied, copy] = useCopy();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <button onClick={() => copy(text)} className="text-xs font-medium text-indigo-700 hover:underline">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl bg-gray-950 p-3 text-xs text-gray-200">
        <code>{text}</code>
      </pre>
    </div>
  );
}

export default function BadgeGenerator() {
  const [tab, setTab] = useState<'static' | 'dynamic'>('static');
  const [s, setS] = useState<StaticFields>(STATIC_DEFAULTS);
  const setStatic = <K extends keyof StaticFields>(k: K, v: StaticFields[K]) => setS((p) => ({ ...p, [k]: v }));

  const [repo, setRepo] = useState('vercel/next.js');
  const [npm, setNpm] = useState('next');
  const [pypi, setPypi] = useState('');
  const [docker, setDocker] = useState('');
  const [workflow, setWorkflow] = useState('ci.yml');
  const [dynStyle, setDynStyle] = useState<Style>('flat');
  const [selected, setSelected] = useState<Set<string>>(new Set(['npm-version', 'npm-downloads', 'license', 'stars']));
  const [allCopied, copyAll] = useCopy();
  const [allFormat, setAllFormat] = useState<(typeof FORMATS)[number]['id']>('markdown');

  const staticBadge: Badge = useMemo(
    () => ({ alt: `${s.label}: ${s.message}`, url: staticUrl(s), link: s.link.trim() }),
    [s],
  );

  const ctx: DynamicCtx = useMemo(
    () => ({ repo: repo.trim(), npm: npm.trim(), pypi: pypi.trim(), docker: docker.trim(), workflow: workflow.trim(), style: dynStyle }),
    [repo, npm, pypi, docker, workflow, dynStyle],
  );

  const available = useMemo(
    () =>
      DYNAMIC_PRESETS.map((p) => {
        const has =
          p.needs === 'repo' ? !!ctx.repo
          : p.needs === 'npm' ? !!ctx.npm
          : p.needs === 'pypi' ? !!ctx.pypi
          : p.needs === 'docker' ? !!ctx.docker
          : !!ctx.repo && !!ctx.workflow;
        const badge = has ? p.build(ctx) : null;
        return { preset: p, badge: badge ? { ...badge, url: applyStyle(badge.url, dynStyle) } : null };
      }),
    [ctx, dynStyle],
  );

  const chosen = available.filter((a) => a.badge && selected.has(a.preset.id)).map((a) => a.badge as Badge);
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allText = useMemo(() => {
    const fmt = FORMATS.find((f) => f.id === allFormat)!;
    return chosen.map((b) => fmt.render(b)).join(allFormat === 'rst' ? '\n\n' : ' ');
  }, [chosen, allFormat]);

  return (
    <div>
      <div className="mb-4 inline-flex rounded-lg border border-gray-200 p-0.5 text-xs font-medium">
        <Seg active={tab === 'static'} onClick={() => setTab('static')}>Static badge</Seg>
        <Seg active={tab === 'dynamic'} onClick={() => setTab('dynamic')}>Dynamic badges</Seg>
      </div>

      {tab === 'static' ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-label">Label (left side)</label>
                <input id="badge-label" value={s.label} onChange={(e) => setStatic('label', e.target.value)} className={FIELD_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-message">Message (right side)</label>
                <input id="badge-message" value={s.message} onChange={(e) => setStatic('message', e.target.value)} className={FIELD_CLASS} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Color</label>
              <div className="flex flex-wrap gap-1.5">
                {NAMED_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    onClick={() => setStatic('color', c.name)}
                    className={`h-6 w-6 rounded-full border-2 transition ${s.color === c.name ? 'border-gray-950 scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <input
                  value={s.color}
                  onChange={(e) => setStatic('color', e.target.value)}
                  placeholder="name or hex"
                  aria-label="Color name or hex"
                  className="w-32 rounded-lg border border-gray-200 px-2 py-1 font-mono text-xs focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-style">Style</label>
                <select id="badge-style" value={s.style} onChange={(e) => setStatic('style', e.target.value as Style)} className={SELECT_CLASS}>
                  {STYLES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-labelcolor">Label color (optional)</label>
                <input id="badge-labelcolor" value={s.labelColor} onChange={(e) => setStatic('labelColor', e.target.value)} placeholder="grey, 555, #24292e" className={`${FIELD_CLASS} font-mono`} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-logo">Logo (simple-icons slug)</label>
                <input id="badge-logo" value={s.logo} onChange={(e) => setStatic('logo', e.target.value)} placeholder="github, npm, python…" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="badge-logocolor">Logo color (optional)</label>
                <input id="badge-logocolor" value={s.logoColor} onChange={(e) => setStatic('logoColor', e.target.value)} placeholder="white" className={`${FIELD_CLASS} font-mono`} />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="badge-link">Link URL (optional — makes the badge clickable)</label>
              <input id="badge-link" value={s.link} onChange={(e) => setStatic('link', e.target.value)} placeholder="https://github.com/you/project/actions" className={FIELD_CLASS} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex min-h-24 items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <BadgePreview badge={staticBadge} height={s.style === 'for-the-badge' ? 'h-7' : 'h-5'} />
            </div>
            {FORMATS.map((f) => (
              <OutputBlock key={f.id} label={f.label} text={f.render(staticBadge)} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-repo">GitHub repo (owner/name)</label>
                <input id="dyn-repo" value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="vercel/next.js" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-npm">npm package</label>
                <input id="dyn-npm" value={npm} onChange={(e) => setNpm(e.target.value)} placeholder="next" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-pypi">PyPI package</label>
                <input id="dyn-pypi" value={pypi} onChange={(e) => setPypi(e.target.value)} placeholder="requests" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-docker">Docker image (user/image)</label>
                <input id="dyn-docker" value={docker} onChange={(e) => setDocker(e.target.value)} placeholder="library/nginx" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-workflow">Actions workflow file</label>
                <input id="dyn-workflow" value={workflow} onChange={(e) => setWorkflow(e.target.value)} placeholder="ci.yml" className={`${FIELD_CLASS} font-mono`} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="dyn-style">Style</label>
                <select id="dyn-style" value={dynStyle} onChange={(e) => setDynStyle(e.target.value as Style)} className={SELECT_CLASS}>
                  {STYLES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <p className={LABEL_CLASS}>Badges</p>
              <ul className="space-y-2">
                {available.map(({ preset, badge }) => (
                  <li key={preset.id} className="flex items-center gap-3">
                    <input
                      id={`dyn-${preset.id}`}
                      type="checkbox"
                      checked={selected.has(preset.id)}
                      disabled={!badge}
                      onChange={() => toggle(preset.id)}
                      className="h-3.5 w-3.5 accent-indigo-600"
                    />
                    <label htmlFor={`dyn-${preset.id}`} className={`flex flex-1 items-center justify-between gap-3 text-sm ${badge ? 'text-gray-800' : 'text-gray-400'}`}>
                      <span>{preset.label}</span>
                      {badge ? <BadgePreview badge={badge} /> : <span className="text-xs">needs {preset.needs === 'workflow' ? 'repo + workflow' : preset.needs}</span>}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-xs font-semibold text-gray-700">Badge row</p>
              {chosen.length ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  {chosen.map((b) => (
                    <BadgePreview key={b.url} badge={b} height={dynStyle === 'for-the-badge' ? 'h-7' : 'h-5'} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select at least one badge.</p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex rounded-lg border border-gray-200 p-0.5 text-xs font-medium">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAllFormat(f.id)}
                    className={`rounded-md px-3 py-1 transition ${allFormat === f.id ? 'bg-gray-950 text-white' : 'text-gray-600 hover:text-gray-950'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={() => copyAll(allText)} disabled={!chosen.length} className={BTN_DARK}>
                {allCopied ? '✓ Copied' : 'Copy all selected'}
              </button>
            </div>
            <pre className="min-h-32 overflow-x-auto whitespace-pre-wrap break-all rounded-2xl bg-gray-950 p-4 text-xs text-gray-200">
              <code>{allText || '// pick badges on the left'}</code>
            </pre>
            <p className="text-xs text-gray-500">
              Dynamic badges are rendered live by shields.io, so the numbers update on their own — nothing to maintain.
              <button onClick={() => { setRepo(''); setNpm(''); }} className={`ml-2 ${BTN_GHOST} px-2 py-0.5`}>Clear examples</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

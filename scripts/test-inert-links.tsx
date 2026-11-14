// Renders MarkdownRenderer to static HTML and checks the inert-link mode used for documents
// whose author is not trusted yet. Run: npx tsx scripts/test-inert-links.tsx
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import MarkdownRenderer from '../components/MarkdownRenderer';

const md = [
  'A [named link](https://valves.example-shop.com/buy?x=1) and an autolink https://valves.example-shop.com/plain .',
  '',
  'Same site: [the plan](https://docs-md.com/calm-river-Ab12C) and [an anchor](#next) and [mail](mailto:someone@example.com).',
  '',
  '![chart](https://img.example-shop.com/c.png) ![inline](data:image/png;base64,AAAA)',
  '',
  '## Next',
].join('\n');

const inert = renderToStaticMarkup(<MarkdownRenderer content={md} inertLinks />);
const live = renderToStaticMarkup(<MarkdownRenderer content={md} />);

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  void name;
};

check('inert: no anchor or image points at another site', () => {
  assert.ok(!/<a [^>]*href="https:\/\/valves\.example-shop\.com/.test(inert), inert);
  assert.ok(!/<img /.test(inert), 'no <img> at all in inert mode');
  assert.ok(!/href="mailto:/.test(inert));
});
check('inert: the destination stays visible as text', () => {
  assert.match(inert, /named link <span class="inert-link-url">\(https:\/\/valves\.example-shop\.com\/buy\?x=1\)<\/span>/);
  assert.match(inert, /<span class="inert-link">https:\/\/valves\.example-shop\.com\/plain<\/span>/);
  assert.match(inert, /\[image: chart\]<span class="inert-link-url"> \(https:\/\/img\.example-shop\.com\/c\.png\)<\/span>/);
  assert.match(inert, /\[image: inline\]<\/span>/, 'a data: image shows its alt text only');
  assert.match(inert, /someone@example\.com/);
});
check('inert: links to docs-md.com and in-page anchors still work', () => {
  assert.match(inert, /<a href="https:\/\/docs-md\.com\/calm-river-Ab12C"/);
  assert.match(inert, /<a href="#next"/);
});
check('live: links are anchors with ugc nofollow', () => {
  assert.match(live, /<a href="https:\/\/valves\.example-shop\.com\/buy\?x=1" rel="nofollow ugc noopener noreferrer">named link<\/a>/);
  assert.match(live, /<img src="https:\/\/img\.example-shop\.com\/c\.png"/);
});

console.log(`test-inert-links: ${passed} passed`);

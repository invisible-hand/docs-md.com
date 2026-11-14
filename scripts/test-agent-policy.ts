// Unit tests for lib/agent-policy.ts. Run: npx tsx scripts/test-agent-policy.ts
import assert from 'node:assert/strict';
import {
  ANTHROPIC_CIDRS,
  classifyShape,
  computeTier,
  decidePost,
  findSecret,
  ipInCidr,
  limitsFor,
  linkedHosts,
  outboundHosts,
  platformOf,
  POLICY,
} from '../lib/agent-policy';

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
  } catch (e) {
    failures.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

const DAY = 86_400_000;
const now = Date.UTC(2026, 10, 13);

test('tier: a fresh key is new; platform wins; established needs age, posts and days', () => {
  assert.equal(computeTier({ created_at: now, doc_posts: 0, post_days: 0 }, null, now), 'new');
  assert.equal(computeTier({ created_at: now, doc_posts: 0, post_days: 0 }, 'anthropic', now), 'platform');
  const old = now - 14 * DAY;
  assert.equal(computeTier({ created_at: old, doc_posts: 5, post_days: 3 }, null, now), 'established');
  assert.equal(computeTier({ created_at: old + 1000, doc_posts: 5, post_days: 3 }, null, now), 'new', 'one second short of 14 days');
  assert.equal(computeTier({ created_at: old, doc_posts: 4, post_days: 3 }, null, now), 'new');
  assert.equal(computeTier({ created_at: old, doc_posts: 50, post_days: 2 }, null, now), 'new', 'posts on two days only');
});

test('limits follow the tier', () => {
  assert.deepEqual(limitsFor('new'), { posts_per_day: 10, max_expiry: '30d', links_clickable: false, can_be_indexed: false });
  assert.deepEqual(limitsFor('established'), { posts_per_day: 50, max_expiry: 'never', links_clickable: true, can_be_indexed: true });
  assert.equal(limitsFor('platform').posts_per_day, POLICY.postsPerDay.platform);
});

test('decidePost: new keys are capped and inert; nothing is refused', () => {
  const a = decidePost('new', 'document', 'never');
  assert.equal(a.expiry, '30d');
  assert.equal(a.linksLive, false);
  assert.equal(a.indexable, false);
  assert.ok(a.notices.some((n) => n.startsWith('Expiry set to 30d')));
  const b = decidePost('new', 'link_post', '30d');
  assert.equal(b.expiry, '7d');
  const c = decidePost('new', 'link_post', '1d');
  assert.equal(c.expiry, '1d', 'a shorter request is kept');
  assert.ok(!c.notices.some((n) => n.startsWith('Expiry set')));
  const d = decidePost('new', 'document', '7d');
  assert.equal(d.expiry, '7d');
});

test('decidePost: trusted calls get live links; only permanent documents are indexable', () => {
  for (const tier of ['established', 'platform'] as const) {
    const doc = decidePost(tier, 'document', 'never');
    assert.deepEqual([doc.expiry, doc.linksLive, doc.indexable], ['never', true, true]);
    assert.equal(doc.notices.length, 0);
    assert.equal(decidePost(tier, 'document', '30d').indexable, false, 'expiring documents are never indexed');
    const link = decidePost(tier, 'link_post', 'never');
    assert.deepEqual([link.expiry, link.linksLive, link.indexable], ['never', true, false]);
    assert.equal(link.notices.length, 1);
  }
});

test('hosts: fences are skipped, www is dropped, reference hosts do not count as outbound', () => {
  const md = 'See https://www.Example-Shop.com/buy and [docs](https://github.com/acme/api) and http://10.0.0.5:8080/x\n\n```bash\ncurl https://hidden.example-two.com/\n```\n';
  assert.deepEqual(linkedHosts(md).sort(), ['10.0.0.5', 'example-shop.com', 'github.com']);
  assert.deepEqual(outboundHosts(md), ['example-shop.com']);
  assert.deepEqual(outboundHosts('https://docs.anthropic.com/x https://sub.github.io/y https://localhost/z https://en.wikipedia.org/wiki/A'), []);
});

test('shape: prose around an outbound link is a link post; working documents are not', () => {
  const promo = '# Best valves\n\nChoosing a valve is hard. Read [our catalogue](https://valves.example-shop.com/catalogue) for details.\n\nMore text here.';
  assert.equal(classifyShape(promo), 'link_post');
  assert.equal(classifyShape('# Notes\n\nNo links at all, just prose.'), 'document');
  assert.equal(classifyShape('# Handoff\n\nPR: https://github.com/acme/api/pull/12\n\nNothing else.'), 'document', 'reference hosts only');
  assert.equal(classifyShape(`${promo}\n\n\`\`\`ts\nconst a = 1;\n\`\`\`\n`), 'document', 'code block');
  assert.equal(classifyShape(`${promo}\n\n| a | b |\n|---|---|\n| 1 | 2 |\n`), 'document', 'table');
  assert.equal(classifyShape(`${promo}\n\n- [ ] ship it\n`), 'document', 'task list');
  assert.equal(classifyShape(`${promo}\n\nRun \`npm test\`, then \`npm run build\`, then \`git push\`.`), 'document', 'three inline code spans');
  assert.equal(classifyShape(`${promo}\n\nRun \`npm test\`.`), 'link_post', 'one inline code span is not enough');
  assert.equal(classifyShape('Text --- with dashes | and a pipe https://shop.example-shop.com'), 'link_post', 'a pipe is not a table');
});

test('secrets: live-looking credentials are found with their line; placeholders are not', () => {
  const key = 'sk-ant-api03-' + 'aB3dE5gH7jK9mN1pQ3sT5vW7yZ9bD1fH3jL5nP7rT9vX1zB3';
  assert.deepEqual(findSecret(`line one\nANTHROPIC_API_KEY=${key}\n`), { kind: 'Anthropic API key', line: 2 });
  assert.equal(findSecret('-----BEGIN OPENSSH PRIVATE KEY-----\nabc')?.kind, 'private key block');
  assert.equal(findSecret('token ghp_' + 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8')?.kind, 'GitHub token');
  assert.equal(findSecret('AKIA' + 'IOSFODNN7EXAMPLE'), null, 'AWS documentation example key');
  assert.equal(findSecret('AKIA' + 'J5QW8ZR3TN7YB2KD')?.kind, 'AWS access key id');
  assert.equal(findSecret('dmk_' + 'Zx9Qw3Er7Ty1Ui5Op2As6Df0Gh4Jk8Lz3Xc7Vb1Nm5Q')?.kind, 'Docs MD agent key');
  assert.equal(findSecret('dmk_EXAMPLE_KEY_DO_NOT_USE_0000000000000000000'), null);
  assert.equal(findSecret('sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'), null);
  assert.equal(findSecret('export OPENAI_API_KEY=$OPENAI_API_KEY and sk-your-key-here'), null);
  assert.equal(findSecret('# Plain document\n\nNothing secret. The risk-of-loss is low.'), null);
});

test('networks: CIDR maths and platform detection', () => {
  assert.ok(ipInCidr('160.79.104.0', '160.79.104.0/21'));
  assert.ok(ipInCidr('160.79.111.255', '160.79.104.0/21'));
  assert.ok(!ipInCidr('160.79.112.0', '160.79.104.0/21'));
  assert.ok(ipInCidr('153.61.223.9', '153.61.208.0/20'));
  assert.ok(!ipInCidr('153.61.224.1', '153.61.208.0/20'));
  assert.ok(ipInCidr('::ffff:160.79.104.9', '160.79.104.0/21'));
  assert.ok(!ipInCidr('2607:6bc0::1', '160.79.104.0/21'));
  assert.ok(!ipInCidr('not-an-ip', '160.79.104.0/21'));
  assert.ok(ipInCidr('8.8.8.8', '8.8.8.8/32'));
  assert.equal(ANTHROPIC_CIDRS.length, 2);
  assert.equal(platformOf('160.79.104.10', []), 'anthropic');
  assert.equal(platformOf('104.192.219.205', ['104.192.219.204/30']), 'openai');
  assert.equal(platformOf('203.0.113.5', ['104.192.219.204/30']), null);
  assert.equal(platformOf('unknown', []), null);
});

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'));
  console.error(`\ntest-agent-policy: ${failures.length} failed, ${passed} passed`);
  process.exit(1);
}
console.log(`test-agent-policy: ${passed} passed`);

// Unit tests for lib/url-safety.ts. Run: npx tsx scripts/test-url-safety.ts
import assert from 'node:assert/strict';
import { guardedLookup, isPrivateIp, vetUrlSyntax } from '../lib/url-safety';

let passed = 0;
const failures: string[] = [];
function test(name: string, fn: () => void | Promise<void>) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passed++;
    })
    .catch((e) => {
      failures.push(`${name}: ${e instanceof Error ? e.message : String(e)}`);
    });
}

const privateAddrs = [
  '127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0',
  '192.0.0.8', '198.18.0.1', '224.0.0.1',
  '::', '::1', '::ffff:127.0.0.1', '::ffff:7f00:1', '::ffff:a9fe:a9fe', '::127.0.0.1',
  '64:ff9b::7f00:1', '64:ff9b::a9fe:a9fe', '2002:7f00:1::', '2001:0:4136:e378::1', '2001:db8::1',
  'fc00::1', 'fd12:3456::1', 'fe80::1', 'fec0::1', 'ff02::1', '[::1]', 'fe80::1%eth0', 'not-an-ip:::',
];
const publicAddrs = ['8.8.8.8', '1.1.1.1', '93.184.216.34', '2606:4700:4700::1111', '2001:4860:4860::8888', '::ffff:8.8.8.8'];

async function main() {
  for (const ip of privateAddrs) await test(`private ${ip}`, () => assert.equal(isPrivateIp(ip), true));
  for (const ip of publicAddrs) await test(`public ${ip}`, () => assert.equal(isPrivateIp(ip), false));

  await test('syntax rejects localhost', () => assert.equal(vetUrlSyntax('http://localhost/').ok, false));
  await test('syntax rejects mapped v6 literal', () => assert.equal(vetUrlSyntax('http://[::ffff:127.0.0.1]/').ok, false));
  await test('syntax rejects NAT64 literal', () => assert.equal(vetUrlSyntax('http://[64:ff9b::a9fe:a9fe]/').ok, false));
  await test('syntax accepts public https', () => assert.equal(vetUrlSyntax('https://example.com/a').ok, true));

  await test('guardedLookup refuses localhost', () =>
    new Promise<void>((resolve, reject) =>
      guardedLookup('localhost', {}, (err) => (err ? resolve() : reject(new Error('expected an error'))))
    ));

  console.log(`${passed} passed, ${failures.length} failed`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  if (failures.length) process.exit(1);
}

main();

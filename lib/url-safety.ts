// SSRF guard for server-side URL fetching (link checker). Pure functions so
// the classifier can be unit-tested without the network.

import { lookup as dnsLookup, type LookupAddress, type LookupOptions } from 'node:dns';
import { lookup } from 'node:dns/promises';

const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return true;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 192 && b === 0 && parts[2] === 0) return true; // 192.0.0.0/24 IETF protocol assignments
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmarking
  if (a >= 224) return true; // multicast + reserved + broadcast
  return false;
}

/** Expands an IPv6 address to its eight 16-bit groups (embedded dotted IPv4 included). */
function ipv6Groups(v6: string): number[] | null {
  let s = v6;
  const dotted = /(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (dotted) {
    const p = dotted[1].split('.').map(Number);
    if (p.some((n) => Number.isNaN(n) || n > 255)) return null;
    s = s.slice(0, -dotted[1].length) + `${((p[0] << 8) | p[1]).toString(16)}:${((p[2] << 8) | p[3]).toString(16)}`;
  }
  const halves = s.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? head.length !== 8 : missing < 0) return null;
  const groups = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...tail].map((g) => parseInt(g, 16));
  return groups.length === 8 && groups.every((g) => !Number.isNaN(g) && g >= 0 && g <= 0xffff) ? groups : null;
}

function v4FromGroups(hi: number, lo: number): string {
  return `${hi >> 8}.${hi & 0xff}.${lo >> 8}.${lo & 0xff}`;
}

export function isPrivateIPv6(ip: string): boolean {
  const v6 = ip.toLowerCase().replace(/^\[|\]$/g, '').replace(/%.*$/, '');
  const g = ipv6Groups(v6);
  if (!g) return true; // unparseable: refuse
  const zeroPrefix = (n: number) => g.slice(0, n).every((x) => x === 0);
  if (zeroPrefix(8)) return true; // ::
  if (zeroPrefix(7) && g[7] === 1) return true; // ::1
  if (zeroPrefix(5) && g[5] === 0xffff) return isPrivateIPv4(v4FromGroups(g[6], g[7])); // ::ffff:0:0/96 mapped
  if (zeroPrefix(6)) return true; // ::/96 IPv4-compatible (deprecated)
  if (g[0] === 0x64 && g[1] === 0xff9b) return true; // 64:ff9b::/96 and /48 NAT64
  if (g[0] === 0x2002) return true; // 2002::/16 6to4
  if (g[0] === 0x2001 && g[1] === 0) return true; // 2001::/32 Teredo
  if (g[0] === 0x2001 && g[1] === 0xdb8) return true; // documentation
  if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((g[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link local
  if ((g[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 site local (deprecated)
  if ((g[0] & 0xff00) === 0xff00) return true; // multicast
  return false;
}

export function isPrivateIp(ip: string): boolean {
  return ip.includes(':') ? isPrivateIPv6(ip) : isPrivateIPv4(ip);
}

export function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  if (!h || h === 'localhost') return true;
  if (/\.(localhost|local|internal|localdomain|home|lan|intranet)$/.test(h)) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return isPrivateIp(h);
  if (h.startsWith('[') || h.includes(':')) return isPrivateIp(h);
  return false;
}

export type UrlVerdict = { ok: true; url: URL } | { ok: false; reason: string };

/** Syntactic checks only: scheme, host name, port. */
export function vetUrlSyntax(raw: string): UrlVerdict {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: 'invalid URL' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { ok: false, reason: 'unsupported scheme' };
  if (url.username || url.password) return { ok: false, reason: 'credentials in URL' };
  if (!ALLOWED_PORTS.has(url.port)) return { ok: false, reason: 'non-standard port' };
  if (isBlockedHostname(url.hostname)) return { ok: false, reason: 'private or local host' };
  return { ok: true, url };
}

type LookupCallback = (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void;

/**
 * Drop-in `lookup` for http.request: resolves, then refuses the connection if any
 * address is private. Because the check runs on the address actually dialled,
 * a DNS answer that changes between vetUrl() and the request cannot slip through.
 */
export function guardedLookup(hostname: string, options: LookupOptions, callback: LookupCallback): void {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, []);
    const list = addresses as LookupAddress[];
    const blocked = list.find((a) => isPrivateIp(a.address));
    if (!list.length || blocked) {
      const e: NodeJS.ErrnoException = new Error('resolves to a private address');
      e.code = 'EPRIVATEADDR';
      return callback(e, []);
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

/** Full check including DNS: every resolved address must be public. */
export async function vetUrl(raw: string): Promise<UrlVerdict> {
  const syntax = vetUrlSyntax(raw);
  if (!syntax.ok) return syntax;
  const host = syntax.url.hostname;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':')) return syntax; // literal, already vetted
  try {
    const addrs = await lookup(host, { all: true });
    if (!addrs.length) return { ok: false, reason: 'DNS: no address' };
    if (addrs.some((a) => isPrivateIp(a.address))) return { ok: false, reason: 'resolves to a private address' };
  } catch {
    return { ok: false, reason: 'DNS lookup failed' };
  }
  return syntax;
}

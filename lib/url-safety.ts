// SSRF guard for server-side URL fetching (link checker). Pure functions so
// the classifier can be unit-tested without the network.

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
  if (a >= 224) return true; // multicast + reserved + broadcast
  return false;
}

export function isPrivateIPv6(ip: string): boolean {
  const v6 = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (v6 === '::' || v6 === '::1') return true;
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(v6);
  if (mapped) return isPrivateIPv4(mapped[1]);
  const first = parseInt(v6.split(':')[0] || '0', 16);
  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link local
  if ((first & 0xff00) === 0xff00) return true; // multicast
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

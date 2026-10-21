// Daily caps that hold across serverless instances: the counter lives in Postgres
// (share_quota), unlike the per-instance burst limiter in lib/rate-limit.ts.
import { createHash } from 'crypto';
import { dbOperations } from '@/lib/db';

export const DAILY_SHARE_LIMIT_PER_IP = Number(process.env.DAILY_SHARE_LIMIT_PER_IP ?? 100);
export const DAILY_REPORT_LIMIT_PER_IP = 20;

export interface DailyQuotaResult {
  allowed: boolean;
  count: number;
  limit: number;
}

function hashKey(scope: string, ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? '';
  return createHash('sha256').update(`${salt}:${scope}:${ip}`).digest('hex').slice(0, 32);
}

/** Counts this request against the IP's daily allowance. Fails open if the database is unavailable. */
export async function consumeDailyQuota(scope: string, ip: string, limit: number): Promise<DailyQuotaResult> {
  try {
    const count = await dbOperations.incrementDailyCount(hashKey(scope, ip));
    return { allowed: count <= limit, count, limit };
  } catch (error) {
    console.error('Daily quota check failed:', error);
    return { allowed: true, count: 0, limit };
  }
}

export function secondsUntilUtcMidnight(now = Date.now()): number {
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return Math.max(Math.ceil((next.getTime() - now) / 1000), 1);
}

export function dailyLimitMessage(limit: number): string {
  return `Daily limit reached (${limit} new shares per day from one address). Try again tomorrow (UTC).`;
}

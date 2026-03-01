import { NextRequest } from 'next/server';

export class RequestBodyError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = 'RequestBodyError';
  }
}

export async function parseJsonBodyWithLimit<T>(
  request: NextRequest,
  maxBytes: number
): Promise<T> {
  const rawBody = await request.text();
  const bodySize = Buffer.byteLength(rawBody, 'utf8');

  if (bodySize === 0) {
    throw new RequestBodyError('Request body is required');
  }

  if (bodySize > maxBytes) {
    throw new RequestBodyError('Request body is too large', 413);
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new RequestBodyError('Invalid JSON payload');
  }
}

export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7).trim();
}

export function isAuthorizedByEnvSecret(request: NextRequest, secretEnvName: string): boolean {
  const expectedSecret = process.env[secretEnvName];
  if (!expectedSecret) {
    return false;
  }

  const bearerToken = getBearerToken(request);
  if (bearerToken === expectedSecret) {
    return true;
  }

  const xSecretHeader = request.headers.get('x-admin-secret');
  return xSecretHeader === expectedSecret;
}

export function normalizeFilename(filename?: string): string {
  const fallback = 'untitled.md';
  if (!filename) {
    return fallback;
  }

  const normalized = filename.trim().slice(0, 120);
  if (!normalized) {
    return fallback;
  }

  return normalized.endsWith('.md') ? normalized : `${normalized}.md`;
}

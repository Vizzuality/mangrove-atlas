import type { NextRequest } from 'next/server';

import { env } from '../../../env.mjs';

/**
 * Parse a comma-separated list of URLs into normalised origins.
 * Throws on a malformed entry so a bad value fails at startup rather than
 * degrading SSO silently.
 */
export function parseOrigins(raw: string | undefined | null): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => new URL(s).origin);
}

/**
 * Origins trusted by the SSO bridge. Used for:
 *  - `frame-ancestors` on /api/auth/sso/authorize (MRTT silent-SSO iframe)
 *  - redirect_uri validation (prevents open redirects)
 *  - CORS on the SSO endpoints MRTT calls directly (exchange, sync, logout)
 *  - CORS on the public /api/* routes (proxy.ts)
 *
 * Sourced from the Zod-validated env. NEXT_PUBLIC_MRTT_SITE and NEXTAUTH_URL
 * are always included; SSO_ALLOWED_ORIGINS adds extra origins (staging MRTT,
 * localhost for development).
 */
export const SSO_ALLOWED_ORIGINS: string[] = Array.from(
  new Set([
    new URL(env.NEXT_PUBLIC_MRTT_SITE).origin,
    new URL(env.NEXTAUTH_URL).origin,
    ...parseOrigins(env.SSO_ALLOWED_ORIGINS),
  ])
);

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  try {
    return SSO_ALLOWED_ORIGINS.includes(new URL(origin).origin);
  } catch {
    return false;
  }
}

export function isAllowedRedirectUri(uri: string): boolean {
  return isAllowedOrigin(uri);
}

const SSO_CORS_BASE_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
  Vary: 'Origin',
};

/**
 * CORS headers for SSO endpoints that MRTT calls directly (exchange, sync, logout).
 * Echoes the request Origin when it is allowed; `Allow-Credentials: true`
 * forbids a wildcard, so disallowed origins get no `Allow-Origin` at all.
 */
export function getSSOCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!isAllowedOrigin(origin)) return { ...SSO_CORS_BASE_HEADERS };
  return {
    ...SSO_CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': new URL(origin as string).origin,
  };
}

/**
 * Allow MRTT to load the silent-SSO authorize endpoint in an iframe.
 * Any default frame-blocking header (e.g. X-Frame-Options: DENY emitted by
 * upstream middleware / hosting) would silently break the silent-SSO iframe
 * and cause MRTT's silentSsoCheck() to time out without diagnostic.
 */
export function getSSOFrameAncestorsHeader(): Record<string, string> {
  return {
    'Content-Security-Policy': `frame-ancestors 'self' ${SSO_ALLOWED_ORIGINS.join(' ')};`,
  };
}

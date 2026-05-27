import { env } from '../../../env.mjs';

/**
 * Allowed origins for SSO redirect URIs.
 * Prevents open-redirect attacks on authorize/sync/logout endpoints.
 *
 * Sourced from the Zod-validated env so a missing or malformed value fails
 * at startup rather than degrading SSO silently.
 */
export const SSO_ALLOWED_ORIGINS: string[] = [
  new URL(env.NEXT_PUBLIC_MRTT_SITE).origin,
  new URL(env.NEXTAUTH_URL).origin,
];

export function isAllowedRedirectUri(uri: string): boolean {
  try {
    const parsed = new URL(uri);
    return SSO_ALLOWED_ORIGINS.includes(parsed.origin);
  } catch {
    return false;
  }
}

/**
 * CORS headers for SSO endpoints that MRTT calls directly (exchange, sync, logout).
 */
export function getSSOCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': new URL(env.NEXT_PUBLIC_MRTT_SITE).origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}

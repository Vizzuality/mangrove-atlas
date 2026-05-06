/**
 * Allowed origins for SSO redirect URIs.
 * Prevents open-redirect attacks on authorize/sync/logout endpoints.
 */
export const SSO_ALLOWED_ORIGINS: string[] = [
  process.env.NEXT_PUBLIC_MRTT_SITE,
  process.env.NEXTAUTH_URL,
].filter((v): v is string => Boolean(v));

/**
 * Validate that a redirect URI belongs to an allowed origin.
 */
export function isAllowedRedirectUri(uri: string): boolean {
  try {
    const parsed = new URL(uri);
    return SSO_ALLOWED_ORIGINS.some((origin) => {
      const allowed = new URL(origin);
      return parsed.origin === allowed.origin;
    });
  } catch {
    return false;
  }
}

/**
 * CORS headers for SSO endpoints that MRTT calls directly (exchange, sync, logout).
 */
export function getSSOCorsHeaders(): Record<string, string> {
  const mrttOrigin = process.env.NEXT_PUBLIC_MRTT_SITE;
  if (!mrttOrigin) return {};

  try {
    const origin = new URL(mrttOrigin).origin;
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    };
  } catch {
    return {};
  }
}

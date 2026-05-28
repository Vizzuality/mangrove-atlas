import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

export const SSO_COOKIE_NAME = isProd ? '__Secure-gmw-sso-token' : 'gmw-sso-token';

const COOKIE_DOMAIN = isProd ? '.globalmangrovewatch.org' : undefined;

// SameSite=None required so the cookie persists when set via cross-site
// fetch from MRTT (POST /api/auth/sso/sync). Browsers require Secure with
// SameSite=None, so dev (non-HTTPS) falls back to Lax.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
};

export function setSSOCookie(response: NextResponse, token: string): void {
  response.cookies.set(SSO_COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30, // 30 days (matches next-auth default)
  });
}

export function getSSOToken(request: NextRequest): string | undefined {
  return request.cookies.get(SSO_COOKIE_NAME)?.value;
}

export function clearSSOCookie(response: NextResponse): void {
  response.cookies.set(SSO_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

// Next-auth cookie names mirror the `cookies` block in auth.ts. Clearing
// requires the same Domain + Path attributes the cookie was set with,
// otherwise browsers leave the original (subdomain-scoped) cookie in place.
const NEXT_AUTH_COOKIE_NAMES = isProd
  ? [
      '__Secure-next-auth.session-token',
      '__Secure-next-auth.csrf-token',
      '__Secure-next-auth.callback-url',
    ]
  : ['next-auth.session-token', 'next-auth.csrf-token', 'next-auth.callback-url'];

export function clearNextAuthCookies(response: NextResponse): void {
  for (const name of NEXT_AUTH_COOKIE_NAMES) {
    response.cookies.set(name, '', {
      path: '/',
      secure: isProd,
      sameSite: 'lax',
      maxAge: 0,
      ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
    });
  }
}

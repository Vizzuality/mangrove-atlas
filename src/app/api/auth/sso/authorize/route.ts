import { NextRequest, NextResponse } from 'next/server';

import { generateSSOCode } from '@/lib/auth/sso-code';
import { isAllowedRedirectUri } from '@/lib/auth/sso-config';
import { clearSSOCookie, getSSOToken } from '@/lib/auth/sso-cookie';

/**
 * SSO Authorize endpoint.
 *
 * MRTT redirects here when it has no local session.
 * If a valid SSO cookie exists, generates a short-lived authorization code
 * and redirects back to MRTT with the code.
 *
 * GET /api/auth/sso/authorize?redirect_uri=https://mrtt.globalmangrovewatch.org/auth/sso/callback
 */
export async function GET(request: NextRequest) {
  const redirectUri = request.nextUrl.searchParams.get('redirect_uri');

  if (!redirectUri || !isAllowedRedirectUri(redirectUri)) {
    return NextResponse.json({ error: 'Invalid redirect_uri' }, { status: 400 });
  }

  const token = getSSOToken(request);

  if (!token) {
    // No SSO session — redirect to GMW login, then back here after login
    const loginUrl = new URL('/auth/signin', request.nextUrl.origin);
    const returnUrl = new URL(request.url);
    loginUrl.searchParams.set('callbackUrl', returnUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Validate token with backend
  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    // Token expired/invalid — clear cookie, redirect to login
    const response = NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`, request.nextUrl.origin)
    );
    clearSSOCookie(response);
    return response;
  }

  // Generate short-lived authorization code
  const code = await generateSSOCode(token);

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('code', code);

  return NextResponse.redirect(callbackUrl);
}

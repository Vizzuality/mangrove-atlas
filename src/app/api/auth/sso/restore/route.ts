import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/auth';
import { clearSSOCookie, getSSOToken } from '@/lib/auth/sso-cookie';

import { encode } from 'next-auth/jwt';

/**
 * SSO Session Restore endpoint.
 *
 * Called by the SessionSync client component when no next-auth session exists
 * but an SSO cookie might. Validates the token, creates a next-auth JWT,
 * and sets the session cookie — all server-side, httpOnly throughout.
 *
 * GET /api/auth/sso/restore
 */
export async function GET(request: NextRequest) {
  const token = getSSOToken(request);

  if (!token) {
    return NextResponse.json({ ok: false });
  }

  // Validate token with backend
  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    const response = NextResponse.json({ ok: false });
    clearSSOCookie(response);
    return response;
  }

  const user = await userRes.json();

  // Build next-auth JWT payload (same shape as authOptions callbacks produce)
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const nextAuthJwt = await encode({
    secret,
    token: {
      userId: user.email,
      accessToken: token,
      name: user.name || user.username,
      email: user.email,
      organization: user.organization || null,
    },
    maxAge: 30 * 24 * 60 * 60, // 30 days (next-auth default)
  });

  // Determine session cookie config from authOptions
  const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  const sessionCookieName =
    authOptions.cookies?.sessionToken?.name ??
    (isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token');
  const sessionCookieOptions = authOptions.cookies?.sessionToken?.options ?? {};

  const response = NextResponse.json({
    ok: true,
    user: { name: user.name || user.username, email: user.email },
  });

  response.cookies.set(sessionCookieName, nextAuthJwt, {
    httpOnly: sessionCookieOptions.httpOnly ?? true,
    secure: sessionCookieOptions.secure ?? isProd,
    sameSite: (sessionCookieOptions.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
    path: sessionCookieOptions.path ?? '/',
    ...(sessionCookieOptions.domain ? { domain: sessionCookieOptions.domain } : {}),
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}

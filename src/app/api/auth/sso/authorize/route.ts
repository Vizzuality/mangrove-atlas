import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/auth';
import { generateSSOCode } from '@/lib/auth/sso-code';
import { isAllowedRedirectUri } from '@/lib/auth/sso-config';
import { clearSSOCookie, getSSOToken, setSSOCookie } from '@/lib/auth/sso-cookie';

import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  const redirectUri = request.nextUrl.searchParams.get('redirect_uri');

  if (!redirectUri || !isAllowedRedirectUri(redirectUri)) {
    return NextResponse.json({ error: 'Invalid redirect_uri' }, { status: 400 });
  }

  let token = getSSOToken(request);
  let shouldPersistCookie = false;

  // Fallback: an active next-auth session without gmw-sso-token still proves
  // the user is logged in on GMW. Adopt its accessToken and persist the cookie
  // so subsequent silent SSO checks have it.
  if (!token) {
    const session = await getServerSession(authOptions);
    if (session?.user?.accessToken) {
      token = session.user.accessToken;
      shouldPersistCookie = true;
    }
  }

  if (!token) {
    const loginUrl = new URL('/auth/signin', request.nextUrl.origin);
    const returnUrl = new URL(request.url);
    loginUrl.searchParams.set('callbackUrl', returnUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    const response = NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodeURIComponent(request.url)}`, request.nextUrl.origin)
    );
    clearSSOCookie(response);
    return response;
  }

  const code = await generateSSOCode(token);

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('code', code);

  const response = NextResponse.redirect(callbackUrl);
  if (shouldPersistCookie) setSSOCookie(response, token);
  return response;
}

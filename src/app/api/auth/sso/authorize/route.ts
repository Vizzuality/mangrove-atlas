import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth/auth';
import { generateSSOCode } from '@/lib/auth/sso-code';
import { isAllowedRedirectUri } from '@/lib/auth/sso-config';
import { clearSSOCookie, getSSOToken, setSSOCookie } from '@/lib/auth/sso-cookie';

import { getServerSession } from 'next-auth';

// Heroku's router proxies to a dyno listening on an ephemeral $PORT and
// rewrites the inbound Host header, so request.nextUrl.origin resolves to
// something like https://localhost:41669 inside the route handler. Redirects
// built from that origin send the browser to an unreachable address. Use the
// configured public origin (NEXTAUTH_URL) and fall back to X-Forwarded-Host /
// request origin only when it's missing.
function getPublicOrigin(request: NextRequest): string {
  if (process.env.NEXTAUTH_URL) return new URL(process.env.NEXTAUTH_URL).origin;

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

  return request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const redirectUri = request.nextUrl.searchParams.get('redirect_uri');

  if (!redirectUri || !isAllowedRedirectUri(redirectUri)) {
    return NextResponse.json({ error: 'Invalid redirect_uri' }, { status: 400 });
  }

  const publicOrigin = getPublicOrigin(request);
  const publicRequestUrl = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    publicOrigin
  ).toString();

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
    const loginUrl = new URL('/auth/signin', publicOrigin);
    loginUrl.searchParams.set('callbackUrl', publicRequestUrl);
    return NextResponse.redirect(loginUrl);
  }

  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    const response = NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodeURIComponent(publicRequestUrl)}`, publicOrigin)
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

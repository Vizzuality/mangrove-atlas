import { NextRequest, NextResponse } from 'next/server';

import { setSSOCookie } from '@/lib/auth/sso-cookie';

import { getToken } from 'next-auth/jwt';

/**
 * Sets the shared httpOnly SSO cookie from the current next-auth session.
 *
 * Called by the login form after a successful signIn('credentials').
 * Reads the next-auth JWT (httpOnly) server-side, extracts the backend token,
 * and sets the SSO cookie. Token never touches client JS.
 *
 * POST /api/auth/sso/set-from-session
 */
export async function POST(request: NextRequest) {
  const jwt = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!jwt?.accessToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSSOCookie(response, jwt.accessToken as string);
  return response;
}

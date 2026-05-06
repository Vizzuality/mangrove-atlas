import { NextRequest, NextResponse } from 'next/server';

import { clearSSOCookie } from '@/lib/auth/sso-cookie';

import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const accessToken = (token as any)?.accessToken;

    if (accessToken) {
      await fetch(`${process.env.AUTH_API_URL}/users/sign_out`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => {});
    }

    const response = NextResponse.json({ ok: true });
    clearSSOCookie(response);
    return response;
  } catch {
    const response = NextResponse.json({ ok: true });
    clearSSOCookie(response);
    return response;
  }
}

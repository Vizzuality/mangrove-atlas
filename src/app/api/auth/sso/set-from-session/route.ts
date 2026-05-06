import { NextRequest, NextResponse } from 'next/server';

import { setSSOCookie } from '@/lib/auth/sso-cookie';

import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const jwt = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!jwt?.accessToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setSSOCookie(response, jwt.accessToken as string);
  return response;
}

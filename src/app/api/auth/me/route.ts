import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

export function GET(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true });
}

// Update the current user. Proxies to the auth service server-side so the browser
// never makes a cross-origin call and the bearer token stays off the client.
export async function PATCH(request: NextRequest) {
  const jwt = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = (jwt as any)?.accessToken;

  if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const upstream = await fetch(`${process.env.AUTH_API_URL}/users`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {}

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: data?.error || data?.message || 'Update failed',
        errors: data?.errors,
        details: data ?? text,
      },
      { status: upstream.status }
    );
  }

  return NextResponse.json({ ok: true, data });
}

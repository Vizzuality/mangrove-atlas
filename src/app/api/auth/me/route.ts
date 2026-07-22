import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

// Fetch the canonical current user from the auth service and normalize the
// wrapper (the API sometimes nests the record under `user`). Returns null on a
// non-2xx or unparseable response so callers can decide how to handle it.
async function fetchCurrentUser(accessToken: string) {
  const res = await fetch(`${process.env.AUTH_API_URL}/users/current_user`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) return null;

  try {
    const payload = await res.json();
    return payload?.user ?? payload;
  } catch {
    return null;
  }
}

// Read the current user. Proxies to the auth service server-side so the bearer
// token stays off the client and the session can be re-hydrated from BE truth.
export async function GET(request: NextRequest) {
  const jwt = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = (jwt as any)?.accessToken;

  if (!accessToken) return NextResponse.json({ ok: false }, { status: 401 });

  const data = await fetchCurrentUser(accessToken);

  if (!data) return NextResponse.json({ ok: false }, { status: 502 });

  return NextResponse.json({ ok: true, data });
}

// Update the current user. Proxies to the auth service server-side so the browser
// never makes a cross-origin call and the bearer token stays off the client.
export async function PATCH(request: NextRequest) {
  const jwt = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const accessToken = (jwt as any)?.accessToken;

  if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const upstream = await fetch(`${process.env.AUTH_API_URL}/users/current_user`, {
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

  // Return the canonical persisted user so the client session is driven by BE
  // truth, not the submitted form. Normalize the wrapper, and if the PATCH
  // response doesn't echo the full record, read it back from current_user.
  let user = data?.user ?? data;
  if (!user || user.email === undefined || user.user_roles === undefined) {
    user = (await fetchCurrentUser(accessToken)) ?? user;
  }

  return NextResponse.json({ ok: true, data: user });
}

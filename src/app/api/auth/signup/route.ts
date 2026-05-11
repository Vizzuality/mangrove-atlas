import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { user } = body ?? {};
  const { email, password, ...rest } = user ?? {};

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email/password' }, { status: 400 });
  }

  const upstream = await fetch(`${process.env.AUTH_API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      user: { email, password, ...rest },
    }),
  });

  const text = await upstream.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {}

  if (!upstream.ok) {
    return NextResponse.json(
      { error: data?.error || data?.message || 'Signup failed', details: data ?? text },
      { status: upstream.status }
    );
  }

  return NextResponse.json({ ok: true, data });
}

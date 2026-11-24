import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
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
      {
        error: data?.error || data?.message || 'Signup failed',
        // Devise field errors, e.g. { email: ['has already been taken'] }.
        errors: data?.errors,
        details: data ?? text,
      },
      { status: upstream.status }
    );
  }

  return NextResponse.json({ ok: true, data });
}

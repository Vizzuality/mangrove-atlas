import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email/password' }, { status: 400 });
    }

    const upstreamRes = await fetch(`${process.env.AUTH_API_URL}/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ user: { email, password } }),
      redirect: 'manual',
    });

    const text = await upstreamRes.text();
    return new NextResponse(text, { status: upstreamRes.status });
  } catch (err: any) {
    console.error('[/api/auth/login] crashed:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}

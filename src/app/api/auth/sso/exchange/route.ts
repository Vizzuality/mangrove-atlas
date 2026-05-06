import { NextRequest, NextResponse } from 'next/server';

import { verifySSOCode } from '@/lib/auth/sso-code';
import { getSSOCorsHeaders } from '@/lib/auth/sso-config';

export async function POST(request: NextRequest) {
  const corsHeaders = getSSOCorsHeaders();

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!body.code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400, headers: corsHeaders });
  }

  const token = await verifySSOCode(body.code);

  if (!token) {
    return NextResponse.json(
      { error: 'Invalid or expired code' },
      { status: 401, headers: corsHeaders }
    );
  }

  // Validate token with backend and get user info
  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    return NextResponse.json(
      { error: 'Token no longer valid' },
      { status: 401, headers: corsHeaders }
    );
  }

  const user = await userRes.json();

  return NextResponse.json(
    {
      token,
      user: {
        name: user.name || user.username,
        email: user.email,
        organization: user.organization,
      },
    },
    { headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getSSOCorsHeaders() });
}

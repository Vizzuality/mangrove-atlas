import { NextRequest, NextResponse } from 'next/server';

import { getSSOCorsHeaders, isAllowedRedirectUri } from '@/lib/auth/sso-config';
import { setSSOCookie } from '@/lib/auth/sso-cookie';

export async function POST(request: NextRequest) {
  const corsHeaders = getSSOCorsHeaders();

  let body: { token?: string; redirect_uri?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!body.token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400, headers: corsHeaders });
  }

  // Validate token with backend before trusting it
  const userRes = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${body.token}` },
  });

  if (!userRes.ok) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers: corsHeaders });
  }

  // If redirect_uri provided, redirect back; otherwise return JSON
  if (body.redirect_uri && isAllowedRedirectUri(body.redirect_uri)) {
    const response = NextResponse.redirect(body.redirect_uri);
    setSSOCookie(response, body.token);
    return response;
  }

  const response = NextResponse.json({ ok: true }, { headers: corsHeaders });
  setSSOCookie(response, body.token);
  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getSSOCorsHeaders() });
}

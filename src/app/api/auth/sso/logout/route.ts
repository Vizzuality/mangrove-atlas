import { NextRequest, NextResponse } from 'next/server';

import { getSSOCorsHeaders, isAllowedRedirectUri } from '@/lib/auth/sso-config';
import { clearSSOCookie, getSSOToken } from '@/lib/auth/sso-cookie';

export async function POST(request: NextRequest) {
  const corsHeaders = getSSOCorsHeaders();

  // Invalidate token with backend if present
  const token = getSSOToken(request);
  if (token) {
    await fetch(`${process.env.AUTH_API_URL}/users/sign_out`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).catch(() => {});
  }

  let redirectUri: string | undefined;
  try {
    const body = await request.json();
    redirectUri = body.redirect_uri;
  } catch {
    // No body or invalid JSON — fine, just clear cookie
  }

  if (redirectUri && isAllowedRedirectUri(redirectUri)) {
    const response = NextResponse.redirect(redirectUri);
    clearSSOCookie(response);
    return response;
  }

  const response = NextResponse.json({ ok: true }, { headers: corsHeaders });
  clearSSOCookie(response);
  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getSSOCorsHeaders() });
}

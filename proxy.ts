import { NextRequest, NextResponse } from 'next/server';

import { isAllowedOrigin } from '@/lib/auth/sso-config';

const HIDDEN_IN_PROD = ['/auth'];

const corsBaseHeaders: Record<string, string> = {
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  Vary: 'Origin',
};

function withCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  if (isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    for (const [k, v] of Object.entries(corsBaseHeaders)) response.headers.set(k, v);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    if (HIDDEN_IN_PROD.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (request.method === 'OPTIONS') {
    return withCors(request, new NextResponse(null, { status: 204 }));
  }

  return withCors(request, NextResponse.next());
}

export const config = {
  matcher: ['/api/:path*'],
};

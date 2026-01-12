import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = new Set([
  'https://mrtt.globalmangrovewatch.org',
  'https://mrtt-staging.globalmangrovewatch.org',
  'http://localhost:3000',
]);

const corsBaseHeaders: Record<string, string> = {
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  Vary: 'Origin',
};

function withCors(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins.has(origin.replace(/\/$/, ''))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    for (const [k, v] of Object.entries(corsBaseHeaders)) response.headers.set(k, v);
  }
  return response;
}

export function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return withCors(request, new NextResponse(null, { status: 204 }));
  }

  return withCors(request, NextResponse.next());
}

export const config = {
  matcher: ['/api/(?!auth).*'],
};

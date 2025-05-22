import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'https://mrtt.globalmangrovewatch.org',
  'https://mrtt-staging.globalmangrovewatch.org',
];

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin && allowedOrigins.includes(origin.replace(/\/$/, ''));

  const isPreflight = request.method === 'OPTIONS';

  // Create a response object before modifying headers
  const response = isPreflight ? new NextResponse(null, { status: 204 }) : NextResponse.next();

  // Set CORS headers if origin is allowed
  if (isAllowedOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Always set standard CORS headers (especially for preflight)
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};

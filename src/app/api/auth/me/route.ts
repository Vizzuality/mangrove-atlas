import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true });
}

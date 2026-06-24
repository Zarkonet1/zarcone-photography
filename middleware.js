import { NextResponse } from 'next/server';

/**
 * Strip malformed Range headers (missing unit) before they reach static serving.
 * A valid Range header looks like: bytes=0-1023
 * Without a unit (e.g. "=0-1023"), Vercel returns HTTP 416 RANGE_MISSING_UNIT.
 */
export function middleware(request) {
  const range = request.headers.get('range');

  // If Range header exists but doesn't start with a recognized unit, strip it
  if (range && !/^[a-zA-Z]+=/.test(range)) {
    const headers = new Headers(request.headers);
    headers.delete('range');
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

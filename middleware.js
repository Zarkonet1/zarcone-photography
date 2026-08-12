import { NextResponse } from 'next/server';

/**
 * Legacy inbound links and old external listings sometimes point to mixed-case
 * paths (e.g. /Blog/Some-Post, /Contact-Us, /Sports-Photos/Event). Every route
 * in this app is lowercase, so normalize any mixed-case path to lowercase with
 * a permanent redirect. This prevents 404s on old links/bookmarks and stops
 * search engines from treating /Foo and /foo as separate, unindexed URLs.
 */
function lowercaseRedirect(request) {
  const { pathname } = request.nextUrl;

  // Skip static assets (any path ending in a file extension — /photos/Foo.jpg,
  // /files/*.pdf, etc). Page routes in this app are lowercase by convention,
  // but filenames under public/ are NOT — most of public/photos/ uses mixed
  // case. Case-folding an asset URL 404s it, since the file on disk keeps its
  // original case. Only page routes should be normalized here.
  // Fixed 2026-07-20: this bug (introduced with the redirect itself on
  // 2026-07-18) broke image loading sitewide — every mixed-case filename in
  // public/photos/ (290 of 314 files) was being redirected to a lowercase
  // URL that doesn't exist.
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return null;

  const lower = pathname.toLowerCase();
  if (pathname !== lower) {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }
  return null;
}

/**
 * Catch-all for the old SmugMug-hosted site's gallery/image URLs.
 *
 * Before the Next.js redesign, zarconephotography.com ran on SmugMug's custom-
 * domain hosting, which generates URLs like /some-gallery-title/n-XXXXXXX
 * (gallery node) and /some-gallery-title/i-XXXXXXX (individual image), often
 * nested (/category/event-slug/n-XXXXXXX). Google indexed a large, unknown
 * number of these over the years SmugMug was live. That index is the actual
 * "root distribution channel" behind the recurring 404-sweep pattern in GA4
 * (see project_ga4_404_redirects memory) — searchers click a stale Google
 * result, land on an old gallery path, and it 404s. Individually enumerating
 * each specific gallery slug in next.config.mjs redirects() as GA4 surfaces
 * it one at a time doesn't scale against an index we don't control.
 *
 * Instead of enumerating slugs, catch the URL *pattern* SmugMug always uses:
 * a path segment that is exactly "n-" or "i-" followed by 5-12 alphanumeric
 * characters. No real route on this site uses that shape, so this is safe to
 * catch broadly and send to /client-area (the same destination every
 * already-enumerated legacy gallery redirect uses).
 */
const SMUGMUG_ID_SEGMENT = /(^|\/)(n|i)-[a-z0-9]{5,12}(\/|$)/i;

function legacySmugmugRedirect(request) {
  const { pathname } = request.nextUrl;
  if (!SMUGMUG_ID_SEGMENT.test(pathname)) return null;

  const url = request.nextUrl.clone();
  url.pathname = '/client-area';
  url.search = '';
  return NextResponse.redirect(url, 308);
}

/**
 * Strip malformed Range headers (missing unit) before they reach static serving.
 * A valid Range header looks like: bytes=0-1023
 * Without a unit (e.g. "=0-1023"), Vercel returns HTTP 416 RANGE_MISSING_UNIT.
 */
export function middleware(request) {
  const caseRedirect = lowercaseRedirect(request);
  if (caseRedirect) return caseRedirect;

  const smugmugRedirect = legacySmugmugRedirect(request);
  if (smugmugRedirect) return smugmugRedirect;

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

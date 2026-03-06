import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const host = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname || '/';

  // Root path: always send to default locale /ar (and fix host if needed)
  if (pathname === '/' || pathname === '') {
    const base = host === 'aqaargate.com'
      ? 'https://www.aqaargate.com'
      : `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    return NextResponse.redirect(new URL('/ar', base), 308);
  }

  // Redirect aqaargate.com (no www) to www for any other path
  if (host === 'aqaargate.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.aqaargate.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all routes except: api, _next, _vercel, static files
  // Include '/' explicitly so root is redirected to /ar (matcher regex often skips root)
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const host = request.nextUrl.hostname;
  // Redirect aqaargate.com (no www) to www.aqaargate.com so root link opens correctly
  if (host === 'aqaargate.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.aqaargate.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }
  return intlMiddleware(request);
}

export const config = {
  // Match all routes except:
  // - API routes
  // - _next (Next.js internals)
  // - Static files (images, fonts, etc.)
  // - Files with extensions
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

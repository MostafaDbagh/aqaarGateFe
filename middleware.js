import { NextResponse } from 'next/server';

/**
 * Security Middleware
 * Adds security headers and CSRF protection
 */
export function middleware(request) {
  const response = NextResponse.next();
  
  // Security Headers (additional layer)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSRF Protection for POST/PUT/DELETE requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    
    // Check if request is from same origin
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse('CSRF validation failed', { status: 403 });
      }
    } else if (referer) {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) {
        return new NextResponse('CSRF validation failed', { status: 403 });
      }
    }
  }
  
  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
};


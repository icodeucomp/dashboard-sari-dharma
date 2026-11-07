import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Redirects unauthenticated users away from dashboard routes.
 * @param request - The incoming Next.js request
 * @returns A redirect to /login, or the request passed through
 */
export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && (!authToken || authToken.value === '')) {
    const loginUrl = new URL('/login', request.url);
    // Remember the requested page so the login can send the user back
    loginUrl.searchParams.set('from', request.nextUrl.pathname);

    const response = NextResponse.redirect(loginUrl);

    // Clear an empty or invalid cookie so it does not linger
    response.cookies.delete('auth_token');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Only run on dashboard routes
  matcher: '/dashboard/:path*',
};

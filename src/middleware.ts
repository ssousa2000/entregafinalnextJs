import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/login' || 
    path === '/auth/register' ||
    path === '/' ||
    path.startsWith('/products') ||
    path === '/cart' ||
    path.startsWith('/api/');
  
  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value;
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true';
  
  // Redirect logic
  if (path.startsWith('/admin')) {
    if (!token) {
      // Redirect to login if trying to access admin without token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    if (!isAdmin) {
      // Redirect to home if not an admin
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // If the path requires authentication and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

// Configure matcher for paths that will trigger the middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
  ],
}; 
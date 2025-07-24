import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  
  console.log('🔍 Middleware - Path:', pathname, 'Token:', !!token);
  
  // Protected routes that require admin authentication
  const protectedRoutes = [
    '/dashboard',
    '/products',
    '/orders',
    '/customers',
    '/inventory',
    '/analytics',
    '/reviews',
    '/settings',
  ];
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/404',
    '/500',
    '/_next',
    '/favicon.ico',
    '/api',
  ];
  
  // Allow all static assets and API routes
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname === '/favicon.ico' ||
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // FIXED: Prevent redirect loops
  if (pathname === '/login') {
    // If user has token and is on login page, redirect to dashboard
    if (token) {
      console.log('🔄 Redirecting authenticated user from login to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If no token, allow access to login page
    console.log('✅ Allowing access to login page');
    return NextResponse.next();
  }
  
  // Handle root path
  if (pathname === '/') {
    if (token) {
      console.log('🔄 Redirecting authenticated user from root to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      console.log('🔄 Redirecting unauthenticated user from root to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    console.log('🔒 Redirecting to login for protected route:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Allow public routes
  if (isPublicRoute) {
    console.log('✅ Allowing access to public route:', pathname);
    return NextResponse.next();
  }
  
  // Default: allow the request
  console.log('✅ Allowing request to:', pathname);
  return NextResponse.next();
}

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
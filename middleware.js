import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  
  console.log('🔍 Middleware - Path:', pathname, 'Token:', !!token);
  
  // Protected routes that require admin authentication
  const protectedRoutes = [
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
    '/admin/customers',
    '/admin/inventory',
    '/admin/analytics',
    '/admin/reviews',
    '/admin/settings',
  ];
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/admin/access',
    '/login', // Keep as fallback
    '/404',
    '/500',
  ];
  
  // Always allow static assets and API routes
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
  
  // Handle admin access page (login) - PREVENT LOOPS
  if (pathname === '/admin/access') {
    if (token) {
      console.log('🔄 User has token, redirecting from access to dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // User doesn't have token, allow access to login page
    console.log('✅ Allowing access to admin/access page');
    return NextResponse.next();
  }
  
  // Handle root path
  if (pathname === '/') {
    if (token) {
      console.log('🔄 Redirecting authenticated user from root to dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      console.log('🔄 Redirecting unauthenticated user from root to admin/access');
      return NextResponse.redirect(new URL('/admin/access', request.url));
    }
  }
  
  // Handle old /login route - redirect to new admin/access
  if (pathname === '/login') {
    console.log('🔄 Redirecting from old /login to /admin/access');
    return NextResponse.redirect(new URL('/admin/access', request.url));
  }
  
  // Handle /admin root - redirect based on auth status
  if (pathname === '/admin') {
    if (token) {
      console.log('🔄 Redirecting from /admin to /admin/dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      console.log('🔄 Redirecting from /admin to /admin/access');
      return NextResponse.redirect(new URL('/admin/access', request.url));
    }
  }
  
  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      console.log('🔒 No token, redirecting to admin/access from:', pathname);
      const accessUrl = new URL('/admin/access', request.url);
      accessUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(accessUrl);
    }
    console.log('✅ Token found, allowing access to protected route:', pathname);
    return NextResponse.next();
  }
  
  // Handle public routes
  if (isPublicRoute) {
    console.log('✅ Allowing access to public route:', pathname);
    return NextResponse.next();
  }
  
  // Default: allow the request for any other paths
  console.log('✅ Default allowing request to:', pathname);
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
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
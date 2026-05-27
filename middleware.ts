import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin only routes
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    // Dashboard: admin + chief_assessor + assessor
    if (path.startsWith('/dashboard') && !['admin', 'chief_assessor', 'assessor'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/403', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Public routes
        if (req.nextUrl.pathname === '/login') return true;
        if (req.nextUrl.pathname === '/') return true;
        if (req.nextUrl.pathname.startsWith('/api/auth')) return true;
        
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

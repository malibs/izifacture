import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') ||
                     pathname.startsWith('/signup');
  const isAppPage = pathname.startsWith('/dashboard');

  if (!session && isAppPage) {
    // Not authenticated and trying to access an app route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthPage) {
    // Authenticated and trying to access login/signup
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (session && pathname === '/') {
    // Authenticated and visiting the landing page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

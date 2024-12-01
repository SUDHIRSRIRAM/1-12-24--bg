import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of authorized admin emails
const ADMIN_EMAILS = ['sriramsudhir11@gmail.com'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { pathname } = req.nextUrl;

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Check if email is authorized
    if (!ADMIN_EMAILS.includes(session.user.email || '')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Check role in database
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!roleData || roleData.role !== 'ADMIN') {
      // Create admin role if it doesn't exist
      const { error: upsertError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: session.user.id,
          email: session.user.email,
          role: 'ADMIN',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};
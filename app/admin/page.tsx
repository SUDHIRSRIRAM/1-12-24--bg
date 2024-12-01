import { headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { checkAdminStatus } from '@/lib/auth/admin';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies: () => headers().get('cookie') });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const isAdmin = await checkAdminStatus(session.user.id);
  if (!isAdmin) {
    redirect('/');
  }

  return <AdminDashboard />;
}
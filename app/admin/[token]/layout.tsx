import { headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const supabase = createServerComponentClient({ cookies: () => headers().get('cookie') });

  if (params.token !== ADMIN_TOKEN) {
    redirect('/');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
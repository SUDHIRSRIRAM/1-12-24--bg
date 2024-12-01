import { redirect } from 'next/navigation';
import { validateAdminToken } from '@/lib/utils/token';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage({ params }: { params: { token: string } }) {
  if (!validateAdminToken(params.token)) {
    redirect('/');
  }

  return <AdminDashboard />;
}
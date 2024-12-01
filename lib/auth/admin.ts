import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

// List of authorized admin emails
const ADMIN_EMAILS = ['sriramsudhir11@gmail.com'];

export async function checkAdminStatus(userId: string) {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser(userId);
    
    if (!user) return false;
    
    // First check if email is in authorized list
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return false;
    }

    // Then check database role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no role exists, create admin role for authorized email
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            email: user.email,
            role: 'ADMIN',
            is_active: true
          });
        
        return !insertError;
      }
      throw error;
    }

    return data?.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function loginAsAdmin(email: string, password: string) {
  const supabase = createClient();

  try {
    // First check if email is authorized
    if (!ADMIN_EMAILS.includes(email)) {
      throw new Error('Unauthorized: Only admin emails are allowed');
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;
    if (!data.user) throw new Error('No user returned after login');

    // Ensure user has admin role in database
    const { error: upsertError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: data.user.id,
        email: data.user.email,
        role: 'ADMIN',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (upsertError) throw upsertError;

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Admin login error:', error);
    toast.error(error.message || 'Failed to login');
    return { success: false, error };
  }
}

export async function getCurrentAdmin() {
  const supabase = createClient();

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    // Check if email is authorized
    if (!ADMIN_EMAILS.includes(session.user.email || '')) {
      return null;
    }

    const isAdmin = await checkAdminStatus(session.user.id);
    return isAdmin ? session.user : null;
  } catch (error) {
    console.error('Error getting current admin:', error);
    return null;
  }
}
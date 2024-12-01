export interface UserRole {
  id: string;
  user_id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export type UserRoleType = 'ADMIN' | 'USER' | 'MODERATOR';

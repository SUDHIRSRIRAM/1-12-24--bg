-- Create user_roles table if it doesn't exist
create table if not exists public.user_roles (
  user_id uuid primary key,
  email text not null,
  role text not null check (role in ('ADMIN', 'USER')) default 'USER',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Create policies
create policy "Users can view their own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  using (
    auth.uid() in (
      select user_id from public.user_roles where role = 'ADMIN'
    )
  );

create policy "Admins can update roles"
  on public.user_roles for update
  using (
    auth.uid() in (
      select user_id from public.user_roles where role = 'ADMIN'
    )
  );
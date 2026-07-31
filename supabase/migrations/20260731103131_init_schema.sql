-- profiles: 1:1 companion to auth.users, holds authorization data
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text not null default 'user' check (user_type in ('user','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select
  using (auth.uid() = id);

-- trigger: auto-create a profile row on signup, always as 'user' —
-- ignores any client-submitted metadata, closing the admin self-signup bug structurally
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_type) values (new.id, 'user');
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- safe (security invoker) helper for RLS policies elsewhere
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type = 'admin'
  );
$$;

-- products
create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric(10,2) not null,
  category text not null,
  sub_category text,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  frontimg text,
  backimg text,
  description text,
  material text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "products_select_all" on public.products
  for select
  using (true);

create policy "products_insert_admin" on public.products
  for insert
  with check (public.is_admin());

create policy "products_update_admin" on public.products
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_delete_admin" on public.products
  for delete
  using (public.is_admin());

-- orders
create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  shipping jsonb,
  billing jsonb,
  currency text not null default 'KES',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_insert_self_or_guest" on public.orders
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "orders_select_own_or_admin" on public.orders
  for select
  using (auth.uid() = user_id or public.is_admin());

-- lock down the pre-existing rls_auto_enable event-trigger function's grants
-- (active safety-net trigger that auto-enables RLS on new tables; keep the
-- trigger, just remove its unnecessary anon/authenticated EXECUTE grants)
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- index the orders FK for join/filter performance
create index if not exists orders_user_id_idx on public.orders (user_id);

-- wrap auth.uid() as (select auth.uid()) so Postgres caches it as an
-- InitPlan instead of re-evaluating per row (standard Supabase RLS perf pattern)
drop policy "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select
  using ((select auth.uid()) = id);

drop policy "orders_insert_self_or_guest" on public.orders;
create policy "orders_insert_self_or_guest" on public.orders
  for insert
  with check ((select auth.uid()) = user_id or user_id is null);

drop policy "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin" on public.orders
  for select
  using ((select auth.uid()) = user_id or public.is_admin());

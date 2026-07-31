-- pin search_path so is_admin() can't be hijacked via a mutable search_path
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type = 'admin'
  );
$$;

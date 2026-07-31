-- public bucket for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- admin-only writes (matches today's adminOnly-gated /upload route)
create policy "products_bucket_insert_admin"
on storage.objects for insert
with check (bucket_id = 'products' and public.is_admin());

-- admin-only deletes (forward-looking parity, no behavior change today)
create policy "products_bucket_delete_admin"
on storage.objects for delete
using (bucket_id = 'products' and public.is_admin());

-- Note: no public SELECT policy on storage.objects — the bucket's own
-- public=true flag already serves individual objects by known path via
-- getPublicUrl(), with no RLS check needed. Adding a broad SELECT policy
-- here would additionally allow *listing* the whole bucket, which we
-- don't want (see security_hardening migration, which removes the one
-- originally added here after the advisor flagged it).

-- Redesign additions: WhatsApp-first storefront support.
-- Adds product merchandising flags + slugs, and order channel/ref tracking.
-- Builds on 20260731103131_init_schema.sql, 20260731103207_storage_setup.sql,
-- 20260731103317_security_hardening.sql, 20260731103732_performance_hardening.sql.

-- products: new merchandising columns for the redesigned Home/Shop pages
alter table public.products
  add column slug text unique,
  add column is_new boolean not null default false,
  add column is_signature boolean not null default false,
  add column stock jsonb not null default '{}'::jsonb;

-- backfill slugs for already-seeded rows (name -> kebab-case, suffixed with
-- the row id to guarantee uniqueness without manual review; admins can
-- edit individual slugs later via the admin panel for a cleaner look)
update public.products
set slug = lower(
      regexp_replace(
        regexp_replace(trim(name), '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      )
    ) || '-' || id::text
where slug is null;

alter table public.products alter column slug set not null;

-- orders: channel + a human-friendly reference generated client-side at
-- order time, shown on both the /order/sent page and the WhatsApp message,
-- so support staff can cross-reference a WhatsApp chat back to this row.
alter table public.orders
  add column channel text not null default 'whatsapp',
  add column ref text;

-- Change the default going forward: every order the redesigned site creates
-- goes straight to WhatsApp, so 'whatsapp_sent' (not 'pending') is the right
-- default from here on. Existing rows' status is left untouched, and no
-- CHECK constraint is added (there wasn't one before): 'pending' remains a
-- legal value an admin can still set by hand for an order that was logged
-- but never actually sent.
alter table public.orders alter column status set default 'whatsapp_sent';

-- No new RLS policy or table grant for anonymous order inserts added here:
-- the existing `orders_insert_self_or_guest` policy (init_schema.sql,
-- tightened in performance_hardening.sql) has no `to` clause, so as written
-- it already applies to every role including `anon`, and no prior migration
-- revokes anon's default per-project INSERT grant on this table.
-- VERIFY LIVE before relying on this: run a real anon-key insert of
-- {items: [], shipping: {}, billing: {}, currency: 'KES', channel: 'whatsapp',
-- ref: 'test-verify', user_id: null} from a logged-out browser console, then
-- delete the test row. If it 401/403s, the fix is
-- `grant insert on public.orders to anon;` (a missing table grant, not a
-- missing policy) — re-test after that, don't add a redundant RLS policy.

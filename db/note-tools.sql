-- Run once in the Supabase SQL Editor before deploying.
begin;
alter table public.notes
 add column if not exists subject text not null default '',
 add column if not exists pinned boolean not null default false,
 add column if not exists deleted_at timestamptz,
 add column if not exists follow_up date;
create index if not exists notes_workspace_order on public.notes (user_id, pinned desc, created_at desc) where deleted_at is null;
create index if not exists notes_follow_up on public.notes (user_id, follow_up) where deleted_at is null;
-- Existing owner-only RLS policies protect the new columns too.
commit;

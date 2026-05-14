-- =============================================================================
-- Flytimes — Supabase schema for the `submissions` table
-- =============================================================================
-- This file matches the shape used by:
--   - lib/submissions.ts (Submission type)
--   - app/api/submissions/route.ts          (GET list, POST create)
--   - app/api/submissions/[ref]/route.ts    (PATCH update, DELETE)
--
-- How to apply:
--   1. Open your Supabase project  →  SQL editor
--   2. Paste the contents of this file and run.
--   3. Set the env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
--      in `.env.local` (see README).
-- =============================================================================

create table if not exists public.submissions (
    ref          text primary key,
    created_at   timestamptz not null default now(),
    status       text not null default 'new'
                   check (status in ('new', 'contacted', 'confirmed', 'cancelled')),

    -- Trip details
    dest         text not null default '',
    dest_id      text not null default '',
    trip         text,
    hotel        text,
    addons       text[] not null default '{}',
    duration     text,
    date         text not null default '',
    adults       text not null default '',
    children     text not null default '',

    -- Contact
    name         text not null default '',
    phone        text not null default '',
    email        text not null default '',
    channel      text,
    city         text not null default '',

    -- Free-form fields
    notes        text not null default '',
    estimate     text not null default '',
    service      text not null default 'inquiry',

    -- Admin-only internal note
    admin_notes  text
);

-- =============================================================================
-- Indexes — `created_at` and `status` are the columns used most by the admin UI
-- (sorting and filtering). Add more if you start filtering by destination etc.
-- =============================================================================
create index if not exists submissions_created_at_idx
    on public.submissions (created_at desc);

create index if not exists submissions_status_idx
    on public.submissions (status);

create index if not exists submissions_dest_id_idx
    on public.submissions (dest_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- The Next.js API routes use the anon key from a server context. We ENABLE RLS
-- to be safe, then add a permissive policy for the anon role so the admin API
-- can read/write. For production you should restrict this further (see README
-- on protecting the admin endpoints with the ADMIN_PASSWORD middleware).
-- =============================================================================
alter table public.submissions enable row level security;

drop policy if exists "anon full access" on public.submissions;
create policy "anon full access"
    on public.submissions
    for all
    using (true)
    with check (true);

# Flytimes

Arabic RTL travel agency site (Next.js 14 + TypeScript + Tailwind + Framer Motion).

## Stack

- Next.js 14 (App Router) / React 18
- TypeScript (strict)
- Tailwind CSS
- Framer Motion
- Supabase (Postgres) for submissions storage — falls back to `localStorage` when not configured

## Getting started

```bash
npm install
npm run dev
```

The dev server starts on http://localhost:3000.

## Environment variables

Copy `.env.local` and fill in the placeholders:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | for production | Supabase project URL. Without it the app uses `localStorage` (dev/demo mode). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for production | Supabase anon key, paired with the URL above. |
| `ADMIN_PASSWORD` | for production | Single password gating `/admin` and the admin API. The customer submission endpoint stays public. |

The `NEXT_PUBLIC_*` keys are exposed to the client (that's how Supabase auth works). `ADMIN_PASSWORD` is server-only and **never** sent to the browser — it is only compared against the cookie inside the Next.js middleware/API.

## Supabase setup

1. Create a project on [supabase.com](https://supabase.com).
2. Project Settings → API: copy the URL and the anon key into `.env.local`.
3. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `submissions` table, indexes, and RLS policy used by the API routes.
4. Restart `npm run dev`.

When `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset (or still placeholders), the app silently falls back to `localStorage` — useful for demos and offline dev. The same code path is used in production once the variables are set.

## Admin protection

The admin area and admin-only API endpoints are gated by `ADMIN_PASSWORD`:

- `GET /api/submissions` — protected
- `PATCH /api/submissions/:ref` — protected
- `DELETE /api/submissions/:ref` — protected
- `POST /api/submissions` — **public** (customers submitting the request form)
- `/admin` — protected (redirects to `/admin/login` if no valid cookie)

To unlock, visit `/admin/login` and enter the password. A short-lived signed cookie is set; sign out by clearing the cookie or visiting `/admin/logout`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` | Production build. |
| `npm run start` | Run the built app. |
| `npm run typecheck` | `tsc --noEmit`, no editor required. |
| `npm run lint` | ESLint via `next lint`. Runs non-interactively against the existing config. |

## Project layout

```
app/                      Next.js App Router pages + API routes
  page.tsx                Homepage (Hero, packages, CTA…)
  packages/page.tsx       Public packages catalog
  request/page.tsx        Inquiry wizard
  admin/page.tsx          Admin dashboard
  admin/login/page.tsx    Admin password login
  api/submissions/...     REST endpoints (Supabase-backed)

components/               UI components, grouped by area
  home/                   Hero, sections, CTA mini-form
  packages/               Catalog grid + filters
  request/                Wizard + departure notice
  admin/                  Sidebar, dashboard, drawer, stat cards

data/                     Static content (packages, services, contact info)
lib/                      submissions, supabase client, utils
supabase/schema.sql       Postgres schema for the `submissions` table
```

## Notes

- The site is RTL Arabic — keep copy in Arabic and prefer logical CSS properties (`gap-*`, `pr-*`/`pl-*` are mirrored automatically by Tailwind in `dir="rtl"`).
- Color identity: orange `#FF6A1A` on cream `#fff9ef`, ink `#1e1b16`. Stick to these via the `brand-*` Tailwind tokens.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * True when Supabase credentials have been provided.
 * When false the app falls back to localStorage (dev/demo mode).
 */
export const supabaseEnabled =
  url.length > 0 &&
  !url.includes("your-project-id") &&
  key.length > 0 &&
  !key.includes("your-anon-key");

export const supabase = supabaseEnabled ? createClient(url, key) : null;

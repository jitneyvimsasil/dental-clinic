import { createBrowserClient } from "@supabase/ssr";

// Browser client (publishable/anon key, subject to RLS). Dashboard client
// components only — never used by the public chat/call widget, which has
// no Supabase session and talks to same-origin API routes instead.
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

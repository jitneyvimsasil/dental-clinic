import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client bound to the logged-in staff member's cookie session —
// respects RLS as that user. Used by dashboard Server Components/Server
// Actions (Phase 4), and by the dashboard's own appointment-booking path so
// it goes through the same book_appointment RPC as every other channel.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without a mutable response —
            // safe to ignore as long as middleware also refreshes the session.
          }
        },
      },
    }
  );
}

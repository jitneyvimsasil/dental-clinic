import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Used exclusively by
// booking-core and the chat/Retell routes, which have no Supabase session
// of their own to authenticate as. `import "server-only"` above makes any
// accidental client-component import a build-time error rather than a
// leaked key at runtime.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase service client is not configured.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

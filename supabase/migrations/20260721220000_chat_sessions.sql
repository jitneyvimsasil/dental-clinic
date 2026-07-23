-- The web chat widget's client only ever sends the latest message plus a
-- sessionId (src/hooks/useChat.ts / src/lib/api.ts's existing contract,
-- preserved as-is in Phase 5 rather than changed) — never the full
-- history. On Vercel's serverless functions there's no reliable
-- in-process memory across turns, so conversation state has to live here
-- instead. No RLS policies at all: only the service-role client (the
-- /api/chat route) ever touches this table.
create table public.chat_sessions (
  session_id text primary key,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.chat_sessions enable row level security;

# CLAUDE.md

Guidance for Claude Code (or any AI assistant) working in this repo.

## What this is

**Serene Dental** — a portfolio/demo project for vim-automations (an AI-automation freelancer), not a real clinic. It exists to prove a specific capability: a dental practice's booking system that works identically across three channels — a web chat widget, a phone call (RetellAI voice AI), and a staff dashboard — all backed by one shared data layer and one shared booking function, so there's no way for the channels to disagree with each other.

The `patients` table holds **synthetic demo data only** (`is_synthetic boolean default true`). Never enter real personal information — test flows with obviously-fake names/numbers, and clean up test rows after (see "Cleaning up test data" below).

## Architecture

**Three channels, one booking core.** `src/lib/booking-core/` (check-availability, lookup-patient, create-patient, book-appointment) is the single source of truth, called by:
- `src/app/api/chat/route.ts` — a Claude tool-use agentic loop, for the web widget's Chat mode
- `src/app/api/retell/functions/route.ts` — RetellAI's custom-function dispatch, for the widget's Call mode (browser-based Web Call, not a phone number — see below)
- The staff dashboard (`src/app/dashboard/`) — direct Supabase queries under RLS, but booking still goes through the same `book_appointment` RPC

Each booking-core function takes an **injected Supabase client** (service-role for chat/Retell, session-scoped for the dashboard), never a module-level singleton — that's what lets one function serve both trust levels correctly.

**Atomicity lives in Postgres, not application code.** `book_appointment` (a `security definer` RPC, in the `book_appointment_rpc` migration) claims a slot via a single row-locking `UPDATE ... WHERE is_booked = false`, and is idempotent — a retried call for the same slot+patient returns the existing appointment instead of erroring or duplicating. This matters because RetellAI itself retries failed function calls up to twice, and because two channels really can race for the same slot.

**n8n is async-only — never in the real-time hot path.** This was a deliberate pivot from an earlier plan to keep n8n as "the brain": RetellAI's live-call function-calling needs low-latency responses, and routing through n8n mid-call risked burning paid call minutes on debugging a slower, less reliable hop. n8n now only fires *after* a booking succeeds, triggered by a **Supabase Database Webhook** (`pg_net`, see the `n8n_booking_webhook` migration) — independent of the Next.js request lifecycle, so it survives even if the serverless function has already returned. Two n8n workflows exist, both built via n8n's REST API (not clicked together in the dashboard) so they're reviewable:
- **"Dental Clinic - Booking Confirmation"** — fires on every new appointment, sends a confirmation email.
- **"Dental Clinic - Lead Follow-Up"** — schedule-triggered daily, emails idle warm/cold leads at 7 and 30 days (see "Lead scoring" below). Also has a manual webhook trigger (`/webhook/dental-clinic-followup-manual`) kept specifically for on-demand testing, since n8n's public API has no way to manually run a schedule-triggered workflow.

**Lead scoring is derived from real data, never an AI-guessed score** — matching this project's standing rule against presenting fabricated numbers as fact. The `patient_lead_status` view (`security_invoker`, so it respects the querying user's own RLS) computes:
- `hot` — has a booked/confirmed appointment (converted)
- `warm` — no appointment yet, urgency is soon/emergency
- `cold` — no appointment yet, urgency is routine

**RLS is deny-by-default for `anon`.** No table has a policy granting the `anon` role anything — public web/phone traffic never holds a Supabase session, so it can only reach data through server-only routes using the service-role key. Staff (dentist/receptionist/admin) get scoped access via `current_staff_role()`; see the `helpers_and_rls` and `fix_staff_select_rls` migrations for the exact policies (and the bug the second one fixed — a receptionist viewing a dentist's appointment used to crash the page because `staff_select` only allowed seeing your own row).

**The Call channel is RetellAI Web Call, not a phone number.** No PSTN number exists or is planned — the widget's Call mode uses RetellAI's browser-based SDK (mic + WebRTC via a fixed LiveKit Cloud host, hardcoded in `retell-client-js-sdk`, not project-specific), which bills per minute of actual usage with no standing line rental. `src/app/api/retell/create-web-call/route.ts` mints short-lived access tokens server-side; the API key never reaches client JS. RetellAI signs its webhook/function calls with `X-Retell-Signature` (HMAC-SHA256, the API key itself is the secret — there's no separate webhook secret), verified in `src/lib/security/verify-retell-signature.ts`.

**The Retell agent's config is managed via `scripts/setup-retell-agent.ts`**, not the dashboard — run `DEPLOYED_URL=<url> npm run setup:retell` to create it fresh, or update it in place once `RETELL_AGENT_ID` is set in `.env.local`. It imports `TREATMENT_OPTIONS`/`CLINIC`/`HOURS` directly from `src/lib/constants.ts` rather than hardcoding prose — a real bug (the agent inventing business hours) came from not doing this originally.

## Commands

```bash
npm run dev          # dev server
npm run build         # production build
npm run lint          # eslint
npm run test           # vitest (unit/integration)
npm run test:e2e        # playwright
npm run seed            # seed hosted Supabase: 3 staff logins, 15 synthetic patients, 2 weeks of availability
npm run setup:retell     # create/update the RetellAI agent (needs DEPLOYED_URL env var)
```

No local Postgres/Docker — this project always runs against one hosted Supabase project (see "Windows quirks" below for why, and how migrations get applied without the CLI).

## Env vars

See `.env.example`. Everything server-only is intentionally *not* `NEXT_PUBLIC_`-prefixed. Two things worth knowing:
- `RETELL_API_KEY` doubles as the HMAC secret for verifying incoming RetellAI requests — there's no separate webhook secret to configure.
- `ANTHROPIC_API_KEY`/`RETELL_API_KEY` are picked up automatically by their SDKs' default env var names (`new Anthropic()`, `new Retell()` with no args) — don't wire them through manually.

## Windows dev environment quirks

- **The Supabase CLI's Windows binary can get blocked by a Windows Application Control policy** (confirmed via `supabase.exe` failing to run directly, not just a `spawnSync` error from the JS wrapper). If `supabase db push`/`migration new` fail with a generic spawn error, don't assume it's transient — check by invoking the `.exe` directly. **Workaround**: apply SQL migrations via Supabase's Management API instead — `POST https://api.supabase.com/v1/projects/{ref}/database/query` with `Authorization: Bearer <personal access token>` and `{"query": "<sql>"}`. This is the reason migration files in this repo may not all have been applied via `supabase db push` — check the actual database state if in doubt, not just the presence of a migration file.
- n8n workflows are managed via its REST API (`X-N8N-API-KEY` header) rather than clicked together — see `scripts/` for the pattern (create via POST, then `.../activate`), and prefer updating a workflow in place (`PUT`) over creating duplicates once one exists.

## Cleaning up test data

Anything created while testing (chat conversations, call bookings, Playwright's e2e runs) writes to the **real hosted Supabase project** — there's no separate test database. Playwright's "full happy path" test in particular creates a fresh patient+booking every run. Before a demo recording or a clean handoff, clear it:
```js
// delete patients matching your test naming pattern, their appointments, and
// the appointments' now-orphaned availability slots — in that order (FK constraints)
```
Chat conversations also leave rows in `chat_sessions`, harmless but worth clearing periodically too.

## Cost notes

- **RetellAI Web Call** bills per minute of actual call time, no standing number rental — pause or don't call the agent to stop billing, no "release the number" step needed.
- Everything else (Supabase, Vercel, n8n on the existing Railway instance) is on tiers already used elsewhere in vim-automations' stack — no new recurring cost from this project beyond RetellAI/Anthropic usage.

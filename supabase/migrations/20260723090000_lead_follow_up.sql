-- Lead nurture: tracks which automated follow-up email (if any) has been
-- sent to a warm/cold lead, so the n8n follow-up workflow doesn't resend
-- the same one repeatedly. null = none sent yet.
create type follow_up_stage as enum ('7day', '30day');

alter table public.patients
  add column follow_up_stage_sent follow_up_stage;

-- Lead status derived from real captured data (booking status + urgency),
-- not an AI-guessed score — same principle as everywhere else in this
-- project: never present a fabricated number as fact.
--   hot  = has a booked/confirmed appointment (converted)
--   warm = no appointment yet, but urgency is soon/emergency
--   cold = no appointment yet, routine urgency
--
-- security_invoker means this view respects the querying user's own RLS
-- (patients_select — any active staff), not the view owner's — so staff
-- see exactly what they'd see querying patients directly, nothing more.
create view public.patient_lead_status
with (security_invoker = true) as
select
  p.*,
  case
    when exists (
      select 1 from public.appointments a
      where a.patient_id = p.id and a.status in ('booked', 'confirmed')
    ) then 'hot'
    when p.urgency in ('soon', 'emergency') then 'warm'
    else 'cold'
  end as lead_status,
  extract(day from now() - p.created_at)::int as days_since_contact
from public.patients p;

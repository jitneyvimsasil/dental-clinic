-- Fires the n8n async side-effects workflow (confirmation email) whenever
-- a new appointment is booked, at the Postgres level — independent of
-- whichever process (web, Retell, dashboard) made the insert, and
-- independent of the Next.js request lifecycle. This is the only trigger
-- for this workflow; do not also fire it from application code, since the
-- n8n workflow sends an email unconditionally and a second trigger would
-- double-send it.
create extension if not exists pg_net;

create or replace function public.notify_n8n_new_appointment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://primary-production-bb684.up.railway.app/webhook/dental-clinic-booking',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('appointment_id', new.id)
  );
  return new;
end;
$$;

create trigger on_appointment_created
  after insert on public.appointments
  for each row
  execute function public.notify_n8n_new_appointment();

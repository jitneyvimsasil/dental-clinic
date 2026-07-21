-- The atomicity and idempotency guarantees live here, in the database, not
-- in application code — so every caller (web chat, RetellAI phone calls,
-- the staff dashboard) gets the same correctness guarantee for free.
--
-- security definer: this function is the sanctioned way to book a slot, so
-- it intentionally bypasses the per-row RLS policies on availability/
-- appointments (e.g. a receptionist booking any dentist's slot on a
-- patient's behalf). Direct table access still goes through RLS as normal —
-- only this specific, audited operation gets the broader permission.
create or replace function public.book_appointment(
  p_availability_id uuid,
  p_patient_id uuid,
  p_source appointment_source,
  p_treatment_type text default null,
  p_notes text default null
)
returns public.appointments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot public.availability;
  v_appt public.appointments;
begin
  -- Row lock via the UPDATE itself: two concurrent callers racing for the
  -- same slot can't both succeed here — one gets the row, the other gets
  -- zero rows back.
  update public.availability
    set is_booked = true
    where id = p_availability_id and is_booked = false
    returning * into v_slot;

  if v_slot.id is null then
    -- Idempotent retry path: if this exact slot+patient was already booked
    -- (e.g. a retried RetellAI function call after a network blip), return
    -- the existing appointment instead of erroring.
    select * into v_appt
      from public.appointments
      where availability_id = p_availability_id and patient_id = p_patient_id;

    if v_appt.id is not null then
      return v_appt;
    end if;

    raise exception 'SLOT_UNAVAILABLE' using errcode = 'P0001';
  end if;

  insert into public.appointments (
    patient_id, staff_id, availability_id, starts_at, ends_at, source, treatment_type, notes
  )
  values (
    p_patient_id, v_slot.staff_id, v_slot.id, v_slot.starts_at, v_slot.ends_at, p_source, p_treatment_type, p_notes
  )
  returning * into v_appt;

  return v_appt;
end;
$$;

grant execute on function public.book_appointment(uuid, uuid, appointment_source, text, text) to authenticated, service_role;

-- staff_select was too restrictive for real dashboard use: only a staff
-- member's own row (or an admin) was visible, so PostgREST's embedded
-- `staff(*)` join on appointments/availability returned null for anyone
-- viewing another staff member's assigned appointment — e.g. a
-- receptionist looking at a dentist's booking. Every other staff-facing
-- table already lets any active staff member read everything
-- (patients_select, appointments_select); staff directory info (name,
-- role) isn't sensitive enough to withhold from colleagues, so this
-- matches that pattern. Write access (staff_admin_write) is unchanged —
-- still admin-only.
drop policy if exists staff_select on public.staff;

create policy staff_select on public.staff
  for select
  using (current_staff_role() is not null);

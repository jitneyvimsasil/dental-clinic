-- No policies are defined for the `anon` role anywhere in this migration.
-- Public web/phone traffic never holds a Supabase session, so it can only
-- reach data through server-only routes using the service-role key (which
-- bypasses RLS) — never directly from the browser. This mirrors the
-- "never expose backend access to the browser" fix already made on the
-- main vim-automations-website's contact form.

create or replace function public.current_staff_role()
returns staff_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.staff where auth_user_id = auth.uid() and active limit 1;
$$;

-- staff: a user can see their own row; admins can see and manage everyone's.
create policy staff_select on public.staff
  for select
  using (auth_user_id = auth.uid() or current_staff_role() = 'admin');

create policy staff_admin_write on public.staff
  for all
  using (current_staff_role() = 'admin')
  with check (current_staff_role() = 'admin');

-- patients: any active staff member can read and write. This is a demo
-- with only synthetic data, so there's no need for finer-grained patient
-- privacy rules between roles.
create policy patients_select on public.patients
  for select
  using (current_staff_role() is not null);

create policy patients_insert on public.patients
  for insert
  with check (current_staff_role() is not null);

create policy patients_update on public.patients
  for update
  using (current_staff_role() is not null);

-- appointments: all staff can read; receptionist/admin manage everything;
-- a dentist can only update their own appointments.
create policy appointments_select on public.appointments
  for select
  using (current_staff_role() is not null);

create policy appointments_insert on public.appointments
  for insert
  with check (current_staff_role() in ('receptionist', 'admin'));

create policy appointments_update on public.appointments
  for update
  using (
    current_staff_role() in ('receptionist', 'admin')
    or (
      current_staff_role() = 'dentist'
      and staff_id = (select id from public.staff where auth_user_id = auth.uid())
    )
  );

-- availability: all staff can read; a dentist manages their own slots;
-- receptionist/admin can manage everyone's.
create policy availability_select on public.availability
  for select
  using (current_staff_role() is not null);

create policy availability_insert on public.availability
  for insert
  with check (
    current_staff_role() in ('receptionist', 'admin')
    or (
      current_staff_role() = 'dentist'
      and staff_id = (select id from public.staff where auth_user_id = auth.uid())
    )
  );

create policy availability_update on public.availability
  for update
  using (
    current_staff_role() in ('receptionist', 'admin')
    or (
      current_staff_role() = 'dentist'
      and staff_id = (select id from public.staff where auth_user_id = auth.uid())
    )
  );

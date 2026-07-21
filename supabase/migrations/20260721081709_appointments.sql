create type appointment_status as enum ('booked', 'confirmed', 'cancelled', 'completed', 'no_show');
create type appointment_source as enum ('web', 'phone', 'manual');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id),
  staff_id uuid not null references public.staff(id),
  -- unique: a second, independent guard against double-booking a slot,
  -- on top of the row-lock in book_appointment()'s UPDATE.
  availability_id uuid unique references public.availability(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appointment_status not null default 'booked',
  source appointment_source not null,
  treatment_type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments enable row level security;

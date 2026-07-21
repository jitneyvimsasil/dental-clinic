-- SYNTHETIC DEMO DATA ONLY — this is a portfolio demo, never store real
-- patient information here. Field shape matches the existing IntakeForm.tsx
-- (src/components/sections/IntakeForm.tsx) so that form needs no changes.
create type patient_urgency as enum ('emergency', 'soon', 'routine');

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  treatment text,
  insurance text,
  is_new_patient boolean not null default true,
  urgency patient_urgency not null default 'routine',
  notes text,
  is_synthetic boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index patients_phone_key on public.patients (phone) where phone is not null;

alter table public.patients enable row level security;

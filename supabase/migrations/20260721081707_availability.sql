create table public.availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  constraint availability_time_order check (ends_at > starts_at)
);

-- Partial index: only open slots are ever queried by check_availability, so
-- this keeps that lookup fast without indexing already-booked rows.
create index availability_open_slots_idx on public.availability (staff_id, starts_at) where not is_booked;

alter table public.availability enable row level security;

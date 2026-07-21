create extension if not exists pgcrypto;

create type staff_role as enum ('dentist', 'receptionist', 'admin');

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  role staff_role not null,
  email text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

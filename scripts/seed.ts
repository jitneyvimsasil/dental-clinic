// Seeds the hosted Supabase project directly (no local Postgres/Docker in
// this project — see CLAUDE.md). Run via `npm run seed`. Safe to re-run:
// staff/patients use `upsert`-like guards, and availability generation
// skips if slots already exist for the seeded staff.
import { config } from "dotenv";
import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_PASSWORD = randomBytes(12).toString("base64url");

const STAFF = [
  { name: "Dr. Maria Santos", role: "dentist", email: "dr.santos@serenedental.demo" },
  { name: "Carla Reyes", role: "receptionist", email: "carla.reyes@serenedental.demo" },
  { name: "Admin User", role: "admin", email: "admin@serenedental.demo" },
] as const;

const FIRST_NAMES = ["Juan", "Maria", "Jose", "Ana", "Pedro", "Rosa", "Miguel", "Carmen", "Antonio", "Elena", "Rafael", "Sofia", "Diego", "Isabel", "Luis"];
const LAST_NAMES = ["Dela Cruz", "Reyes", "Santos", "Bautista", "Garcia", "Mendoza", "Torres", "Flores", "Ramos", "Villanueva", "Castro", "Rivera", "Aquino", "Gonzales", "Fernandez"];
const TREATMENTS = ["Teeth Cleaning", "Fillings", "Crowns & Bridges", "Dental Implants", "Invisalign", "Teeth Whitening", "Root Canal", "Emergency Care"];
const URGENCIES = ["routine", "routine", "routine", "soon", "emergency"] as const;

async function seedStaff() {
  const staffIds: Record<string, string> = {};

  for (const s of STAFF) {
    const { data: existing } = await supabase
      .from("staff")
      .select("id, auth_user_id")
      .eq("email", s.email)
      .maybeSingle();

    if (existing) {
      console.log(`staff exists: ${s.email}`);
      staffIds[s.role] = existing.id;
      continue;
    }

    const { data: created, error: authError } = await supabase.auth.admin.createUser({
      email: s.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });

    if (authError || !created.user) {
      throw new Error(`Failed to create auth user for ${s.email}: ${authError?.message}`);
    }

    const { data: staffRow, error: staffError } = await supabase
      .from("staff")
      .insert({ auth_user_id: created.user.id, name: s.name, role: s.role, email: s.email })
      .select("id")
      .single();

    if (staffError) throw staffError;

    staffIds[s.role] = staffRow.id;
    console.log(`created staff: ${s.email} (${s.role})`);
  }

  return staffIds;
}

async function seedPatients() {
  const { count } = await supabase.from("patients").select("*", { count: "exact", head: true });
  if (count && count > 0) {
    console.log(`patients already seeded (${count} rows), skipping`);
    return;
  }

  const patients = Array.from({ length: 15 }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    return {
      name: `${first} ${last}`,
      phone: `0917${String(1000000 + i * 137).slice(0, 7)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/\s+/g, "")}@example.com`,
      treatment: TREATMENTS[i % TREATMENTS.length],
      insurance: i % 3 === 0 ? "PhilHealth" : null,
      is_new_patient: i % 4 === 0,
      urgency: URGENCIES[i % URGENCIES.length],
      is_synthetic: true,
    };
  });

  const { error } = await supabase.from("patients").insert(patients);
  if (error) throw error;
  console.log(`seeded ${patients.length} synthetic patients`);
}

async function seedAvailability(staffIds: Record<string, string>) {
  const dentistId = staffIds["dentist"];

  const { count } = await supabase
    .from("availability")
    .select("*", { count: "exact", head: true })
    .eq("staff_id", dentistId);

  if (count && count > 0) {
    console.log(`availability already seeded (${count} slots), skipping`);
    return;
  }

  const slots: { staff_id: string; starts_at: string; ends_at: string }[] = [];
  const now = new Date();

  for (let day = 1; day <= 14; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    const weekday = date.getDay();
    if (weekday === 0) continue; // closed Sundays

    for (const hour of [9, 10, 11, 14, 15, 16]) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      slots.push({ staff_id: dentistId, starts_at: start.toISOString(), ends_at: end.toISOString() });
    }
  }

  const { error } = await supabase.from("availability").insert(slots);
  if (error) throw error;
  console.log(`seeded ${slots.length} availability slots for the next 2 weeks`);
}

async function main() {
  const staffIds = await seedStaff();
  await seedPatients();
  await seedAvailability(staffIds);

  console.log("\nDone.");
  console.log(`Demo staff password (shared across all 3 accounts): ${DEMO_PASSWORD}`);
  console.log("Save this now — it is not stored anywhere and won't be printed again.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Integration test against the real hosted Supabase project — the
// row-locking/idempotency behavior this test exists to catch can't be
// meaningfully verified against a mock. Requires .env.local to be present
// (see .env.example); skips itself if the project isn't configured.
import { config } from "dotenv";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { bookAppointment, SlotUnavailableError } from "../book-appointment";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const describeIfConfigured = url && serviceKey ? describe : describe.skip;

describeIfConfigured("book_appointment race conditions (real Supabase)", () => {
  let supabase: SupabaseClient;
  let staffId: string;
  let patientAId: string;
  let patientBId: string;
  const createdAvailabilityIds: string[] = [];
  const createdPatientIds: string[] = [];
  const createdAppointmentIds: string[] = [];

  beforeAll(async () => {
    supabase = createClient(url!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: staff, error: staffError } = await supabase
      .from("staff")
      .select("id")
      .eq("role", "dentist")
      .limit(1)
      .single();
    if (staffError) throw staffError;
    staffId = staff.id;

    const { data: patients, error: patientError } = await supabase
      .from("patients")
      .insert([
        { name: "Test Patient A", phone: `09-test-${Date.now()}-a`, is_synthetic: true },
        { name: "Test Patient B", phone: `09-test-${Date.now()}-b`, is_synthetic: true },
      ])
      .select("id");
    if (patientError) throw patientError;
    patientAId = patients[0].id;
    patientBId = patients[1].id;
    createdPatientIds.push(patientAId, patientBId);
  });

  afterAll(async () => {
    if (createdAppointmentIds.length) {
      await supabase.from("appointments").delete().in("id", createdAppointmentIds);
    }
    if (createdAvailabilityIds.length) {
      await supabase.from("availability").delete().in("id", createdAvailabilityIds);
    }
    if (createdPatientIds.length) {
      await supabase.from("patients").delete().in("id", createdPatientIds);
    }
  });

  async function makeTestSlot(hoursFromNow: number) {
    const starts = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    const ends = new Date(starts.getTime() + 30 * 60 * 1000);
    const { data, error } = await supabase
      .from("availability")
      .insert({ staff_id: staffId, starts_at: starts.toISOString(), ends_at: ends.toISOString() })
      .select("id")
      .single();
    if (error) throw error;
    createdAvailabilityIds.push(data.id);
    return data.id;
  }

  it("is idempotent when the same patient retries the same slot concurrently", async () => {
    const slotId = await makeTestSlot(1000);

    const [a, b] = await Promise.all([
      bookAppointment(supabase, { availabilityId: slotId, patientId: patientAId, source: "web" }),
      bookAppointment(supabase, { availabilityId: slotId, patientId: patientAId, source: "web" }),
    ]);

    expect(a.id).toBe(b.id);
    createdAppointmentIds.push(a.id);

    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("availability_id", slotId);
    expect(count).toBe(1);
  });

  it("lets exactly one of two different patients win a race for the same slot", async () => {
    const slotId = await makeTestSlot(1001);

    const results = await Promise.allSettled([
      bookAppointment(supabase, { availabilityId: slotId, patientId: patientAId, source: "web" }),
      bookAppointment(supabase, { availabilityId: slotId, patientId: patientBId, source: "phone" }),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(SlotUnavailableError);

    const winner = (fulfilled[0] as PromiseFulfilledResult<Awaited<ReturnType<typeof bookAppointment>>>).value;
    createdAppointmentIds.push(winner.id);

    const { count } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("availability_id", slotId);
    expect(count).toBe(1);
  });
});

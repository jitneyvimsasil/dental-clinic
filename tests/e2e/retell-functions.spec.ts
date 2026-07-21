import { config } from "dotenv";
import { createHmac } from "crypto";
import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const API_KEY = process.env.RETELL_API_KEY!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

function signBody(rawBody: string) {
  const timestamp = Date.now().toString();
  const digest = createHmac("sha256", API_KEY).update(rawBody + timestamp).digest("hex");
  return `v=${timestamp},d=${digest}`;
}

test.describe("/api/retell/functions", () => {
  test("rejects a request with no signature", async ({ request }) => {
    const res = await request.post("/api/retell/functions", {
      data: { name: "check_availability", args: {}, call: {} },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects a request with an invalid signature", async ({ request }) => {
    const res = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": "v=1,d=deadbeef" },
      data: { name: "check_availability", args: {}, call: {} },
    });
    expect(res.status()).toBe(401);
  });

  test("check_availability returns open slots with a valid signature", async ({ request }) => {
    const body = JSON.stringify({ name: "check_availability", args: { limit: 3 }, call: {} });
    const res = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": signBody(body), "content-type": "application/json" },
      data: body,
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.slots)).toBe(true);
    expect(json.slots.length).toBeGreaterThan(0);
    expect(json.slots[0]).toHaveProperty("slotId");
    expect(json.slots[0]).toHaveProperty("startsAt");
  });

  test("full happy path: check availability, lookup miss, create patient, book, re-check shows slot gone", async ({ request }) => {
    const availBody = JSON.stringify({ name: "check_availability", args: { limit: 1 }, call: {} });
    const availRes = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": signBody(availBody), "content-type": "application/json" },
      data: availBody,
    });
    const { slots } = await availRes.json();
    const slotId = slots[0].slotId;

    const phone = `09-e2e-${Date.now()}`;
    const lookupBody = JSON.stringify({ name: "lookup_patient", args: { phone }, call: {} });
    const lookupRes = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": signBody(lookupBody), "content-type": "application/json" },
      data: lookupBody,
    });
    const lookupJson = await lookupRes.json();
    expect(lookupJson.patient).toBeNull();

    const createBody = JSON.stringify({
      name: "create_patient",
      args: {
        name: "E2E Test Patient",
        phone,
        email: "e2e-test@example.com",
        treatment: "Teeth Cleaning",
        isNewPatient: true,
        urgency: "routine",
      },
      call: {},
    });
    const createRes = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": signBody(createBody), "content-type": "application/json" },
      data: createBody,
    });
    const { patient } = await createRes.json();
    expect(patient.id).toBeTruthy();

    const bookBody = JSON.stringify({
      name: "book_appointment",
      args: { availabilityId: slotId, patientId: patient.id, source: "phone" },
      call: {},
    });
    const bookRes = await request.post("/api/retell/functions", {
      headers: { "x-retell-signature": signBody(bookBody), "content-type": "application/json" },
      data: bookBody,
    });
    const bookJson = await bookRes.json();
    expect(bookJson.appointment.id).toBeTruthy();
    expect(bookJson.appointment.availability_id).toBe(slotId);

    const { data: slotRow } = await supabase
      .from("availability")
      .select("is_booked")
      .eq("id", slotId)
      .single();
    expect(slotRow?.is_booked).toBe(true);
  });
});

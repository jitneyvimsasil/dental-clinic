import type { SupabaseClient } from "@supabase/supabase-js";
import type { BookAppointmentInput } from "@/lib/booking-schema";

export interface AppointmentRecord {
  id: string;
  patient_id: string;
  staff_id: string;
  availability_id: string | null;
  starts_at: string;
  ends_at: string;
  status: string;
  source: string;
  treatment_type: string | null;
  notes: string | null;
}

export class SlotUnavailableError extends Error {
  constructor() {
    super("SLOT_UNAVAILABLE");
    this.name = "SlotUnavailableError";
  }
}

// The atomicity/idempotency guarantees live in the book_appointment Postgres
// RPC (a row-locking UPDATE + idempotent-retry check), not here — this is
// just a thin, typed wrapper so every caller (chat, Retell, dashboard) goes
// through the exact same path and can't drift.
export async function bookAppointment(
  supabase: SupabaseClient,
  input: BookAppointmentInput
): Promise<AppointmentRecord> {
  const { data, error } = await supabase.rpc("book_appointment", {
    p_availability_id: input.availabilityId,
    p_patient_id: input.patientId,
    p_source: input.source,
    p_treatment_type: input.treatmentType ?? null,
    p_notes: input.notes ?? null,
  });

  if (error) {
    if (error.message?.includes("SLOT_UNAVAILABLE")) {
      throw new SlotUnavailableError();
    }
    throw error;
  }

  return data as AppointmentRecord;
}

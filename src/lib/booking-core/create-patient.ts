import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreatePatientInput } from "@/lib/booking-schema";
import type { PatientRecord } from "./lookup-patient";

export async function createPatient(
  supabase: SupabaseClient,
  input: CreatePatientInput
): Promise<PatientRecord> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email,
      treatment: input.treatment,
      insurance: input.insurance ?? null,
      is_new_patient: input.isNewPatient,
      urgency: input.urgency,
    })
    .select("id, name, phone, email")
    .single();

  if (error) throw error;
  return data;
}

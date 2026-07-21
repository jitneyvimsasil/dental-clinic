import type { SupabaseClient } from "@supabase/supabase-js";
import type { LookupPatientInput } from "@/lib/booking-schema";

export interface PatientRecord {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

export async function lookupPatient(
  supabase: SupabaseClient,
  input: LookupPatientInput
): Promise<PatientRecord | null> {
  const { data, error } = await supabase
    .from("patients")
    .select("id, name, phone, email")
    .eq("phone", input.phone)
    .maybeSingle();

  if (error) throw error;
  return data;
}

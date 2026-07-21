import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckAvailabilityInput } from "@/lib/booking-schema";

export interface AvailableSlot {
  slotId: string;
  staffId: string;
  staffName: string;
  startsAt: string;
  endsAt: string;
}

// Takes an injected client (service-role for chat/Retell, session-scoped
// for the dashboard) rather than a module-level singleton, so the same
// function works for every caller and is testable against a real Supabase
// client without a network-facing HTTP layer.
export async function checkAvailability(
  supabase: SupabaseClient,
  input: CheckAvailabilityInput
): Promise<AvailableSlot[]> {
  const fromDate = input.fromDate ?? new Date().toISOString();

  const { data, error } = await supabase
    .from("availability")
    .select("id, staff_id, starts_at, ends_at, staff:staff_id(name)")
    .eq("is_booked", false)
    .gte("starts_at", fromDate)
    .order("starts_at", { ascending: true })
    .limit(input.limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    slotId: row.id,
    staffId: row.staff_id,
    staffName: (row.staff as unknown as { name: string } | null)?.name ?? "our dentist",
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));
}

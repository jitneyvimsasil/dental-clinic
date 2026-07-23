"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["booked", "confirmed", "completed", "cancelled", "no_show"] as const;

export function AppointmentStatusControl({
  appointmentId,
  currentStatus,
  readOnly,
}: {
  appointmentId: string;
  currentStatus: string;
  readOnly: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: string) {
    setError(null);
    setIsSaving(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status: next })
      .eq("id", appointmentId);

    if (error) {
      setError("Couldn't update status — you may not have permission.");
      setIsSaving(false);
      return;
    }

    setStatus(next);
    setIsSaving(false);
    router.refresh();
  }

  if (readOnly) {
    return <span className="text-sm capitalize">{status.replace("_", " ")}</span>;
  }

  return (
    <div className="space-y-2">
      <Select value={status} onValueChange={handleChange} disabled={isSaving}>
        <SelectTrigger className="w-48" aria-label="Appointment status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

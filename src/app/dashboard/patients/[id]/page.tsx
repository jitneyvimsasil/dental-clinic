import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: patient }, { data: appointments }] = await Promise.all([
    supabase.from("patients").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("appointments")
      .select("id, starts_at, treatment_type, status, staff(name)")
      .eq("patient_id", id)
      .order("starts_at", { ascending: false }),
  ]);

  if (!patient) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/dashboard/patients" className="text-sm text-muted-foreground hover:underline">
        ← Back to patients
      </Link>

      <div>
        <h1 className="text-2xl font-semibold mb-1">{patient.name}</h1>
        <p className="text-sm text-muted-foreground">
          {patient.is_new_patient ? "New patient" : "Returning patient"} · urgency: {patient.urgency}
        </p>
      </div>

      <Card className="p-5 space-y-2 text-sm">
        <h2 className="font-medium mb-1">Contact</h2>
        <p className="text-muted-foreground">{patient.phone}</p>
        <p className="text-muted-foreground">{patient.email}</p>
        {patient.insurance && <p className="text-muted-foreground">Insurance: {patient.insurance}</p>}
      </Card>

      <div>
        <h2 className="font-medium mb-3">Appointment history</h2>
        <Card className="divide-y divide-border">
          {appointments && appointments.length > 0 ? (
            appointments.map((appt) => (
              <Link
                key={appt.id}
                href={`/dashboard/appointments/${appt.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{appt.treatment_type ?? "General visit"}</p>
                  <p className="text-xs text-muted-foreground">
                    {(appt.staff as unknown as { name: string } | null)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{formatDateTime(appt.starts_at)}</p>
                  <Badge variant="outline" className="capitalize mt-1">
                    {appt.status.replace("_", " ")}
                  </Badge>
                </div>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No appointments yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

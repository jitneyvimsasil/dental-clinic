import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { AppointmentStatusControl } from "./status-control";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });
}

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: appt }, { data: userData }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*, patients(*), staff(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!appt) notFound();

  const { data: currentStaff } = await supabase
    .from("staff")
    .select("id, role")
    .eq("auth_user_id", userData.user!.id)
    .single();

  const canEdit =
    currentStaff?.role === "receptionist" ||
    currentStaff?.role === "admin" ||
    (currentStaff?.role === "dentist" && currentStaff.id === appt.staff_id);

  const patient = appt.patients as unknown as { id: string; name: string; phone: string; email: string; insurance: string | null };
  const staff = appt.staff as unknown as { name: string };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/dashboard/appointments" className="text-sm text-muted-foreground hover:underline">
        ← Back to appointments
      </Link>

      <div>
        <h1 className="text-2xl font-semibold mb-1">{appt.treatment_type ?? "Appointment"}</h1>
        <p className="text-sm text-muted-foreground">{formatDateTime(appt.starts_at)}</p>
      </div>

      <Card className="p-5 space-y-3">
        <h2 className="font-medium">Patient</h2>
        <div className="text-sm space-y-1">
          <p>
            <Link href={`/dashboard/patients/${patient.id}`} className="text-primary hover:underline">
              {patient.name}
            </Link>
          </p>
          <p className="text-muted-foreground">{patient.phone}</p>
          <p className="text-muted-foreground">{patient.email}</p>
          {patient.insurance && <p className="text-muted-foreground">Insurance: {patient.insurance}</p>}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-medium">Details</h2>
        <div className="text-sm space-y-1">
          <p>Dentist: {staff.name}</p>
          <p className="capitalize">Source: {appt.source}</p>
          {appt.notes && <p className="text-muted-foreground">Notes: {appt.notes}</p>}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-medium">Status</h2>
        <AppointmentStatusControl appointmentId={appt.id} currentStatus={appt.status} readOnly={!canEdit} />
        {!canEdit && (
          <p className="text-xs text-muted-foreground">
            Only the assigned dentist, receptionist, or admin can change this.
          </p>
        )}
      </Card>
    </div>
  );
}

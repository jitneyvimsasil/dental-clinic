import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  });
}

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  const [{ count: upcomingCount }, { count: patientCount }, { data: upcoming }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("starts_at", now)
      .eq("status", "booked"),
    supabase.from("patients").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("id, starts_at, treatment_type, status, patients(name), staff(name)")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(8),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">Serene Dental staff dashboard</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Upcoming appointments</p>
          <p className="text-3xl font-semibold mt-1">{upcomingCount ?? 0}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total patients</p>
          <p className="text-3xl font-semibold mt-1">{patientCount ?? 0}</p>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Next up</h2>
          <Link href="/dashboard/appointments" className="text-sm text-primary hover:underline">
            View all appointments
          </Link>
        </div>
        <Card className="divide-y divide-border">
          {upcoming && upcoming.length > 0 ? (
            upcoming.map((appt) => (
              <Link
                key={appt.id}
                href={`/dashboard/appointments/${appt.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">
                    {(appt.patients as unknown as { name: string } | null)?.name ?? "Unknown patient"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appt.treatment_type ?? "General visit"} with{" "}
                    {(appt.staff as unknown as { name: string } | null)?.name ?? "our dentist"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{formatDateTime(appt.starts_at)}</p>
              </Link>
            ))
          ) : (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No upcoming appointments.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  booked: "default",
  confirmed: "secondary",
  completed: "outline",
  cancelled: "destructive",
  no_show: "destructive",
};

export default async function AppointmentsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, starts_at, treatment_type, status, source, patients(name), staff(name)")
    .order("starts_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Appointments</h1>
        <p className="text-sm text-muted-foreground">{appointments?.length ?? 0} total</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>When</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Dentist</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments?.map((appt) => (
            <TableRow key={appt.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/dashboard/appointments/${appt.id}`} className="hover:underline font-medium">
                  {(appt.patients as unknown as { name: string } | null)?.name ?? "Unknown"}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDateTime(appt.starts_at)}</TableCell>
              <TableCell>{appt.treatment_type ?? "—"}</TableCell>
              <TableCell>{(appt.staff as unknown as { name: string } | null)?.name ?? "—"}</TableCell>
              <TableCell className="capitalize text-muted-foreground">{appt.source}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[appt.status] ?? "outline"} className="capitalize">
                  {appt.status.replace("_", " ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

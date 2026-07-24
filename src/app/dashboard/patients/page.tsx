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
import { LeadStatusBadge } from "@/components/lead-status-badge";

export default async function PatientsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: patients } = await supabase
    .from("patient_lead_status")
    .select("id, name, phone, email, treatment, is_new_patient, lead_status, days_since_contact")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Patients</h1>
        <p className="text-sm text-muted-foreground">{patients?.length ?? 0} total</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lead</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients?.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <Link href={`/dashboard/patients/${p.id}`} className="hover:underline font-medium">
                  {p.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{p.phone}</TableCell>
              <TableCell className="text-muted-foreground">{p.email}</TableCell>
              <TableCell>{p.treatment}</TableCell>
              <TableCell>
                <Badge variant={p.is_new_patient ? "default" : "secondary"}>
                  {p.is_new_patient ? "New" : "Returning"}
                </Badge>
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={p.lead_status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/lead-status-badge";

export default async function LeadsPage() {
  const supabase = await createServerSupabaseClient();

  // Needs follow-up = warm/cold (hot means they already booked, they're
  // done) sorted most-idle-first, so the top of the list is always who to
  // call next.
  const { data: leads } = await supabase
    .from("patient_lead_status")
    .select("id, name, phone, urgency, treatment, lead_status, days_since_contact, follow_up_stage_sent")
    .in("lead_status", ["warm", "cold"])
    .order("days_since_contact", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Leads needing follow-up</h1>
        <p className="text-sm text-muted-foreground">
          {leads?.length ?? 0} leads haven&apos;t booked yet, sorted by how long they&apos;ve waited.
        </p>
      </div>

      <Card className="divide-y divide-border">
        {leads && leads.length > 0 ? (
          leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/dashboard/patients/${lead.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{lead.name}</p>
                  <LeadStatusBadge status={lead.lead_status} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lead.treatment} · {lead.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {lead.days_since_contact === 0 ? "Today" : `${lead.days_since_contact} days idle`}
                </p>
                {lead.follow_up_stage_sent && (
                  <p className="text-xs text-muted-foreground">
                    {lead.follow_up_stage_sent} reminder sent
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            No leads waiting on follow-up right now.
          </p>
        )}
      </Card>
    </div>
  );
}

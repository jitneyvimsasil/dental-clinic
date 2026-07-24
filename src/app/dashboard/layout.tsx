import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: staff } = await supabase
    .from("staff")
    .select("name, role")
    .eq("auth_user_id", user!.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <span className="font-semibold text-foreground">Serene Dental</span>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Overview
            </Link>
            <Link
              href="/dashboard/appointments"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Appointments
            </Link>
            <Link href="/dashboard/patients" className="text-sm text-muted-foreground hover:text-foreground">
              Patients
            </Link>
            <Link href="/dashboard/leads" className="text-sm text-muted-foreground hover:text-foreground">
              Leads
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {staff && (
              <span className="text-sm text-muted-foreground">
                {staff.name} <span className="text-xs">({staff.role})</span>
              </span>
            )}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

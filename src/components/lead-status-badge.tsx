import { Badge } from "@/components/ui/badge";

type LeadStatus = "hot" | "warm" | "cold";

const STYLES: Record<LeadStatus, string> = {
  hot: "bg-red-500/15 text-red-600 border-red-500/20 dark:text-red-400",
  warm: "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400",
  cold: "bg-blue-500/15 text-blue-600 border-blue-500/20 dark:text-blue-400",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={`capitalize ${STYLES[status]}`}>
      {status}
    </Badge>
  );
}

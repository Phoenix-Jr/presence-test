import { Badge } from "@/components/ui/badge";
import type { MemberStatus } from "@/types";

export function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <Badge variant={status === "active" ? "success" : "warning"} className="capitalize">
      <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
      {status}
    </Badge>
  );
}

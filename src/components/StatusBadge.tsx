import { RequestStatus, STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusClasses: Record<RequestStatus, string> = {
  draft: "status-draft",
  submitted: "status-submitted",
  in_review: "status-in-review",
  needs_info: "status-needs-info",
  approved: "status-approved",
  sent_for_signature: "status-signature",
  awaiting_signature: "status-signature",
  awaiting_payment: "status-payment",
  executed: "status-executed",
  closed: "status-closed",
  done: "status-done",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", statusClasses[status], className)}>
      {STATUS_LABELS[status]}
    </span>
  );
}

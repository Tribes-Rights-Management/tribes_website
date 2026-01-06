import { RequestStatus, STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
  subtle?: boolean;
}

export function StatusBadge({ status, className, subtle = true }: StatusBadgeProps) {
  // Apple-grade: outline-only, neutral, minimal
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        "border border-border bg-transparent text-muted-foreground",
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

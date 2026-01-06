import { RequestStatus, STATUS_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
  subtle?: boolean;
}

export function StatusBadge({ status, className, subtle = false }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full text-xs font-medium whitespace-nowrap";
  
  if (subtle) {
    return (
      <span className={cn(
        baseClasses,
        "px-2 py-0.5 border border-border/60 text-muted-foreground bg-background",
        className
      )}>
        {STATUS_LABELS[status]}
      </span>
    );
  }

  const statusClasses: Record<RequestStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    submitted: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_review: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    needs_info: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    sent_for_signature: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    awaiting_signature: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    awaiting_payment: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    executed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    closed: "bg-muted text-muted-foreground",
    done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <span className={cn(
      baseClasses,
      "px-2.5 py-0.5",
      statusClasses[status],
      className
    )}>
      {STATUS_LABELS[status]}
    </span>
  );
}

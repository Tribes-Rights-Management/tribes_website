import { formatDistanceToNow, format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusHistory, STATUS_LABELS } from "@/types";

interface ActivityTimelineProps {
  history: StatusHistory[];
}

export function ActivityTimeline({ history }: ActivityTimelineProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">No activity yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`timeline-dot ${index === 0 ? "timeline-dot-active" : ""}`} />
            {index < history.length - 1 && <div className="timeline-line" />}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              {item.from_status && (
                <>
                  <span className="text-xs text-muted-foreground">
                    {STATUS_LABELS[item.from_status]}
                  </span>
                  <span className="text-xs text-muted-foreground">→</span>
                </>
              )}
              <StatusBadge status={item.to_status} />
            </div>
            {item.notes && (
              <p className="text-sm text-muted-foreground mb-1">{item.notes}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              <span className="mx-1">·</span>
              {format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LicenseRequest, MEDIA_TYPE_LABELS } from "@/types";
import { Plus, Calendar, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PortalDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1>My Requests</h1>
          <Button asChild>
            <Link to="/portal/request/new">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-4 border-b border-border/30">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No license requests yet"
            description="Submit a request to begin the licensing process."
            action={
              <Button asChild>
                <Link to="/portal/request/new">
                  New license request
                </Link>
              </Button>
            }
          />
        ) : (
          <div>
            {requests.map((request) => (
              <Link 
                key={request.id} 
                to={`/portal/request/${request.id}`}
                className="block py-4 border-b border-border/20 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="flex items-center gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium truncate">
                        {request.song_title || request.track_title || request.project_title || "Untitled Request"}
                      </span>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {request.media_type && (
                        <span>{MEDIA_TYPE_LABELS[request.media_type]}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

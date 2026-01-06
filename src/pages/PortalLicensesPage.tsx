import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { LicenseRequest, RequestStatus, STATUS_LABELS } from "@/types";
import { ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";

export default function PortalLicensesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        .neq("status", "draft")
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
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-1">Licenses</h1>
            <p className="text-sm text-muted-foreground">
              All your license requests.
            </p>
          </div>
          <Link
            to="/portal/request/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New request
          </Link>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16">
            <p className="text-sm text-muted-foreground">
              No license requests yet. New requests will appear here.
            </p>
          </div>
        ) : (
          <div>
            {requests.map((request) => {
              const title = request.track_title || request.song_title || request.project_title || "Untitled";
              const submittedDate = request.submitted_at
                ? format(new Date(request.submitted_at), "MMM d, yyyy")
                : "—";

              return (
                <div
                  key={request.id}
                  onClick={() => navigate(`/portal/request/${request.id}`)}
                  className="flex items-center justify-between py-3.5 border-b border-border/20 cursor-pointer hover:bg-muted/20 -mx-2 px-2 rounded transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/portal/request/${request.id}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{title}</p>
                      <p className="text-xs text-muted-foreground">{submittedDate}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-3 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

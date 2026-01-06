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

type StatusFilter = "all" | RequestStatus;

const STATUS_ORDER: RequestStatus[] = [
  "submitted",
  "in_review",
  "needs_info",
  "awaiting_signature",
  "awaiting_payment",
  "done",
];

export default function PortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

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

  // Calculate counts
  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter requests
  const filteredRequests = activeFilter === "all" 
    ? requests 
    : requests.filter(r => r.status === activeFilter);

  // Take recent 7 for display
  const displayRequests = filteredRequests.slice(0, 7);

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your licensing activity.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            {/* Status Overview */}
            <section className="mb-10">
              <div className="space-y-0">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`flex items-center justify-between w-full py-2.5 text-left transition-colors ${
                    activeFilter === "all" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-sm">All requests</span>
                  <span className="text-sm tabular-nums">{requests.length}</span>
                </button>
                {STATUS_ORDER.map((status) => {
                  const count = statusCounts[status] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`flex items-center justify-between w-full py-2.5 text-left transition-colors ${
                        activeFilter === status ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm">{STATUS_LABELS[status]}</span>
                      <span className="text-sm tabular-nums">{count}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recent Requests */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium">Recent license requests</h2>
                <Link
                  to="/portal/request/new"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New request
                </Link>
              </div>

              {displayRequests.length === 0 ? (
                <div className="py-12">
                  <p className="text-sm text-muted-foreground">
                    No license requests yet. New requests will appear here.
                  </p>
                </div>
              ) : (
                <div>
                  {displayRequests.map((request) => {
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
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

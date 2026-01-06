import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { LicenseRequest } from "@/types";
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

  // Determine empty state type
  const isFirstTime = requests.length === 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl opacity-0" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-content-fade">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[15px] font-medium mb-1">Licenses</h1>
            <p className="text-[13px] text-muted-foreground">
              All your license requests.
            </p>
          </div>
          <Link
            to="/portal/request/new"
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            + New request
          </Link>
        </div>

        {/* List */}
        {isFirstTime ? (
          <div className="py-16">
            <p className="text-[14px] font-medium mb-1">No license activity yet</p>
            <p className="text-[13px] text-muted-foreground">
              License requests will appear here once submitted.
            </p>
          </div>
        ) : (
          <div>
            {requests.map((request) => {
              const title = request.track_title || request.song_title || request.project_title || "Untitled";
              const submittedDate = request.submitted_at
                ? format(new Date(request.submitted_at), "MMM d")
                : "—";

              return (
                <div
                  key={request.id}
                  onClick={() => navigate(`/portal/request/${request.id}`)}
                  className="flex items-center justify-between h-14 cursor-pointer hover:bg-muted/30 rounded-md transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                      <div className="flex items-center gap-3">
                        <p className="text-[14px] truncate">{title}</p>
                        {request.license_id && (
                          <span className="text-[12px] text-muted-foreground font-mono">{request.license_id}</span>
                        )}
                      </div>
                      <p className="text-[13px] text-muted-foreground">{submittedDate}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

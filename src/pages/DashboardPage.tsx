import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LicenseRequest, MEDIA_TYPE_LABELS } from "@/types";
import { Plus, FileText, Music2, Calendar, Building2, ChevronRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Requests</h1>
            <p className="text-muted-foreground text-sm">
              Track and manage your license requests
            </p>
          </div>
          <Button asChild>
            <Link to="/request/new">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No requests yet"
            description="Create your first license request to get started with music licensing."
            action={
              <Button asChild>
                <Link to="/request/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <Link key={request.id} to={`/request/${request.id}`}>
                <Card className="card-interactive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-5 h-5 text-muted-foreground" />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">
                            {request.song_title || request.project_title || "Untitled Request"}
                          </h3>
                          <StatusBadge status={request.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {request.project_title && (
                            <span className="flex items-center gap-1 truncate">
                              <Building2 className="w-3.5 h-3.5" />
                              {request.project_title}
                            </span>
                          )}
                          {request.media_type && (
                            <span className="hidden sm:inline">
                              {MEDIA_TYPE_LABELS[request.media_type]}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

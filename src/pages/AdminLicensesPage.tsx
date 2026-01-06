import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LicenseRequest, RequestStatus, STATUS_LABELS } from "@/types";
import { format } from "date-fns";

const ADMIN_STATUSES: RequestStatus[] = [
  "submitted",
  "in_review",
  "needs_info",
  "approved",
  "awaiting_signature",
  "awaiting_payment",
  "done",
];

export default function AdminLicensesPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<RequestStatus | "all">("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .neq("status", "draft")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.license_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.licensee_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.licensee_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.track_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.song_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.recording_artist?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeStatus === "all" || request.status === activeStatus;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Determine empty state type
  const isFirstTime = requests.length === 0;
  const isFilteredEmpty = !isFirstTime && filteredRequests.length === 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl opacity-0" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-content-fade">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="mb-1">Licenses</h1>
          <p className="text-sm text-muted-foreground">
            All license requests.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, track, License ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={activeStatus} onValueChange={(v) => setActiveStatus(v as RequestStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses ({requests.length})</SelectItem>
              {ADMIN_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                  {statusCounts[status] > 0 && ` (${statusCounts[status]})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isFirstTime ? (
          <div className="py-16">
            <p className="text-sm font-medium mb-1">No license activity yet</p>
            <p className="text-sm text-muted-foreground">
              License requests will appear here once submitted.
            </p>
          </div>
        ) : isFilteredEmpty ? (
          <div className="py-16">
            <p className="text-sm font-medium mb-1">No license requests</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No license requests match your search." : "There's nothing to review right now."}
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[140px_100px_1.2fr_1fr_1fr_100px] gap-4 pb-3 text-xs font-medium text-muted-foreground">
              <span>License ID</span>
              <span>Submitted</span>
              <span>Requester</span>
              <span>Track</span>
              <span>Artist</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            {filteredRequests.map((request) => {
              const requesterName =
                [request.first_name, request.last_name].filter(Boolean).join(" ") ||
                request.licensee_legal_name ||
                "Unknown";
              const trackTitle = request.track_title || request.song_title || "—";
              const submittedDate = request.submitted_at
                ? format(new Date(request.submitted_at), "MMM d, yyyy")
                : "—";

              return (
                <div
                  key={request.id}
                  onClick={() => navigate(`/admin/licenses/${request.id}`)}
                  className="h-14 cursor-pointer hover:bg-muted/[0.03] -mx-2 px-2 rounded-md transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring flex items-center"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/admin/licenses/${request.id}`);
                    }
                  }}
                >
                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[140px_100px_1.2fr_1fr_1fr_100px] gap-4 items-center w-full">
                    <span className="text-xs text-muted-foreground font-mono">{request.license_id || "—"}</span>
                    <span className="text-xs text-muted-foreground">{submittedDate}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{requesterName}</p>
                      {request.organization && (
                        <p className="text-xs text-muted-foreground truncate">{request.organization}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">{trackTitle}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {request.recording_artist || "—"}
                    </span>
                    <StatusBadge status={request.status} />
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between w-full">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{trackTitle}</span>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{requesterName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{request.license_id || submittedDate}</p>
                    </div>
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

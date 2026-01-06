import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LicenseRequest, RequestStatus, STATUS_LABELS } from "@/types";
import { Search, ChevronRight } from "lucide-react";
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

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="mb-1">Licenses</h1>
          <p className="text-sm text-muted-foreground">
            All license requests.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, track, or artist…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
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
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16">
            <p className="text-sm font-medium mb-1">
              {searchQuery ? "No results" : "No license requests"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No license requests match your search." : "New requests will appear here."}
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 pb-3 text-xs font-medium text-muted-foreground border-b border-border/30">
              <span>Submitted</span>
              <span>Requester</span>
              <span>Email</span>
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
                  className="py-3.5 cursor-pointer transition-colors border-b border-border/20 hover:bg-muted/20 -mx-2 px-2 rounded"
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
                  <div className="hidden md:grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 items-center">
                    <span className="text-xs text-muted-foreground">{submittedDate}</span>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{requesterName}</p>
                      {request.organization && (
                        <p className="text-xs text-muted-foreground truncate">{request.organization}</p>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground truncate">
                      {request.licensee_email || "—"}
                    </span>
                    <span className="text-sm truncate">{trackTitle}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {request.recording_artist || "—"}
                    </span>
                    <StatusBadge status={request.status} />
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm truncate">{trackTitle}</span>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">{requesterName}</p>
                      <p className="text-xs text-muted-foreground">{submittedDate}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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

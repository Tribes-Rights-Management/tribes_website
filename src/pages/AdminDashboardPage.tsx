import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LicenseRequest, RequestStatus, STATUS_LABELS } from "@/types";
import { Search, FileText, Eye, AlignJustify } from "lucide-react";
import { format } from "date-fns";

const ADMIN_STATUSES: RequestStatus[] = [
  "submitted",
  "in_review", 
  "needs_info",
  "approved",
  "awaiting_signature",
  "awaiting_payment",
  "done"
];

type Density = "comfortable" | "compact";

const getDensityFromStorage = (): Density => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("admin-queue-density") as Density) || "comfortable";
  }
  return "comfortable";
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdminView } = useAuth();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<RequestStatus>("submitted");
  const [density, setDensity] = useState<Density>(getDensityFromStorage);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-queue-density", density);
  }, [density]);

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
    const matchesSearch = searchQuery === "" || 
      request.licensee_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.licensee_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.track_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.song_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.recording_artist?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = request.status === activeStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rowPadding = density === "compact" ? "py-2" : "py-3.5";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-semibold tracking-tight">TRIBES</span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-sm text-muted-foreground">Admin</span>
            {isAdminView && (
              <span className="flex items-center gap-1 ml-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                <Eye className="w-3 h-3" />
                View Only
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate("/portal")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Exit Admin
          </button>
        </div>
      </header>

      <main className="container flex-1 pt-5 pb-8">
        {/* Title */}
        <h1 className="text-xl font-semibold tracking-tight mb-4">License Queue</h1>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name, email, track, or artist…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-border/50 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Select value={activeStatus} onValueChange={(v) => setActiveStatus(v as RequestStatus)}>
              <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm border-border/50 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_STATUSES.map((status) => (
                  <SelectItem key={status} value={status} className="text-sm">
                    {STATUS_LABELS[status]}
                    {statusCounts[status] > 0 && (
                      <span className="text-muted-foreground ml-1.5">({statusCounts[status]})</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Density Control */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 flex items-center justify-center border border-border/50 rounded-md hover:bg-muted/50 transition-colors">
                  <AlignJustify className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem 
                  onClick={() => setDensity("comfortable")}
                  className={density === "comfortable" ? "bg-muted" : ""}
                >
                  Comfortable
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDensity("compact")}
                  className={density === "compact" ? "bg-muted" : ""}
                >
                  Compact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${rowPadding} border-b border-border/20`}>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">No requests</p>
            <p className="text-xs text-muted-foreground">
              {searchQuery 
                ? "No results for your search." 
                : `No requests with "${STATUS_LABELS[activeStatus]}" status.`}
            </p>
          </div>
        ) : (
          <div>
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 px-2 py-2 text-[11px] uppercase tracking-wider text-muted-foreground/70 border-b border-border/30">
              <span>Submitted</span>
              <span>Requester</span>
              <span>Email</span>
              <span>Track</span>
              <span>Artist</span>
              <span>Status</span>
            </div>

            {/* Table Body */}
            <div>
              {filteredRequests.map((request) => {
                const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "Unknown";
                const trackTitle = request.track_title || request.song_title || "—";
                const artistName = request.recording_artist || "—";
                const submittedDate = request.submitted_at 
                  ? format(new Date(request.submitted_at), "MMM d, yyyy") 
                  : "—";
                
                return (
                  <div 
                    key={request.id} 
                    onClick={() => navigate(`/admin/licenses/${request.id}`)}
                    className={`
                      ${rowPadding} px-2 cursor-pointer transition-colors
                      border-b border-border/20 
                      hover:bg-muted/40
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
                    `}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/admin/licenses/${request.id}`);
                      }
                    }}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-[100px_1.5fr_1fr_1fr_1fr_100px] gap-4 items-center">
                      <span className="text-xs text-muted-foreground">{submittedDate}</span>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{requesterName}</p>
                        {request.organization && (
                          <p className="text-xs text-muted-foreground truncate">{request.organization}</p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground truncate">{request.licensee_email || "—"}</span>
                      <span className="text-sm truncate">{trackTitle}</span>
                      <span className="text-sm text-muted-foreground truncate">{artistName}</span>
                      <div>
                        <StatusBadge status={request.status} />
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{trackTitle}</span>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {requesterName}
                        {request.organization && ` · ${request.organization}`}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{request.licensee_email || "—"}</p>
                      <p className="text-[11px] text-muted-foreground/70">{submittedDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 mt-auto">
        <div className="container text-center text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

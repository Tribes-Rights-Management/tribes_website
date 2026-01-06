import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LicenseRequest, RequestStatus, STATUS_LABELS } from "@/types";
import { Search, FileText, Music2, Calendar, Building2, ChevronRight, Eye, Mail, User } from "lucide-react";
import { format } from "date-fns";

// Active statuses for admin filtering (excluding draft and legacy statuses)
const ADMIN_STATUSES: RequestStatus[] = [
  "submitted",
  "in_review", 
  "needs_info",
  "approved",
  "awaiting_signature",
  "awaiting_payment",
  "done"
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdminView, isSuperAdmin } = useAuth();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<RequestStatus>("submitted");

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

  // Filter by search and status
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

  // Count by status
  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

      <main className="container flex-1 pt-6 pb-8">
        {/* Title */}
        <h1 className="text-xl font-semibold tracking-tight mb-5">License Queue</h1>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name, email, track, or artist…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border-border/60 bg-background"
            />
          </div>
          <Select value={activeStatus} onValueChange={(v) => setActiveStatus(v as RequestStatus)}>
            <SelectTrigger className="w-full sm:w-[220px] h-9 text-sm border-border/60 bg-background">
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
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-4 border-b border-border/30">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="No requests" 
            description={`No requests with "${STATUS_LABELS[activeStatus]}" status.`} 
          />
        ) : (
          <div className="divide-y divide-border/30">
            {filteredRequests.map((request) => {
              const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "Unknown";
              const trackTitle = request.track_title || request.song_title || "Untitled";
              
              return (
                <div 
                  key={request.id} 
                  className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded transition-colors" 
                  onClick={() => navigate(`/admin/licenses/${request.id}`)}
                >
                  {/* Icon */}
                  <div className="h-9 w-9 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{trackTitle}</span>
                      <StatusBadge status={request.status} />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy") : "—"}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3" />
                        {requesterName}
                      </span>
                      {request.organization && (
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3" />
                          {request.organization}
                        </span>
                      )}
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3" />
                        {request.licensee_email || "—"}
                      </span>
                      {request.recording_artist && (
                        <span className="truncate">Artist: {request.recording_artist}</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                </div>
              );
            })}
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

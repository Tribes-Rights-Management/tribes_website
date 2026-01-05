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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">TRIBES</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm font-medium">Admin Console</span>
            {isAdminView && (
              <Badge variant="secondary" className="flex items-center gap-1 ml-2">
                <Eye className="w-3 h-3" />
                View Only
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/portal")}>
            Exit Admin
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-6 flex-1">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">License Queue</h1>
          <p className="text-muted-foreground text-sm">
            {isSuperAdmin ? "Manage all license requests" : "View all license requests (read-only)"}
          </p>
        </div>

        {/* Status Tabs */}
        <Tabs value={activeStatus} onValueChange={(v) => setActiveStatus(v as RequestStatus)}>
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
            {ADMIN_STATUSES.map((status) => (
              <TabsTrigger 
                key={status} 
                value={status} 
                className="data-[state=active]:bg-secondary px-3 py-1.5 text-sm"
              >
                {STATUS_LABELS[status]}
                {statusCounts[status] > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-muted">
                    {statusCounts[status]}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, track, or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="No requests" 
            description={`No requests with "${STATUS_LABELS[activeStatus]}" status.`} 
          />
        ) : (
          <div className="space-y-2">
            {filteredRequests.map((request) => {
              const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "Unknown";
              const trackTitle = request.track_title || request.song_title || "Untitled";
              
              return (
                <Card 
                  key={request.id} 
                  className="cursor-pointer hover:bg-secondary/30 transition-colors" 
                  onClick={() => navigate(`/admin/licenses/${request.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Music2 className="w-5 h-5 text-muted-foreground" />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{trackTitle}</h3>
                          <StatusBadge status={request.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            {request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy") : "—"}
                          </span>
                          <span className="flex items-center gap-1.5 truncate">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            {requesterName}
                          </span>
                          {request.organization && (
                            <span className="flex items-center gap-1.5 truncate">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                              {request.organization}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            {request.licensee_email || "—"}
                          </span>
                        </div>

                        {request.recording_artist && (
                          <p className="text-sm text-muted-foreground">
                            Artist: {request.recording_artist}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

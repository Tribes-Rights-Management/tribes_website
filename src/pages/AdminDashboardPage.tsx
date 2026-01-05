import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LicenseRequest, RequestStatus, STATUS_LABELS, MEDIA_TYPE_LABELS } from "@/types";
import { Search, FileText, Music2, Calendar, Building2, ChevronRight, Filter, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statuses: RequestStatus[] = ["submitted", "in_review", "needs_info", "approved", "sent_for_signature", "executed", "closed"];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdminView, isSuperAdmin } = useAuth();
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
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

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchQuery === "" || 
      request.licensee_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.project_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.song_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
              {isAdminView && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View Only
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {isSuperAdmin ? "Manage all license requests" : "View all license requests (read-only)"}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["submitted", "in_review", "approved", "sent_for_signature"].map(status => (
            <Card key={status} className="cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => setStatusFilter(status)}>
              <CardContent className="p-4">
                <p className="text-2xl font-semibold">{statusCounts[status] || 0}</p>
                <p className="text-xs text-muted-foreground">{STATUS_LABELS[status as RequestStatus]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by licensee, project, or song..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{STATUS_LABELS[status]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <EmptyState icon={FileText} title="No requests found" description="No requests match your filters." />
        ) : (
          <div className="space-y-2">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="card-interactive cursor-pointer" onClick={() => navigate(`/admin/request/${request.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{request.song_title || request.project_title || "Untitled"}</h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {request.licensee_legal_name && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{request.licensee_legal_name}</span>}
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

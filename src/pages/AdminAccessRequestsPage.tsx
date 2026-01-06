import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check, X, Users } from "lucide-react";
import { format } from "date-fns";

interface PendingProfile {
  id: string;
  email: string;
  name: string | null;
  account_status: string;
  created_at: string;
}

export default function AdminAccessRequestsPage() {
  const navigate = useNavigate();
  const { isSuperAdmin, isAdminView } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  async function fetchPendingProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, account_status, created_at")
        .eq("account_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast({ title: "Error", description: "Failed to load access requests", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(profileId: string) {
    if (!isSuperAdmin) return;
    
    setProcessingId(profileId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          account_status: "active",
          approved_at: new Date().toISOString(),
        })
        .eq("id", profileId);

      if (error) throw error;
      
      toast({ title: "Approved", description: "User has been granted access." });
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      console.error("Error approving user:", error);
      toast({ title: "Error", description: "Failed to approve user", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(profileId: string) {
    if (!isSuperAdmin) return;
    
    setProcessingId(profileId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ account_status: "rejected" })
        .eq("id", profileId);

      if (error) throw error;
      
      toast({ title: "Rejected", description: "Access request has been rejected." });
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({ title: "Error", description: "Failed to reject user", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold tracking-tight">TRIBES</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm text-muted-foreground">Admin</span>
            {isAdminView && (
              <span className="flex items-center gap-1 ml-1.5 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                <Eye className="w-3 h-3" />
                View Only
              </span>
            )}
          </div>
          <button 
            onClick={() => navigate("/admin")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Queue
          </button>
        </div>
      </header>

      <main className="container flex-1 py-8">
        <h1 className="mb-6">Access Requests</h1>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No pending requests</p>
            <p className="text-xs text-muted-foreground">
              New access requests will appear here.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_140px] gap-4 px-1 pb-3 text-xs font-medium text-muted-foreground border-b border-border/30">
              <span>Name</span>
              <span>Email</span>
              <span>Requested</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {profiles.map((profile) => (
              <div 
                key={profile.id} 
                className="py-4 px-1 border-b border-border/20"
              >
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_140px] gap-4 items-center">
                  <span className="text-sm">{profile.name || "—"}</span>
                  <span className="text-sm text-muted-foreground truncate">{profile.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(profile.created_at), "MMM d, yyyy")}
                  </span>
                  <div className="flex gap-2 justify-end">
                    {isSuperAdmin ? (
                      <>
                        <button
                          onClick={() => handleApprove(profile.id)}
                          disabled={processingId === profile.id}
                          className="h-8 px-3 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(profile.id)}
                          disabled={processingId === profile.id}
                          className="h-8 px-3 text-xs border border-border text-muted-foreground rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">View only</span>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{profile.name || "—"}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(profile.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  {isSuperAdmin && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(profile.id)}
                        disabled={processingId === profile.id}
                        className="flex-1 h-8 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(profile.id)}
                        disabled={processingId === profile.id}
                        className="flex-1 h-8 text-xs border border-border text-muted-foreground rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-4 mt-auto">
        <div className="container text-center text-xs text-muted-foreground">
          © 2026 Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
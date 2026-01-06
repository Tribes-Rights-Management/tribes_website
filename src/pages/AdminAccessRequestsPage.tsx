import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface PendingProfile {
  id: string;
  email: string;
  name: string | null;
  account_status: string;
  created_at: string;
}

export default function AdminAccessRequestsPage() {
  const { isSuperAdmin } = useAuth();
  const { toast } = useToast();

  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingProfile, setRejectingProfile] = useState<PendingProfile | null>(null);
  const [approvingProfile, setApprovingProfile] = useState<PendingProfile | null>(null);

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

  async function confirmApprove() {
    if (!isSuperAdmin || !approvingProfile) return;

    setProcessingId(approvingProfile.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          account_status: "active",
          approved_at: new Date().toISOString(),
        })
        .eq("id", approvingProfile.id);

      if (error) throw error;

      setProfiles((prev) => prev.filter((p) => p.id !== approvingProfile.id));
    } catch (error) {
      console.error("Error approving user:", error);
      toast({ title: "Error", description: "Failed to approve user", variant: "destructive" });
    } finally {
      setProcessingId(null);
      setApprovingProfile(null);
    }
  }

  async function confirmReject() {
    if (!isSuperAdmin || !rejectingProfile) return;

    setProcessingId(rejectingProfile.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ account_status: "rejected" })
        .eq("id", rejectingProfile.id);

      if (error) throw error;

      setProfiles((prev) => prev.filter((p) => p.id !== rejectingProfile.id));
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({ title: "Error", description: "Failed to reject user", variant: "destructive" });
    } finally {
      setProcessingId(null);
      setRejectingProfile(null);
    }
  }

  return (
    <DashboardLayout>
      {/* Approval Confirmation Dialog */}
      <AlertDialog open={!!approvingProfile} onOpenChange={(open) => !open && setApprovingProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will allow the user to sign in and access Tribes Rights Licensing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Confirmation Dialog */}
      <AlertDialog open={!!rejectingProfile} onOpenChange={(open) => !open && setRejectingProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject access request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent the user from accessing Tribes Rights Licensing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="mb-1">Access Requests</h1>
          <p className="text-sm text-muted-foreground">
            Users requesting access to Tribes Rights Licensing.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-16">
            <p className="text-sm font-medium mb-1">No access requests</p>
            <p className="text-sm text-muted-foreground">
              New requests will appear here when submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_140px] gap-4 pb-3 text-xs font-medium text-muted-foreground">
              <span>Name</span>
              <span>Email</span>
              <span>Requested</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="h-14 hover:bg-muted/[0.03] -mx-2 px-2 rounded-md transition-colors flex items-center"
              >
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_140px] gap-4 items-center w-full">
                  <span className="text-sm font-medium">{profile.name || "—"}</span>
                  <span className="text-xs text-muted-foreground truncate">{profile.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(profile.created_at), "MMM d, yyyy")}
                  </span>
                  <div className="flex gap-2 justify-end">
                    {isSuperAdmin ? (
                      <>
                        <button
                          onClick={() => setApprovingProfile(profile)}
                          disabled={processingId === profile.id}
                          className="h-8 px-3 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingProfile(profile)}
                          disabled={processingId === profile.id}
                          className="h-8 px-3 text-xs border border-border text-muted-foreground rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">View only</span>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{profile.name || "—"}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(profile.created_at), "MMM d")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  {isSuperAdmin && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setApprovingProfile(profile)}
                        disabled={processingId === profile.id}
                        className="flex-1 h-8 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingProfile(profile)}
                        disabled={processingId === profile.id}
                        className="flex-1 h-8 text-xs border border-border text-muted-foreground rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
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

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  company: string | null;
  country: string | null;
  company_type: string | null;
  notify_license_status: boolean;
  notify_signature_payment: boolean;
  notify_admin_announcements: boolean;
  last_sign_in_at: string | null;
  org_reply_to_email: string | null;
  org_admin_notification_email: string | null;
}

interface AuditLogEntry {
  id: string;
  created_at: string;
  action: string;
  target_email: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin_view: "Admin",
  user: "User",
};

const COMPANY_TYPE_LABELS: Record<string, string> = {
  indie_church: "Indie / Church",
  commercial: "Commercial",
  broadcast: "Broadcast",
};

const ACTION_LABELS: Record<string, string> = {
  access_request_approved: "Access request approved",
  access_request_rejected: "Access request rejected",
  license_submitted: "License request submitted",
  license_approved: "License approved",
  license_executed: "License executed",
};

export default function SettingsPage() {
  const { user, profile: authProfile, signOut, isSuperAdmin, isAnyAdmin } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showSignOutAllDialog, setShowSignOutAllDialog] = useState(false);

  // Editable org settings
  const [replyToEmail, setReplyToEmail] = useState("");
  const [adminNotificationEmail, setAdminNotificationEmail] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      if (isSuperAdmin) {
        fetchAuditLog();
      }
    }
  }, [user?.id, isSuperAdmin]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setReplyToEmail(data.org_reply_to_email || "");
      setAdminNotificationEmail(data.org_admin_notification_email || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAuditLog() {
    try {
      const { data, error } = await supabase
        .from("audit_log")
        .select("id, created_at, action, target_email")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLog(data || []);
    } catch (error) {
      console.error("Error fetching audit log:", error);
    }
  }

  async function updateNotificationPreference(field: string, value: boolean) {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ [field]: value })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, [field]: value } : null);
    } catch (error) {
      console.error("Error updating preference:", error);
      toast({ title: "Error", description: "Failed to save preference", variant: "destructive" });
    }
  }

  async function saveOrgSettings() {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          org_reply_to_email: replyToEmail || null,
          org_admin_notification_email: adminNotificationEmail || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile((prev) => prev ? {
        ...prev,
        org_reply_to_email: replyToEmail || null,
        org_admin_notification_email: adminNotificationEmail || null,
      } : null);

      toast({ title: "Settings saved" });
    } catch (error) {
      console.error("Error saving org settings:", error);
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
  }

  async function handleSignOutAll() {
    try {
      await supabase.auth.signOut({ scope: "global" });
      toast({ title: "Signed out of all sessions" });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ title: "Error", description: "Failed to sign out", variant: "destructive" });
    }
    setShowSignOutAllDialog(false);
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl opacity-0" />
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl py-16">
          <p className="text-sm text-muted-foreground">
            Account settings will appear here as features are enabled.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const lastSignIn = user?.last_sign_in_at || profile.last_sign_in_at;

  return (
    <DashboardLayout>
      {/* Sign Out Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of this session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign Out All Dialog */}
      <AlertDialog open={showSignOutAllDialog} onOpenChange={setShowSignOutAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all sessions</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign you out of all devices and browsers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOutAll}>Sign out all</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-2xl animate-content-fade">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>

        <div className="space-y-12">
          {/* Account Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Account</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Full name</p>
                <p className="text-sm">{profile.name || "—"}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Email address</p>
                <p className="text-sm">{profile.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Used for login and notifications</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                <p className="text-sm">{ROLE_LABELS[profile.role] || profile.role}</p>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Notifications</h2>
            
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={profile.notify_license_status}
                  onCheckedChange={(checked) => 
                    updateNotificationPreference("notify_license_status", checked === true)
                  }
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm">License status updates</p>
                  <p className="text-xs text-muted-foreground">Receive emails when license requests change status</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={profile.notify_signature_payment}
                  onCheckedChange={(checked) => 
                    updateNotificationPreference("notify_signature_payment", checked === true)
                  }
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm">Signature & payment confirmations</p>
                  <p className="text-xs text-muted-foreground">Receive emails for signature and payment events</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={profile.notify_admin_announcements}
                  onCheckedChange={(checked) => 
                    updateNotificationPreference("notify_admin_announcements", checked === true)
                  }
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm">Administrative announcements</p>
                  <p className="text-xs text-muted-foreground">Receive important updates about Tribes Rights Licensing</p>
                </div>
              </label>
            </div>
          </section>

          {/* Organization Section - Admin only */}
          {isAnyAdmin && (
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Legal entity name</p>
                  <p className="text-sm">Tribes Rights Management LLC</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Country</p>
                  <p className="text-sm">United States</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Business type</p>
                  <p className="text-sm">Music Rights Administration</p>
                </div>

                {isSuperAdmin && (
                  <>
                    <div className="pt-4 space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Default license reply-to email
                        </label>
                        <Input
                          type="email"
                          placeholder="licensing@tribesrights.com"
                          value={replyToEmail}
                          onChange={(e) => setReplyToEmail(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Default admin notification email
                        </label>
                        <Input
                          type="email"
                          placeholder="admin@tribesrights.com"
                          value={adminNotificationEmail}
                          onChange={(e) => setAdminNotificationEmail(e.target.value)}
                        />
                      </div>
                      
                      <button
                        onClick={saveOrgSettings}
                        disabled={isSaving}
                        className="text-sm text-foreground hover:text-foreground/80 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving…" : "Save changes"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Security Section */}
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">Security</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Authentication method</p>
                <p className="text-sm">Email magic link</p>
              </div>
              
              {lastSignIn && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Last sign in</p>
                  <p className="text-sm">
                    {format(new Date(lastSignIn), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}
              
              <div className="pt-2">
                <button
                  onClick={() => setShowSignOutAllDialog(true)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign out of all sessions
                </button>
              </div>
            </div>
          </section>

          {/* Audit & Compliance Section - Super Admin only */}
          {isSuperAdmin && (
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">Audit & Compliance</h2>
              
              {auditLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">No audit events recorded.</p>
              ) : (
                <div className="space-y-3">
                  {auditLog.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="text-sm">
                      <p>
                        {ACTION_LABELS[entry.action] || entry.action}
                        {entry.target_email && (
                          <span className="text-muted-foreground"> — {entry.target_email}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  ))}
                  
                  {auditLog.length > 10 && (
                    <p className="text-xs text-muted-foreground pt-2">
                      Showing 10 of {auditLog.length} events
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Sign Out - Bottom of page */}
          <section className="pt-4 border-t border-border/50">
            <button
              onClick={() => setShowSignOutDialog(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign out
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

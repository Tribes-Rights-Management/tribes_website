import { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getCopyrightLine } from "@/lib/copyright";
import { usePolicyAcknowledgment } from "@/hooks/usePolicyAcknowledgment";
import { PolicyAcknowledgmentScreen } from "@/components/admin/PolicyAcknowledgmentScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

function PendingApprovalPage() {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2">Pending approval</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your access request is under review.<br />
            You'll receive an email once it's approved.
          </p>
          <button
            onClick={() => signOut()}
            className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RejectedPage() {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2">Access unavailable</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your access request was not approved.
          </p>
          <button
            onClick={() => signOut()}
            className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function UnauthorizedPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-2">Access restricted</h1>
          <p className="text-sm text-muted-foreground mb-8">
            You don't have permission to view this page.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center">
      <p className="text-xs text-muted-foreground">
        {getCopyrightLine()}
      </p>
    </footer>
  );
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false 
}: ProtectedRouteProps) {
  const { user, isAnyAdmin, isSuperAdmin, isActiveUser, isLoading, accountStatus, role } = useAuth();
  const location = useLocation();
  
  const { 
    hasAcknowledged, 
    isLoading: isPolicyLoading, 
    isSubmitting,
    acknowledgePolicy,
    requiresAcknowledgment 
  } = usePolicyAcknowledgment(user?.id, role);

  if (isLoading || isPolicyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check account status - pending users can't access portal
  if (!isActiveUser) {
    if (accountStatus === "pending") {
      return <PendingApprovalPage />;
    }
    if (accountStatus === "rejected") {
      return <RejectedPage />;
    }
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    return <UnauthorizedPage />;
  }

  // Check any admin requirement (super_admin or admin_view)
  if (requireAdmin && !isAnyAdmin) {
    return <UnauthorizedPage />;
  }

  // For admin routes, check policy acknowledgment
  if (requireAdmin && requiresAcknowledgment) {
    return (
      <PolicyAcknowledgmentScreen 
        onAcknowledge={acknowledgePolicy}
        isSubmitting={isSubmitting}
      />
    );
  }

  return <>{children}</>;
}
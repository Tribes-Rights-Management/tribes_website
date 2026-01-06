import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { ROLE_LABELS } from "@/types";

/**
 * AccountMenu - System-wide account navigation component
 * 
 * This is the ONLY authorized location for account-level actions.
 * All authenticated routes must use this component via DashboardLayout.
 * 
 * UI Contract:
 * - Sign out MUST NOT appear in sidebars or other navigation
 * - Menu order is fixed: Session Info → Account → Notifications → Security → Divider → Sign out
 * - Sign out styling is neutral (not destructive/red)
 */
export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, role, signOut, isAnyAdmin } = useAuth();

  const initials = getInitials(profile?.name || profile?.email || "U");
  const displayName = profile?.name || "User";
  const displayEmail = profile?.email || "";
  const displayRole = isAnyAdmin && role ? ROLE_LABELS[role] : null;

  async function handleSignOut() {
    await signOut();
    navigate("/auth");
  }

  function handleNavigate(path: string) {
    navigate(path);
  }

  const basePath = isAnyAdmin ? "/admin" : "/portal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-[13px] font-medium text-muted-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background border border-border/40 shadow-lg rounded-lg p-1"
      >
        {/* Session Indicator - Informational only */}
        <div className="px-3 py-2.5 select-none">
          <p className="text-[13px] font-medium text-foreground truncate">
            {displayName}
          </p>
          <p className="text-[12px] text-muted-foreground truncate mt-0.5">
            {displayEmail}
          </p>
          {displayRole && (
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              {displayRole}
            </p>
          )}
        </div>
        
        <DropdownMenuSeparator className="my-1 bg-border/40" />
        
        {/* Navigation Actions */}
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/account`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/notifications`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/security`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Security
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-1 bg-border/40" />
        
        {/* Sign Out - Neutral styling, no confirmation */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="h-9 px-3 text-[13px] text-muted-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

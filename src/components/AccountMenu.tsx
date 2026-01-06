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
import { format } from "date-fns";

/**
 * AccountMenu - CANONICAL SYSTEM-WIDE NAVIGATION PATTERN
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION CONTRACT — DO NOT MODIFY WITHOUT GOVERNANCE REVIEW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component is the ONLY authorized location for account-level actions.
 * All authenticated routes (User, Admin, Super Admin) must use this pattern.
 * 
 * LOCKED MENU STRUCTURE:
 * ┌─────────────────────────┐
 * │ Signed in as            │  ← Session indicator (non-interactive)
 * │ [Full Name]             │
 * │ [Email Address]         │
 * │ [Role - Admin only]     │
 * │ Last signed in: ...     │  ← Enterprise session context
 * │ Session expires after...│  ← Security notice
 * ├─────────────────────────┤
 * │ Account                 │  ← Navigation actions
 * │ Notifications           │
 * │ Security                │
 * ├─────────────────────────┤
 * │ Sign out                │  ← Always last, neutral styling
 * └─────────────────────────┘
 * 
 * FORBIDDEN MODIFICATIONS:
 * - Sign out MUST NOT appear in sidebars or other navigation
 * - No items may appear above the session indicator
 * - Menu order is fixed and may not be reordered
 * - Session indicator may not be hidden based on role
 * - Sign out may not be relocated to secondary menus
 * - Sign out styling must remain neutral (never destructive/red)
 * 
 * DESIGN PRINCIPLES:
 * - Identity confirmation, not navigation
 * - No avatar, icons, or color emphasis in session block
 * - Typography communicates hierarchy, not decoration
 * - Zero animation flourish
 * - Neutral, institutional tone
 * 
 * This pattern aligns with Apple, Stripe, and enterprise SaaS standards.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Session timeout in minutes - must match backend configuration */
const SESSION_TIMEOUT_MINUTES = 30;

export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, role, signOut, isAnyAdmin } = useAuth();

  const initials = getInitials(profile?.name || profile?.email || "U");
  const displayName = profile?.name || "User";
  const displayEmail = profile?.email || "";
  const displayRole = isAnyAdmin && role ? ROLE_LABELS[role] : null;
  
  // Format last sign in timestamp
  const lastSignIn = profile?.last_sign_in_at 
    ? format(new Date(profile.last_sign_in_at), "MMM d, yyyy 'at' h:mm a")
    : null;

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
        className="w-64 bg-background border border-border/40 shadow-lg rounded-lg p-1"
      >
        {/* ═══════════════════════════════════════════════════════════════════
            SESSION CONTEXT BLOCK - Non-interactive, informational only
            This block MUST remain at the top and cannot be reordered.
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="px-3 py-2.5 select-none pointer-events-none">
          {/* Identity Context */}
          <p className="text-[11px] text-muted-foreground/60 mb-1">
            Signed in as
          </p>
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
          
          {/* Enterprise Session Context */}
          <div className="mt-3 pt-2 border-t border-border/30">
            {lastSignIn && (
              <p className="text-[11px] text-muted-foreground/60">
                Last signed in: {lastSignIn}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">
              Session expires after {SESSION_TIMEOUT_MINUTES} minutes of inactivity
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator className="my-1 bg-border/40" />
        
        {/* ═══════════════════════════════════════════════════════════════════
            NAVIGATION ACTIONS - Fixed order, no reordering allowed
            ═══════════════════════════════════════════════════════════════════ */}
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
        
        {/* ═══════════════════════════════════════════════════════════════════
            SIGN OUT - Must always be last, neutral styling (never red)
            ═══════════════════════════════════════════════════════════════════ */}
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

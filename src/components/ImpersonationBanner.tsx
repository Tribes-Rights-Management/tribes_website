import { useAuth } from "@/contexts/AuthContext";

/**
 * ImpersonationBanner - ADMIN IMPERSONATION INDICATOR
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SECURITY CONTRACT — DO NOT MODIFY WITHOUT GOVERNANCE REVIEW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This banner displays ONLY when an Admin or Super Admin is impersonating
 * another user. It is a critical security and audit component.
 * 
 * REQUIREMENTS:
 * - Persistent banner at the top of the interface, above all content
 * - Visible on every page while impersonation is active
 * - Cannot be dismissed
 * - Automatically disappears when impersonation ends
 * - Must be impossible to hide via CSS or layout changes
 * 
 * AUDIT REQUIREMENTS:
 * All actions taken during impersonation must be logged with:
 * - Impersonating admin ID
 * - Target user ID
 * - Timestamp
 * - Action performed
 * 
 * DESIGN PRINCIPLES:
 * - High contrast relative to rest of UI (but not destructive/red)
 * - Clear, informational copy
 * - No animation or dismissal option
 * - Neutral, institutional tone
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface ImpersonationBannerProps {
  /** Email of the user being impersonated */
  impersonatedUserEmail?: string | null;
  /** Whether impersonation mode is currently active */
  isImpersonating?: boolean;
}

export function ImpersonationBanner({ 
  impersonatedUserEmail, 
  isImpersonating = false 
}: ImpersonationBannerProps) {
  // Don't render if not impersonating
  if (!isImpersonating || !impersonatedUserEmail) {
    return null;
  }

  return (
    <div 
      className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2 select-none"
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <p className="text-[13px] text-amber-900">
          <span className="font-medium">You are viewing this account as:</span>{" "}
          <span className="font-mono">{impersonatedUserEmail}</span>
        </p>
        <span className="text-amber-600 text-[11px]">
          All actions are logged as impersonation.
        </span>
      </div>
    </div>
  );
}

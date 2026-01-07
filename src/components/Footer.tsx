/**
 * Footer — Single Source of Truth for All Footer Implementations
 * 
 * Variants:
 * - "minimal": Simple centered copyright for auth/status screens
 * - "app": Light footer with border for dashboard/portal
 * - "terminal": Dark footer for marketing pages (part of terminal zone)
 * 
 * CHANGELOG:
 * - Created as canonical footer component
 * - Replaces all inline footer markup across the codebase
 * - Uses LegalRow for consistent copyright + links
 */

import { LegalRow } from "@/components/LegalRow";
import { getCopyrightLine } from "@/lib/copyright";

interface FooterProps {
  /** Footer variant */
  variant?: "minimal" | "app" | "terminal";
  /** Additional className for the footer element */
  className?: string;
}

export function Footer({ variant = "minimal", className = "" }: FooterProps) {
  // Minimal: copyright + Privacy/Terms only (account request screens)
  if (variant === "minimal") {
    return (
      <footer className={`py-8 ${className}`}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <LegalRow variant="light" showBrand={false} />
        </div>
      </footer>
    );
  }

  // App: light footer with top border (dashboard)
  if (variant === "app") {
    return (
      <footer className={`px-8 py-4 border-t border-border/40 ${className}`}>
        <LegalRow variant="light" showBrand={false} />
      </footer>
    );
  }

  // Terminal: dark footer for marketing (no CTA, just legal row)
  return (
    <footer 
      className={`bg-[#111214] pt-12 pb-10 md:pt-16 md:pb-12 ${className}`}
      data-surface="dark"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <LegalRow variant="dark" showBrand={true} />
      </div>
    </footer>
  );
}

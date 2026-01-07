/**
 * LegalRow — Single Source of Truth for Copyright + Legal Links
 * 
 * Used across all footers (marketing, auth, app dashboard).
 * Supports dark and light variants via the `variant` prop.
 * 
 * CHANGELOG:
 * - Created as canonical legal row component
 * - Dynamic copyright year via getCopyrightLine()
 * - Consistent link order: Privacy, Terms, Contact
 */

import { Link } from "react-router-dom";
import { getCopyrightLine } from "@/lib/copyright";
import { BRAND } from "@/lib/brand";

interface LegalRowProps {
  /** Visual variant: "dark" for marketing/terminal zone, "light" for app UI */
  variant?: "dark" | "light";
  /** Show brand wordmark above copyright */
  showBrand?: boolean;
}

export function LegalRow({ variant = "light", showBrand = true }: LegalRowProps) {
  const copyrightText = getCopyrightLine();

  if (variant === "dark") {
    return (
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* Left: Brand + Copyright */}
        <div className="flex flex-col gap-1.5">
          {showBrand && (
            <p 
              className="text-[#8C8C8C] tracking-tight"
              style={{ fontSize: 12 }}
            >
              {BRAND.wordmark}
            </p>
          )}
          <p 
            className="text-[#8C8C8C] leading-relaxed"
            style={{ fontSize: 11 }}
          >
            {copyrightText}
          </p>
        </div>
        
        {/* Right: Legal links */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <Link 
            to="/our-approach" 
            className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
            style={{ fontSize: 12 }}
          >
            Our Approach
          </Link>
          <Link 
            to="/how-publishing-administration-works" 
            className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
            style={{ fontSize: 12 }}
          >
            How Publishing Administration Works
          </Link>
          <Link 
            to="/privacy" 
            className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
            style={{ fontSize: 12 }}
          >
            Privacy
          </Link>
          <Link 
            to="/terms" 
            className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
            style={{ fontSize: 12 }}
          >
            Terms
          </Link>
          <Link 
            to="/contact" 
            className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
            style={{ fontSize: 12 }}
          >
            Contact
          </Link>
        </div>
      </div>
    );
  }

  // Light variant (app/dashboard)
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Left: Copyright */}
      <p className="text-xs text-muted-foreground">
        {copyrightText}
      </p>
      
      {/* Right: Legal links */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link 
          to="/our-approach" 
          className="text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-muted-foreground"
        >
          Our Approach
        </Link>
        <Link 
          to="/how-publishing-administration-works" 
          className="text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-muted-foreground"
        >
          How Publishing Administration Works
        </Link>
        <Link
          to="/privacy" 
          className="text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-muted-foreground"
        >
          Privacy
        </Link>
        <Link 
          to="/terms" 
          className="text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-muted-foreground"
        >
          Terms
        </Link>
        <Link 
          to="/contact" 
          className="text-xs text-muted-foreground/60 transition-colors duration-150 hover:text-muted-foreground"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

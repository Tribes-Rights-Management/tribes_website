import { ReactNode } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG } from "@/lib/theme";

/**
 * FORM PAGE LAYOUT — GLOBAL STANDARD (LOCKED)
 * 
 * This component enforces the institutional form layout standard
 * for all public form pages (licensing access, service inquiry, contact).
 * 
 * Typography scale (locked):
 * - H1: 32px mobile / 40px desktop, semibold, -0.015em tracking (inherited from global)
 * - Lede: 15px, muted-foreground, relaxed line-height
 * 
 * Spacing (locked):
 * - Header to content: pt-12 (same as ContentPageLayout)
 * - H1 to lede: mb-3 (12px)
 * - Lede to form: mb-8 (32px)
 * 
 * Width: max-w-[480px] for form density
 * 
 * DARK VARIANT:
 * - Used for transactional pages that should match dark marketing aesthetic
 * - Background: #0A0A0A, inputs: #1A1A1A with #303030 borders
 * 
 * NO page-specific overrides allowed.
 */

interface FormPageLayoutProps {
  children: ReactNode;
  /** Page title - renders as locked H1 */
  title: string;
  /** Page lede/subtitle - renders below H1 with locked styling */
  lede?: string;
  /** Dark theme variant for pages like licensing account */
  dark?: boolean;
}

export function FormPageLayout({ children, title, lede, dark = false }: FormPageLayoutProps) {
  return (
    <PublicLayout darkBackground={dark}>
      <section 
        className="pt-12 pb-16 md:pb-24"
        style={dark ? { backgroundColor: THEME_DARK_BG } : undefined}
        data-theme={dark ? "dark" : "light"}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            {/* H1 — Locked typography from index.css */}
            <h1 className={dark ? "text-[#FFFFFF] mb-3" : "text-foreground mb-3"}>
              {title}
            </h1>
            {/* Lede — 15px, muted, mb-8 to form */}
            {lede && (
              <p className={`text-[15px] leading-relaxed mb-8 ${dark ? "text-[#C7C7C7]" : "text-muted-foreground"}`}>
                {lede}
              </p>
            )}
            {/* Form content */}
            {children}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

/**
 * FORM SUCCESS LAYOUT — GLOBAL STANDARD (LOCKED)
 * 
 * Institutional success/confirmation state for form submissions.
 * No celebratory language. Clean, procedural confirmation.
 */

interface FormSuccessLayoutProps {
  /** Success headline */
  title: string;
  /** Success message */
  message: string;
  /** Optional link back */
  children?: ReactNode;
  /** Dark theme variant */
  dark?: boolean;
}

export function FormSuccessLayout({ title, message, children, dark = false }: FormSuccessLayoutProps) {
  return (
    <PublicLayout darkBackground={dark}>
      <section 
        className="pt-12 pb-16 md:pb-24"
        style={dark ? { backgroundColor: THEME_DARK_BG } : undefined}
        data-theme={dark ? "dark" : "light"}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            <h1 className={dark ? "text-[#FFFFFF] mb-3" : "text-foreground mb-3"}>
              {title}
            </h1>
            <p className={`text-[15px] leading-relaxed mb-6 ${dark ? "text-[#C7C7C7]" : "text-muted-foreground"}`}>
              {message}
            </p>
            {children}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

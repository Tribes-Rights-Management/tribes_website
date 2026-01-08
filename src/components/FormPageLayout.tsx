import { ReactNode } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";

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
 * NO page-specific overrides allowed.
 */

interface FormPageLayoutProps {
  children: ReactNode;
  /** Page title - renders as locked H1 */
  title: string;
  /** Page lede/subtitle - renders below H1 with locked styling */
  lede?: string;
}

export function FormPageLayout({ children, title, lede }: FormPageLayoutProps) {
  return (
    <PublicLayout>
      <section className="pt-12 pb-16 md:pb-24">
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            {/* H1 — Locked typography from index.css */}
            <h1 className="text-foreground mb-3">
              {title}
            </h1>
            {/* Lede — 15px, muted, mb-8 to form */}
            {lede && (
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
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
}

export function FormSuccessLayout({ title, message, children }: FormSuccessLayoutProps) {
  return (
    <PublicLayout>
      <section className="pt-12 pb-16 md:pb-24">
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            <h1 className="text-foreground mb-3">
              {title}
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              {message}
            </p>
            {children}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

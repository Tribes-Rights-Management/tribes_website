import { ReactNode } from "react";
import { PublicLayout } from "@/components/PublicLayout";

interface ContentPageLayoutProps {
  children: ReactNode;
  /** Optional footer variant passed to PublicLayout */
  footerVariant?: "full" | "minimal";
}

/**
 * ContentPageLayout — Global Institutional Page Standard
 * 
 * Use for all text-heavy institutional pages:
 * - Services, Our Approach, How Administration Works
 * - Privacy Policy, Terms of Use
 * - Any policy, documentation, or process pages
 * 
 * Layout rules:
 * - LEFT-ALIGNED content column (no centering)
 * - Consistent max-width: 1120px outer container
 * - Reading column: 560px max-width
 * - Consistent gutters: 24px mobile, 40px tablet, 64px desktop
 * - Proper header clearance via pt-[calc(64px+env(safe-area-inset-top)+24px)]
 */
export function ContentPageLayout({ children, footerVariant = "full" }: ContentPageLayoutProps) {
  return (
    <PublicLayout footerVariant={footerVariant}>
      <article 
        className="pt-[calc(64px+env(safe-area-inset-top)+24px)] pb-16 md:pt-[calc(64px+40px)] md:pb-24"
      >
        <div className="max-w-[1120px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[560px]">
            {children}
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}

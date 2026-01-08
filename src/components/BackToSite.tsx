import { ArrowLeft } from "lucide-react";
import { getMarketingSiteUrl, isPreviewEnvironment } from "@/lib/domains";

/**
 * BackToSite Component
 * 
 * Displays a link back to the main marketing site.
 * Used in the app subdomain to allow users to navigate back.
 * 
 * In preview environments, this links to the root path.
 * In production, this links to the marketing domain.
 */
export function BackToSite() {
  const siteUrl = getMarketingSiteUrl("/");
  const isPreview = isPreviewEnvironment();
  
  if (isPreview) {
    // In preview, use regular Link
    return (
      <a 
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to site
      </a>
    );
  }
  
  return (
    <a 
      href={siteUrl}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Back to site
    </a>
  );
}

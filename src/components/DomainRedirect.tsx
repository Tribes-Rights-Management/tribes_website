import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCorrectDomainUrl, isPreviewEnvironment } from "@/lib/domains";

/**
 * DomainRedirect Component
 * 
 * Handles automatic redirects when users try to access routes
 * on the wrong domain. In production:
 * - Marketing routes on app subdomain → redirect to marketing site
 * - App routes on marketing domain → redirect to app subdomain
 * 
 * In preview/development, no redirects occur.
 */
export function DomainRedirect() {
  const location = useLocation();
  
  useEffect(() => {
    // Skip in preview environments
    if (isPreviewEnvironment()) {
      return;
    }
    
    const redirectUrl = getCorrectDomainUrl(location.pathname);
    
    if (redirectUrl) {
      // Full redirect to the correct domain
      window.location.href = redirectUrl;
    }
  }, [location.pathname]);
  
  return null;
}

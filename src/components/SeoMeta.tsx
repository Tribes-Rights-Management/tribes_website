import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isAppRoute, isPreviewEnvironment } from "@/lib/domains";

interface SeoMetaProps {
  title?: string;
  description?: string;
  noindex?: boolean;
}

/**
 * SeoMeta Component
 * 
 * Manages SEO meta tags for pages:
 * - Sets title and description
 * - Adds noindex for app pages (they should not be indexed)
 * - Sets canonical URLs for marketing pages
 */
export function SeoMeta({ title, description, noindex }: SeoMetaProps) {
  const location = useLocation();
  
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // Handle robots meta tag for noindex
    const shouldNoindex = noindex || (!isPreviewEnvironment() && isAppRoute(location.pathname));
    
    let robotsMeta = document.querySelector('meta[name="robots"]');
    
    if (shouldNoindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      robotsMeta.remove();
    }
    
    // Handle canonical URL for marketing pages
    const marketingDomain = "https://tribesrightsmanagement.com";
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    
    if (!isPreviewEnvironment() && !isAppRoute(location.pathname)) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `${marketingDomain}${location.pathname}`);
    } else if (canonicalLink) {
      canonicalLink.remove();
    }
    
    // Cleanup
    return () => {
      // Reset to default title if needed
    };
  }, [title, description, noindex, location.pathname]);
  
  return null;
}

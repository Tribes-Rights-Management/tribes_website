import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getSignInUrl, isPreviewEnvironment } from "@/lib/domains";

interface AppLinkProps {
  children: ReactNode;
  className?: string;
  redirect?: string;
}

/**
 * AppLink Component
 * 
 * A link that points to the app subdomain for authentication.
 * Used on marketing pages to direct users to sign in.
 * 
 * In preview environments, uses React Router Link.
 * In production, uses full URL to app subdomain.
 */
export function AppLink({ children, className, redirect }: AppLinkProps) {
  const isPreview = isPreviewEnvironment();
  
  if (isPreview) {
    // In preview, use React Router
    const to = redirect ? `/auth?redirect=${encodeURIComponent(redirect)}` : "/auth";
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  
  // In production, use full URL
  return (
    <a href={getSignInUrl(redirect)} className={className}>
      {children}
    </a>
  );
}

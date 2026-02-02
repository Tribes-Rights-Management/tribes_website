/**
 * Help Center Header
 * Standardized 56px sticky header matching Portal exactly
 * 
 * Logo: 20px height, 80px max width (from BRAND constants)
 */

import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAudiences } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";
import { HELP_CENTER, BRAND } from "@/lib/layout";

interface HelpHeaderProps {
  currentAudience: string;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function HelpHeader({ currentAudience, onMenuToggle, sidebarOpen }: HelpHeaderProps) {
  const { data: audiences, isLoading } = useAudiences();

  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-border px-4 flex items-center justify-between"
      style={{ height: HELP_CENTER.HEADER_HEIGHT }}
    >
      {/* Left section */}
      <div className="flex items-center h-full gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 mr-2 md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>
        
        {/* Logo - standardized dimensions */}
        <Link to="/" className="flex items-center h-full">
          <img 
            src={BRAND.LOGO_URL} 
            alt="Tribes" 
            style={{
              height: BRAND.LOGO_HEIGHT,
              width: "auto",
              maxWidth: BRAND.LOGO_MAX_WIDTH,
            }}
          />
        </Link>
        
        {/* Help Center text */}
        <Link 
          to={`/hc/${currentAudience}`}
          className="hidden sm:flex items-center h-full text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          Help Center
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border" />

        {/* Audience Tabs */}
        <nav className="hidden md:flex items-center gap-5 h-full">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </>
          ) : (
            audiences?.map((audience) => {
              const isActive = currentAudience === audience.slug;
              return (
                <Link
                  key={audience.id}
                  to={`/hc/${audience.slug}`}
                  className={
                    "relative h-full flex items-center text-[14px] font-medium transition-colors duration-150 " +
                    (isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {audience.name}
                  {isActive ? (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                  ) : null}
                </Link>
              );
            })
          )}
        </nav>
      </div>

      {/* Right section - Client Portal link */}
      <a
        href="https://app.tribesrightsmanagement.com"
        className="hidden sm:flex items-center h-full text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        Client Portal
      </a>
    </header>
  );
}

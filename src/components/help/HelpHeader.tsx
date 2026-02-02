/**
 * Help Center Header
 * 56px sticky header with logo constrained to sidebar width
 * 
 * Layout: [Logo area (200px)] | [Divider] | [Nav tabs] | [spacer] | [Client Portal]
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
      className="sticky top-0 z-50 bg-white border-b border-border flex items-center"
      style={{ height: HELP_CENTER.HEADER_HEIGHT }}
    >
      {/* Logo area - constrained to sidebar width for alignment */}
      <div 
        className="shrink-0 h-full flex items-center px-4 border-r border-border"
        style={{ width: HELP_CENTER.SIDEBAR_WIDTH }}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 mr-2 md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
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
        
        {/* Help Center text - desktop only */}
        <Link 
          to={`/hc/${currentAudience}`}
          className="hidden sm:flex items-center ml-3 text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          Help Center
        </Link>
      </div>

      {/* Right section - nav tabs and portal link */}
      <div className="flex-1 h-full flex items-center justify-between px-6">
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

        {/* Client Portal link */}
        <a
          href="https://app.tribesrightsmanagement.com"
          className="hidden sm:flex items-center h-full text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          Client Portal
        </a>
      </div>
    </header>
  );
}

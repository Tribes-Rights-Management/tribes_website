/**
 * Help Center Header
 * 56px sticky header with logo, divider, audience tabs
 */

import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAudiences } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

const WORDMARK_URL = "https://rsdjfnsbimcdrxlhognv.supabase.co/storage/v1/object/public/Tribes%20Brand%20Files/Tribes%20-%20Wordmark%20Black%20Transparent.svg";

interface HelpHeaderProps {
  currentAudience: string;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function HelpHeader({ currentAudience, onMenuToggle, sidebarOpen }: HelpHeaderProps) {
  const { data: audiences, isLoading } = useAudiences();

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-border px-6 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center h-full gap-4">
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
          <Link to="/" className="flex items-center h-full">
            <img 
              src={WORDMARK_URL} 
              alt="Tribes" 
              className="block h-[18px] w-auto"
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
          <div className="hidden md:block w-px h-5 bg-border ml-4 mr-6" />

          {/* Audience Tabs */}
          <nav className="hidden md:flex items-center gap-6 h-full">
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
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
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

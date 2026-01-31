/**
 * Help Center Header
 * 56px sticky header with logo, divider, audience tabs
 */

import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { data: audiences, isLoading } = useAudiences();

  return (
    <header className="h-[56px] sticky top-0 z-50 bg-white border-b border-border">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
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
              src={WORDMARK_URL} 
              alt="Tribes" 
              className="h-[18px] w-auto"
            />
          </Link>
          
          {/* Help Center text */}
          <Link 
            to={`/hc/${currentAudience}`}
            className="hidden sm:block text-[14px] leading-none text-muted-foreground ml-4 hover:text-foreground transition-colors duration-150"
          >
            Help Center
          </Link>

          {/* Divider */}
          <div className="hidden md:block h-5 w-px bg-border mx-4" />

          {/* Audience Tabs */}
          <nav className="hidden md:flex items-center gap-6">
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
                    className={`
                      text-[14px] font-medium transition-colors duration-150 pb-[18px] pt-[18px] -mb-[1px]
                      ${isActive 
                        ? 'text-foreground border-b-2 border-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {audience.name}
                  </Link>
                );
              })
            )}
          </nav>
        </div>
        
        {/* Right section - Client Portal link */}
        <a 
          href="https://app.tribesrightsmanagement.com" 
          className="hidden sm:block text-[14px] leading-none text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          Client Portal
        </a>
      </div>
    </header>
  );
}

/**
 * Help Center Header
 * Matches Portal header styling EXACTLY
 * 
 * Logo area: 200px, pl-5 (20px) to align with nav items
 * Header height: 56px
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
      className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5] flex items-center"
      style={{ height: HELP_CENTER.HEADER_HEIGHT }}
    >
      {/* Logo column - matches Portal: 200px width, pl-5 for alignment */}
      <div 
        className="shrink-0 h-full flex items-center pl-5 border-r border-[#e5e5e5]"
        style={{ 
          width: HELP_CENTER.SIDEBAR_WIDTH,
          backgroundColor: HELP_CENTER.SIDEBAR_BG,
        }}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="absolute left-3 p-2 md:hidden text-[#737373] hover:text-[#1a1a1a]"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>
        
        {/* Logo - matches Portal: px-2 button padding, hover state */}
        <Link 
          to="/" 
          className="flex items-center px-2 h-9 rounded-lg hover:bg-black/5 transition-colors"
        >
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
      </div>

      {/* Content column - matches Portal styling */}
      <div 
        className="flex-1 h-full flex items-center justify-between px-6"
        style={{ backgroundColor: 'white' }}
      >
        {/* Left: Help Center text + Audience Tabs */}
        <div className="flex items-center gap-4 h-full">
          {/* Help Center text */}
          <Link 
            to={`/hc/${currentAudience}`}
            className="hidden sm:block text-[14px] text-[#737373] hover:text-[#1a1a1a] transition-colors"
          >
            Help Center
          </Link>

          {/* Divider - matches Portal border color */}
          <div className="hidden md:block w-px h-5 bg-[#e5e5e5]" />

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
                    className={`
                      relative h-full flex items-center text-[14px] font-medium transition-colors
                      ${isActive ? "text-[#1a1a1a]" : "text-[#737373] hover:text-[#1a1a1a]"}
                    `}
                  >
                    {audience.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]" />
                    )}
                  </Link>
                );
              })
            )}
          </nav>
        </div>

        {/* Right: Client Portal link */}
        <a
          href="https://app.tribesrightsmanagement.com"
          className="hidden sm:block text-[14px] text-[#737373] hover:text-[#1a1a1a] transition-colors"
        >
          Client Portal
        </a>
      </div>
    </header>
  );
}

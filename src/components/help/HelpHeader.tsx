/**
 * Help Center Header
 * EXACT Portal alignment - Help Center text aligns with content at 24px from sidebar
 */

import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAudiences } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAND } from "@/lib/layout";

interface HelpHeaderProps {
  currentAudience: string;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

/* Portal exact colors */
const COLORS = {
  SIDEBAR_BG: '#EEF0F2',
  TOPBAR_BG: '#FFFFFF',      /* White header to match white body */
  BORDER_SUBTLE: '#E6E8EC',
  TEXT: '#1F2937',
  TEXT_MUTED: '#6B7280',
};

export function HelpHeader({ currentAudience, onMenuToggle, sidebarOpen }: HelpHeaderProps) {
  const { data: audiences, isLoading } = useAudiences();

  return (
    <header 
      className="sticky top-0 z-50 flex items-center"
      style={{ 
        height: '56px',
        backgroundColor: COLORS.TOPBAR_BG,
        borderBottom: `1px solid ${COLORS.BORDER_SUBTLE}`,
      }}
    >
      {/* Logo column - 200px width */}
      <div 
        className="h-full flex items-center shrink-0"
        style={{ 
          width: '200px',
          paddingLeft: '20px',
          backgroundColor: COLORS.SIDEBAR_BG,
          borderRight: `1px solid ${COLORS.BORDER_SUBTLE}`,
        }}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden"
          style={{
            padding: '8px',
            marginLeft: '-12px',
            color: COLORS.TEXT_MUTED,
          }}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>
        
        {/* Logo button */}
        <Link 
          to="/" 
          className="hidden md:flex items-center rounded-lg transition-colors"
          style={{
            height: '36px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <img 
            src={BRAND.LOGO_URL} 
            alt="Tribes" 
            style={{
              height: '20px',
              width: 'auto',
              maxWidth: '80px',
            }}
          />
        </Link>
      </div>

      {/* Content column - 24px padding to align with body content */}
      <div 
        className="flex-1 h-full flex items-center justify-between"
        style={{ 
          paddingLeft: '24px',
          paddingRight: '24px',
          backgroundColor: COLORS.TOPBAR_BG,
        }}
      >
        {/* Left side - gap-5 (20px) between items */}
        <nav className="flex items-center h-full" style={{ gap: '20px' }}>
          {/* Help Center link - 14px font to match Portal */}
          <Link 
            to={`/hc/${currentAudience}`}
            className="hidden sm:flex items-center h-full transition-colors"
            style={{ 
              fontSize: '14px', 
              color: COLORS.TEXT_MUTED,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_MUTED}
          >
            Help Center
          </Link>

          {/* Divider */}
          <div 
            className="hidden md:block" 
            style={{ width: '1px', height: '20px', backgroundColor: COLORS.BORDER_SUBTLE }} 
          />

          {/* Audience tabs */}
          {isLoading ? (
            <>
              <Skeleton style={{ height: '16px', width: '80px' }} />
              <Skeleton style={{ height: '16px', width: '80px' }} />
            </>
          ) : (
            audiences?.map((audience) => {
              const isActive = currentAudience === audience.slug;
              return (
                <Link
                  key={audience.id}
                  to={`/hc/${audience.slug}`}
                  className="relative h-full hidden md:flex items-center transition-colors"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isActive ? COLORS.TEXT : COLORS.TEXT_MUTED,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = COLORS.TEXT; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = COLORS.TEXT_MUTED; }}
                >
                  {audience.name}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 right-0" 
                      style={{ height: '2px', backgroundColor: COLORS.TEXT }} 
                    />
                  )}
                </Link>
              );
            })
          )}
        </nav>

        {/* Right side */}
        <a
          href="https://app.tribesrightsmanagement.com"
          className="hidden sm:flex items-center h-full transition-colors"
          style={{ 
            fontSize: '14px', 
            color: COLORS.TEXT_MUTED,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
          onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_MUTED}
        >
          Client Portal
        </a>
      </div>
    </header>
  );
}

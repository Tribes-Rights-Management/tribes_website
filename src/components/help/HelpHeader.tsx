/**
 * Help Center Header
 * Mercury-inspired mobile-first design
 * Mobile: Logo + divider + "Help Center" + audience dropdown
 * Desktop: Unchanged sidebar-column layout
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAudiences } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAND } from "@/lib/layout";

interface HelpHeaderProps {
  currentAudience: string;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

/* Portal exact colors */
const COLORS = {
  SIDEBAR_BG: '#EEF0F2',
  TOPBAR_BG: '#FFFFFF',
  BORDER_SUBTLE: '#E6E8EC',
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
  DROPDOWN_BG: '#FFFFFF',
  DROPDOWN_HOVER: '#F3F4F6',
};

export function HelpHeader({ currentAudience }: HelpHeaderProps) {
  const { data: audiences, isLoading } = useAudiences();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentAudienceData = audiences?.find(a => a.slug === currentAudience);

  return (
    <header 
      className="sticky top-0 z-50"
      style={{ 
        height: '56px',
        backgroundColor: COLORS.TOPBAR_BG,
        borderBottom: `1px solid ${COLORS.BORDER_SUBTLE}`,
      }}
    >
      {/* Mobile Header - Clean horizontal bar */}
      <div 
        className="flex md:hidden items-center justify-between h-full"
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        {/* Left: Logo + divider + Help Center */}
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/">
            <img 
              src={BRAND.LOGO_URL} 
              alt="Tribes" 
              style={{ height: '18px', width: 'auto' }}
            />
          </Link>
          <div style={{ width: '1px', height: '18px', backgroundColor: COLORS.BORDER_SUBTLE }} />
          <Link 
            to={`/hc/${currentAudience}`}
            style={{ fontSize: '14px', fontWeight: 500, color: COLORS.TEXT }}
          >
            Help Center
          </Link>
        </div>

        {/* Right: Audience dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center"
            style={{ 
              gap: '4px',
              fontSize: '13px', 
              fontWeight: 500,
              color: COLORS.TEXT_SECONDARY,
              padding: '8px 0',
            }}
          >
            {isLoading ? (
              <Skeleton style={{ height: '14px', width: '70px' }} />
            ) : (
              <>
                {currentAudienceData?.name || 'Publishers'}
                <ChevronDown 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    transition: 'transform 0.15s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} 
                />
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && audiences && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: COLORS.DROPDOWN_BG,
                border: `1px solid ${COLORS.BORDER_SUBTLE}`,
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                minWidth: '160px',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              {audiences.map((audience) => {
                const isActive = currentAudience === audience.slug;
                return (
                  <Link
                    key={audience.id}
                    to={`/hc/${audience.slug}`}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? COLORS.TEXT : COLORS.TEXT_SECONDARY,
                      backgroundColor: isActive ? COLORS.DROPDOWN_HOVER : 'transparent',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = COLORS.DROPDOWN_HOVER;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {audience.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header - Unchanged sidebar-column layout */}
      <div className="hidden md:flex items-center h-full">
        {/* Logo column - 200px */}
        <div 
          className="h-full flex items-center shrink-0"
          style={{ 
            width: '200px',
            paddingLeft: '20px',
            backgroundColor: COLORS.SIDEBAR_BG,
            borderRight: `1px solid ${COLORS.BORDER_SUBTLE}`,
          }}
        >
          <Link 
            to="/" 
            className="flex items-center rounded-lg transition-colors"
            style={{ height: '36px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <img 
              src={BRAND.LOGO_URL} 
              alt="Tribes" 
              style={{ height: '18px', width: 'auto', maxWidth: '80px' }}
            />
          </Link>
        </div>

        {/* Content column */}
        <div 
          className="flex-1 h-full flex items-center justify-between"
          style={{ paddingLeft: '32px', paddingRight: '32px', backgroundColor: COLORS.TOPBAR_BG }}
        >
          <nav className="flex items-center h-full" style={{ gap: '16px' }}>
            <Link 
              to={`/hc/${currentAudience}`}
              className="flex items-center h-full transition-colors"
              style={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}
              onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
              onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_SECONDARY}
            >
              Help Center
            </Link>

            <div style={{ width: '1px', height: '16px', backgroundColor: COLORS.BORDER_SUBTLE }} />

            {isLoading ? (
              <>
                <Skeleton style={{ height: '14px', width: '70px' }} />
                <Skeleton style={{ height: '14px', width: '70px' }} />
              </>
            ) : (
              audiences?.map((audience) => {
                const isActive = currentAudience === audience.slug;
                return (
                  <Link
                    key={audience.id}
                    to={`/hc/${audience.slug}`}
                    className="relative h-full flex items-center transition-colors"
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? COLORS.TEXT : COLORS.TEXT_SECONDARY,
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = COLORS.TEXT; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = COLORS.TEXT_SECONDARY; }}
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

          <a
            href="https://app.tribesrightsmanagement.com"
            className="flex items-center h-full transition-colors"
            style={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_SECONDARY}
          >
            Client Portal
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * Help Center Header
 * EXACT Portal styling - using explicit pixels
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
      className="sticky top-0 z-50 flex items-center"
      style={{ 
        height: '56px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e5e5',
      }}
    >
      {/* Logo column - 200px width, grey background */}
      <div 
        className="h-full flex items-center shrink-0"
        style={{ 
          width: '200px',
          paddingLeft: '20px',
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e5e5e5',
        }}
      >
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden"
          style={{
            padding: '8px',
            marginLeft: '-12px',
            color: '#737373',
          }}
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu style={{ width: '20px', height: '20px' }} />
        </button>
        
        {/* Logo button */}
        <Link 
          to="/" 
          className="hidden md:flex items-center rounded-lg hover:bg-black/5 transition-colors"
          style={{
            height: '36px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}
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

      {/* Content column */}
      <div 
        className="flex-1 h-full flex items-center justify-between"
        style={{ 
          paddingLeft: '24px',
          paddingRight: '24px',
          backgroundColor: 'white',
        }}
      >
        {/* Left side - all items on same baseline */}
        <nav className="flex items-center h-full" style={{ gap: '20px' }}>
          {/* Help Center link - same styling as tabs */}
          <Link 
            to={`/hc/${currentAudience}`}
            className="hidden sm:flex items-center h-full transition-colors hover:text-[#1a1a1a]"
            style={{ fontSize: '14px', color: '#737373' }}
          >
            Help Center
          </Link>

          {/* Divider */}
          <div 
            className="hidden md:block" 
            style={{ width: '1px', height: '20px', backgroundColor: '#e5e5e5' }} 
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
                    color: isActive ? '#1a1a1a' : '#737373',
                  }}
                >
                  {audience.name}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 right-0" 
                      style={{ height: '2px', backgroundColor: '#1a1a1a' }} 
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
          className="hidden sm:flex items-center h-full transition-colors hover:text-[#1a1a1a]"
          style={{ fontSize: '14px', color: '#737373' }}
        >
          Client Portal
        </a>
      </div>
    </header>
  );
}

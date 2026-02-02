/**
 * Help Center Layout
 * Mercury-inspired mobile-first design
 * Mobile: No sidebar drawer, just clean content
 * Desktop: 200px sidebar unchanged
 */

import { ReactNode } from "react";
import { HelpSidebar } from "./HelpSidebar";
import { HelpHeader } from "./HelpHeader";

interface HelpLayoutProps {
  children: ReactNode;
  currentAudience: string;
  currentCategorySlug?: string;
}

/* Portal exact colors */
const COLORS = {
  PAGE_BG: '#FFFFFF',
  SIDEBAR_BG: '#EEF0F2',
  BORDER_SUBTLE: '#E6E8EC',
};

export function HelpLayout({ children, currentAudience, currentCategorySlug }: HelpLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.PAGE_BG }}>
      {/* Global typography overrides for Help Center */}
      <style>{`
        .help-content h1 { font-size: 20px !important; font-weight: 500 !important; line-height: 1.25 !important; letter-spacing: -0.01em !important; }
        .help-content h2 { font-size: 16px !important; font-weight: 600 !important; line-height: 1.4 !important; }
        .help-content h3 { font-size: 14px !important; font-weight: 600 !important; line-height: 1.4 !important; }
        .help-content p, .help-content span, .help-content li, .help-content a { font-size: 13px !important; line-height: 1.5 !important; }
        .help-content input, .help-content textarea { font-size: 15px !important; }
        .help-content input::placeholder, .help-content textarea::placeholder { font-size: 15px !important; }
      `}</style>
      
      <HelpHeader 
        currentAudience={currentAudience}
      />
      
      <div className="flex">
        {/* Desktop Sidebar - 200px */}
        <aside 
          className="hidden md:flex flex-col shrink-0 sticky overflow-hidden"
          style={{
            width: '200px',
            top: '56px',
            height: 'calc(100vh - 56px)',
            backgroundColor: COLORS.SIDEBAR_BG,
            borderRight: `1px solid ${COLORS.BORDER_SUBTLE}`,
          }}
        >
          <HelpSidebar 
            currentAudience={currentAudience} 
            currentCategorySlug={currentCategorySlug} 
          />
        </aside>

        {/* Main Content */}
        <main 
          className="flex-1 min-w-0 help-content" 
          style={{ 
            backgroundColor: COLORS.PAGE_BG,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {/* Mobile padding: 24px vertical, 20px horizontal */}
          {/* Desktop padding: 16px all around with max-width */}
          <div 
            className="md:max-w-[1120px]"
            style={{ 
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '24px',
              paddingBottom: '24px',
            }}
          >
            <style>{`
              @media (min-width: 768px) {
                .help-content > div {
                  padding-left: 16px !important;
                  padding-right: 16px !important;
                  padding-top: 16px !important;
                  padding-bottom: 16px !important;
                }
              }
            `}</style>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

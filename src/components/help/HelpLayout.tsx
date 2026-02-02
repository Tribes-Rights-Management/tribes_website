/**
 * Help Center Layout
 * EXACT Portal alignment, colors, and typography
 */

import { ReactNode, useState } from "react";
import { X } from "lucide-react";
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
  TEXT: '#1F2937',
  TEXT_MUTED: '#6B7280',
};

export function HelpLayout({ children, currentAudience, currentCategorySlug }: HelpLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.PAGE_BG }}>
      {/* 
        CSS overrides for Help Center content to match Portal typography 
        Portal uses: page-title 22px, body 13px, font-weight 600 for titles
      */}
      <style>{`
        .help-content h1 {
          font-size: 22px !important;
          font-weight: 600 !important;
          line-height: 1.25 !important;
          letter-spacing: -0.02em !important;
          color: #1F2937 !important;
        }
        .help-content h2 {
          font-size: 16px !important;
          font-weight: 600 !important;
          line-height: 1.3 !important;
          color: #1F2937 !important;
        }
        .help-content h3 {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #1F2937 !important;
        }
        .help-content p,
        .help-content span,
        .help-content li,
        .help-content a {
          font-size: 13px !important;
          line-height: 1.5 !important;
        }
        .help-content input,
        .help-content textarea {
          font-size: 14px !important;
        }
        .help-content input::placeholder {
          font-size: 14px !important;
        }
        @media (min-width: 640px) {
          .help-content h1 {
            font-size: 24px !important;
          }
        }
      `}</style>

      <HelpHeader 
        currentAudience={currentAudience}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
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

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out md:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{ 
            width: '280px',
            backgroundColor: COLORS.SIDEBAR_BG,
          }}
        >
          <div 
            className="flex items-center justify-between"
            style={{ 
              height: '56px',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderBottom: `1px solid ${COLORS.BORDER_SUBTLE}`,
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.TEXT }}>Navigation</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ padding: '8px', marginRight: '-8px', color: COLORS.TEXT_MUTED }}
              aria-label="Close menu"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
          <div 
            className="overflow-y-auto"
            style={{ height: 'calc(100% - 56px)' }}
          >
            <HelpSidebar 
              currentAudience={currentAudience}
              currentCategorySlug={currentCategorySlug}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* Main Content with Portal typography */}
        <main className="flex-1 min-w-0 help-content" style={{ backgroundColor: COLORS.PAGE_BG }}>
          <div style={{ 
            maxWidth: '900px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '24px',
            paddingBottom: '32px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

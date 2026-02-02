/**
 * Help Center Layout
 * Standardized layout matching Portal dimensions exactly
 * 
 * Sidebar: 200px (from HELP_CENTER.SIDEBAR_WIDTH)
 * Header: 56px (from HELP_CENTER.HEADER_HEIGHT)
 */

import { ReactNode, useState } from "react";
import { X } from "lucide-react";
import { HelpSidebar } from "./HelpSidebar";
import { HelpHeader } from "./HelpHeader";
import { HELP_CENTER } from "@/lib/layout";

interface HelpLayoutProps {
  children: ReactNode;
  currentAudience: string;
  currentCategorySlug?: string;
}

export function HelpLayout({ children, currentAudience, currentCategorySlug }: HelpLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-['IBM_Plex_Sans',sans-serif] text-[14px] leading-[1.5]">
      <HelpHeader 
        currentAudience={currentAudience}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        {/* Desktop Sidebar - standardized 200px width */}
        <aside 
          className="hidden md:block shrink-0 sticky overflow-y-auto border-r border-[#f5f5f5]"
          style={{
            width: HELP_CENTER.SIDEBAR_WIDTH,
            top: HELP_CENTER.HEADER_HEIGHT,
            height: `calc(100vh - ${HELP_CENTER.HEADER_HEIGHT})`,
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
          className="fixed inset-y-0 left-0 z-50 bg-white transform transition-transform duration-200 ease-out md:hidden"
          style={{ width: HELP_CENTER.MOBILE_SIDEBAR_WIDTH }}
          data-state={sidebarOpen ? "open" : "closed"}
        >
          <div 
            className={`
              transform transition-transform duration-200 ease-out h-full
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div 
              className="flex items-center justify-between px-4 border-b border-[#e5e5e5]"
              style={{ height: HELP_CENTER.HEADER_HEIGHT }}
            >
              <span className="text-[14px] font-semibold text-[#1a1a1a]">Navigation</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 -mr-2 text-[#525252] hover:text-[#1a1a1a]"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div 
              className="overflow-y-auto"
              style={{ height: `calc(100% - ${HELP_CENTER.HEADER_HEIGHT})` }}
            >
              <HelpSidebar 
                currentAudience={currentAudience}
                currentCategorySlug={currentCategorySlug}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div 
            className="px-6 md:px-12 py-8"
            style={{ maxWidth: HELP_CENTER.CONTENT_MAX_WIDTH }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

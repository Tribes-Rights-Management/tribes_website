/**
 * Help Center Layout
 * Mercury-style institutional layout with 220px sidebar
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
        {/* Desktop Sidebar - 220px fixed width */}
        <aside className="hidden md:block w-[220px] shrink-0 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto border-r border-[#f5f5f5]">
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
            fixed inset-y-0 left-0 z-50 w-[280px] bg-white transform transition-transform duration-200 ease-out md:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-[56px] flex items-center justify-between px-4 border-b border-[#e5e5e5]">
            <span className="text-[14px] font-semibold text-[#1a1a1a]">Navigation</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 -mr-2 text-[#525252] hover:text-[#1a1a1a]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)]">
            <HelpSidebar 
              currentAudience={currentAudience}
              currentCategorySlug={currentCategorySlug}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* Main Content - 800px max width */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[800px] px-6 md:px-12 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

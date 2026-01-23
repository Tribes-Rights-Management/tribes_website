/**
 * Help Center Layout
 * Mercury-style institutional layout with sidebar navigation
 */

import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { HelpSidebar } from "./HelpSidebar";
import { HelpHeader } from "./HelpHeader";
import type { HelpTab } from "@/types/helpCenter";

interface HelpLayoutProps {
  children: ReactNode;
}

export function HelpLayout({ children }: HelpLayoutProps) {
  const [activeTab, setActiveTab] = useState<HelpTab>("publishers");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Extract current category from path
  const pathParts = location.pathname.split("/");
  const currentCategoryId = pathParts[2] === "categories" ? pathParts[3] : undefined;

  return (
    <div className="min-h-screen bg-white font-['IBM_Plex_Sans',sans-serif]">
      <HelpHeader 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-[260px] shrink-0 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto border-r border-[#e5e5e5]">
          <HelpSidebar currentCategoryId={currentCategoryId} />
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
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#e5e5e5]">
            <span className="text-[15px] font-semibold text-[#1a1a1a]">Navigation</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 -mr-2 text-[#666666] hover:text-[#1a1a1a]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-64px)]">
            <HelpSidebar 
              currentCategoryId={currentCategoryId} 
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[900px] px-6 md:px-12 py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

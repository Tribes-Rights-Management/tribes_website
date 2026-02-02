/**
 * Help Center Layout
 * EXACT Portal AppShell structure - using explicit pixels
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
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <HelpHeader 
        currentAudience={currentAudience}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        {/* Desktop Sidebar - 200px width */}
        <aside 
          className="hidden md:flex flex-col shrink-0 sticky overflow-hidden"
          style={{
            width: '200px',
            top: '56px',
            height: 'calc(100vh - 56px)',
            backgroundColor: '#fafafa',
            borderRight: '1px solid #e5e5e5',
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
        
        {/* Mobile Sidebar - 280px width */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out md:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{ 
            width: '280px',
            backgroundColor: '#fafafa',
          }}
        >
          <div 
            className="flex items-center justify-between"
            style={{ 
              height: '56px',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderBottom: '1px solid #e5e5e5',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Navigation</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ padding: '8px', marginRight: '-8px', color: '#737373' }}
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

        {/* Main Content - Portal uses px-6 md:px-12 py-8 */}
        <main className="flex-1 min-w-0">
          <div style={{ 
            maxWidth: '800px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '32px',
            paddingBottom: '32px',
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

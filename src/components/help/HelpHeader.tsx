/**
 * Help Center Header
 * 64px sticky header with logo, divider, and nav tabs
 */

import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import type { HelpTab } from "@/types/helpCenter";

const WORDMARK_URL = "https://rsdjfnsbimcdrxlhognv.supabase.co/storage/v1/object/public/Tribes%20Brand%20Files/Tribes%20-%20Wordmark%20Black%20Transparent.svg";

interface HelpHeaderProps {
  activeTab: HelpTab;
  onTabChange: (tab: HelpTab) => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

const tabs: { id: HelpTab; label: string }[] = [
  { id: "publishers", label: "Publishers" },
  { id: "songwriters", label: "Songwriters" },
  { id: "licensing", label: "Licensing" },
];

export function HelpHeader({ activeTab, onTabChange, onMenuToggle, sidebarOpen }: HelpHeaderProps) {
  return (
    <header className="h-16 sticky top-0 z-30 bg-white border-b border-[#e5e5e5]">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo + Help Center */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-2 md:hidden text-[#666666] hover:text-[#1a1a1a]"
            aria-label="Toggle menu"
            aria-expanded={sidebarOpen}
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={WORDMARK_URL} 
              alt="Tribes" 
              className="h-5"
              style={{ height: '20px' }}
            />
          </Link>
          
          <div className="hidden sm:block w-px h-5 bg-[#e5e5e5]" />
          
          <Link 
            to="/help" 
            className="hidden sm:block text-[15px] font-medium text-[#1a1a1a] hover:text-[#666666] transition-colors duration-150"
          >
            Help Center
          </Link>
        </div>

        {/* Right: Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                px-4 py-2 text-[14px] font-medium rounded-md transition-colors duration-150
                ${activeTab === tab.id 
                  ? 'text-[#1a1a1a] bg-[#f5f5f5]' 
                  : 'text-[#666666] hover:text-[#1a1a1a] hover:bg-[#fafafa]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/**
 * Help Center Header
 * 56px sticky header with logo, divider, and plain text nav tabs
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
    <header className="h-[56px] sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
      <div className="h-full px-6 flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 mr-2 md:hidden text-[#525252] hover:text-[#1a1a1a]"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
        >
          <Menu size={20} />
        </button>
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={WORDMARK_URL} 
            alt="Tribes" 
            className="h-[18px] w-auto"
          />
        </Link>
        
        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[#e5e5e5] mx-4" />
        
        {/* Help Center text */}
        <Link 
          to="/hc" 
          className="hidden sm:block text-[14px] font-medium text-[#1a1a1a] hover:text-[#525252] transition-colors duration-150"
        >
          Help Center
        </Link>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Nav Tabs - plain text, no pills */}
        <nav className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                text-[14px] font-medium transition-colors duration-150
                ${activeTab === tab.id 
                  ? 'text-[#1a1a1a]' 
                  : 'text-[#525252] hover:text-[#1a1a1a]'
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

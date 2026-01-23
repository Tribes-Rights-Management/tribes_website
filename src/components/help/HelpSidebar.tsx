/**
 * Help Center Sidebar
 * 220px fixed width, 16px icons, single-line text
 */

import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  UserPlus, 
  Music, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  Code,
  LucideIcon
} from "lucide-react";
import { helpCategories } from "@/data/helpCategories";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle,
  UserPlus,
  Music,
  CreditCard,
  FileText,
  BarChart3,
  Users,
  Settings,
  Code,
};

interface HelpSidebarProps {
  currentCategoryId?: string;
  onNavigate?: () => void;
}

export function HelpSidebar({ currentCategoryId, onNavigate }: HelpSidebarProps) {
  return (
    <nav className="py-6 px-4">
      {/* Section label */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a3a3a3]">
          Sections
        </span>
      </div>
      
      <ul className="space-y-0.5">
        {helpCategories.map((category) => {
          const Icon = iconMap[category.icon] || CheckCircle;
          const isActive = currentCategoryId === category.id;
          
          return (
            <li key={category.id}>
              <Link
                to={`/hc/categories/${category.id}`}
                onClick={onNavigate}
                className={`
                  flex items-center gap-[10px] px-3 py-2 rounded-md 
                  text-[14px] font-medium whitespace-nowrap
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-[#f5f5f5] text-[#1a1a1a]' 
                    : 'text-[#525252] hover:bg-[#fafafa] hover:text-[#1a1a1a]'
                  }
                `}
              >
                <Icon 
                  size={16} 
                  className={isActive ? 'text-[#525252]' : 'text-[#a3a3a3]'} 
                />
                <span>{category.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

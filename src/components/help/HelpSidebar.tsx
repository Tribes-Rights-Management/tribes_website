/**
 * Help Center Sidebar
 * Navigation with category sections and icons
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
  Layers,
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
  Layers,
};

interface HelpSidebarProps {
  currentCategoryId?: string;
  onNavigate?: () => void;
}

export function HelpSidebar({ currentCategoryId, onNavigate }: HelpSidebarProps) {
  return (
    <nav className="py-6 px-2">
      <div className="px-4 mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999999]">
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
                to={`/help/categories/${category.id}`}
                onClick={onNavigate}
                className={`
                  flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-[14px] font-medium
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-[#f5f5f5] text-[#1a1a1a]' 
                    : 'text-[#666666] hover:bg-[#fafafa] hover:text-[#1a1a1a]'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-[#1a1a1a]' : 'text-[#999999]'} />
                <span>{category.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

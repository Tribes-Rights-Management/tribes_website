/**
 * Help Center Sidebar
 * 220px fixed width, dynamic categories from Supabase
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
  BookOpen,
  LucideIcon
} from "lucide-react";
import { useCategories } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

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
  BookOpen,
};

interface HelpSidebarProps {
  currentAudience: string;
  currentCategorySlug?: string;
  onNavigate?: () => void;
}

export function HelpSidebar({ currentAudience, currentCategorySlug, onNavigate }: HelpSidebarProps) {
  const { data: categories, isLoading } = useCategories(currentAudience);

  return (
    <nav className="py-6 px-4">
      {/* Section label */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a3a3a3]">
          Sections
        </span>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-0.5">
          {categories?.map((category) => {
            const Icon = iconMap[category.category_icon || "BookOpen"] || BookOpen;
            const isActive = currentCategorySlug === category.category_slug;
            
            return (
              <li key={category.category_id}>
                <Link
                  to={`/hc/${currentAudience}/categories/${category.category_slug}`}
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
                  <span>{category.category_name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}

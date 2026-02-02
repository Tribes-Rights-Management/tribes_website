/**
 * Help Center Sidebar
 * Matches Portal SideNav styling EXACTLY
 * 
 * STRICT INVARIANTS (from Portal):
 * - Container: px-2 py-3
 * - Links: px-3 py-2 gap-3 text-[13px]
 * - Icons: h-4 w-4 (16px), strokeWidth 1.5
 * - Vertical spacing: space-y-px (minimal)
 */

import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <nav className="flex flex-col h-full overflow-hidden">
      {/* Main navigation - py-3 matches Portal */}
      <div className="flex-1 py-3 overflow-y-auto">
        {/* Container px-2 matches Portal */}
        <div className="px-2 space-y-px">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md" />
              ))}
            </>
          ) : (
            categories?.map((category) => {
              const Icon = iconMap[category.category_icon || "BookOpen"] || BookOpen;
              const categoryPath = `/hc/${currentAudience}/categories/${category.category_slug}`;
              const isActive = currentCategorySlug === category.category_slug || 
                location.pathname.startsWith(categoryPath);
              
              return (
                <Link
                  key={category.category_id}
                  to={categoryPath}
                  onClick={onNavigate}
                  className={`
                    flex items-center justify-start gap-3 px-3 py-2 
                    text-[13px] rounded-md text-left w-full
                    transition-colors duration-150
                    ${isActive 
                      ? 'font-medium text-[#1a1a1a] bg-[#e5e5e5]' 
                      : 'text-[#737373] hover:text-[#1a1a1a] hover:bg-[#e5e5e5]/50'
                    }
                  `}
                >
                  {/* Icon: h-4 w-4 (16px) - STRICT, strokeWidth 1.5 */}
                  <Icon 
                    className="h-4 w-4 shrink-0 opacity-70" 
                    strokeWidth={1.5}
                  />
                  <span className="truncate text-left">{category.category_name}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
}

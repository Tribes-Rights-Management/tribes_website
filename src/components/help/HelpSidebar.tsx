/**
 * Help Center Sidebar
 * Institutional sidebar navigation for help center categories
 */

import { Link, useLocation } from "react-router-dom";
import { 
  CheckCircle, UserPlus, Music, CreditCard, FileText, 
  BarChart3, Users, Settings, Code, BookOpen, LucideIcon
} from "lucide-react";
import { useCategories } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle, UserPlus, Music, CreditCard, FileText,
  BarChart3, Users, Settings, Code, BookOpen,
};

/* Help center standard colors */
const COLORS = {
  SIDEBAR_BG: '#EEF0F2',
  NAV_HOVER: '#EAEBEE',
  NAV_ACTIVE: '#E2E4E8',
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
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
    <nav className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <div className="flex flex-col" style={{ paddingLeft: '8px', paddingRight: '8px', gap: '1px' }}>
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full rounded-md" style={{ height: '36px' }} />
            ))
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
                  className="flex items-center justify-start rounded-md text-left w-full transition-colors duration-150"
                  style={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    gap: '12px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    color: isActive ? COLORS.TEXT : COLORS.TEXT_SECONDARY,
                    fontWeight: isActive ? 500 : 400,
                    backgroundColor: isActive ? COLORS.NAV_ACTIVE : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = COLORS.NAV_HOVER;
                      e.currentTarget.style.color = COLORS.TEXT;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = COLORS.TEXT_SECONDARY;
                    }
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px', flexShrink: 0, opacity: 0.7 }} strokeWidth={1.5} />
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

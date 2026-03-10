/**
 * Article Card Component
 * 13px font-medium for links
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/* Portal exact colors */
const COLORS = {
  TEXT: '#111827',
  TEXT_MUTED: '#9CA3AF',
  BORDER: '#E6E8EC',
  HOVER_BG: '#F3F4F6',
};

interface ArticleCardProps {
  slug: string;
  title: string;
  audienceSlug: string;
  categoryName?: string;
}

export function ArticleCard({ slug, title, audienceSlug, categoryName }: ArticleCardProps) {
  return (
    <Link
      to={`/hc/${audienceSlug}/articles/${slug}`}
      className="group flex items-center justify-between transition-colors duration-150"
      style={{
        padding: '12px 14px',
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: '8px',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.HOVER_BG}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div className="flex-1 min-w-0" style={{ paddingRight: '12px' }}>
        <span 
          className="block truncate"
          style={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT }}
        >
          {title}
        </span>
        {categoryName && (
          <span 
            className="block truncate"
            style={{ fontSize: '11px', color: COLORS.TEXT_MUTED, marginTop: '2px' }}
          >
            {categoryName}
          </span>
        )}
      </div>
      <ChevronRight 
        className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ width: '14px', height: '14px', color: COLORS.TEXT_MUTED }}
      />
    </Link>
  );
}

/**
 * Article List Item Component
 * Portal uses 13px font-medium
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

interface ArticleListItemProps {
  slug: string;
  title: string;
  audienceSlug: string;
  isLast?: boolean;
}

export function ArticleListItem({ slug, title, audienceSlug, isLast = false }: ArticleListItemProps) {
  return (
    <Link
      to={`/hc/${audienceSlug}/articles/${slug}`}
      className="group flex items-center justify-between transition-colors duration-150"
      style={{
        padding: '10px 12px',
        borderBottom: isLast ? 'none' : `1px solid ${COLORS.BORDER}`,
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.HOVER_BG}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <span 
        className="truncate"
        style={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT, paddingRight: '8px' }}
      >
        {title}
      </span>
      <ChevronRight 
        className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ width: '14px', height: '14px', color: COLORS.TEXT_MUTED }}
      />
    </Link>
  );
}

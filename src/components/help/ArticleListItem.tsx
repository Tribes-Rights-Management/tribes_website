/**
 * Article List Item Component
 * Used in category page list view
 * Typography matches Portal exactly
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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
      className="group flex items-center justify-between hover:bg-[#F3F4F6] transition-colors duration-150"
      style={{
        padding: '12px 14px',
        borderBottom: isLast ? 'none' : '1px solid #E6E8EC',
      }}
    >
      <span 
        className="truncate"
        style={{ 
          fontSize: '13px', 
          fontWeight: 500, 
          color: '#1F2937',
          paddingRight: '8px',
        }}
      >
        {title}
      </span>
      <ChevronRight 
        className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ width: '14px', height: '14px', color: '#9CA3AF' }}
      />
    </Link>
  );
}

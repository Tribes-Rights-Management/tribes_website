/**
 * Article List Item Component
 * Used in stacked list on category page
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
      className={`
        group flex items-center justify-between
        px-4 py-[14px]
        hover:bg-[#fafafa] transition-colors duration-150
        ${!isLast ? 'border-b border-[#f5f5f5]' : ''}
      `}
    >
      <span className="text-[14px] font-medium text-[#1a1a1a]">
        {title}
      </span>
      <ChevronRight 
        size={16} 
        className="text-[#a3a3a3] shrink-0" 
      />
    </Link>
  );
}

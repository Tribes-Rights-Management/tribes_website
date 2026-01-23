/**
 * Article List Item
 * Full-width list item for category pages
 * Padding: 14px 16px, border-bottom: #f5f5f5
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ArticleListItemProps {
  slug: string;
  title: string;
  isLast?: boolean;
}

export function ArticleListItem({ slug, title, isLast = false }: ArticleListItemProps) {
  return (
    <Link
      to={`/hc/articles/${slug}`}
      className={`
        group flex items-center justify-between 
        px-4 py-[14px]
        bg-white cursor-pointer
        text-[14px] font-medium text-[#1a1a1a]
        transition-colors duration-150
        hover:bg-[#fafafa]
        ${!isLast ? 'border-b border-[#f5f5f5]' : ''}
      `}
    >
      <span>{title}</span>
      <ChevronRight 
        size={16} 
        className="
          shrink-0 text-[#a3a3a3] 
          transition-transform duration-150 
          group-hover:translate-x-0.5
        " 
      />
    </Link>
  );
}

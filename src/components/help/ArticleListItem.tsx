/**
 * Article List Item
 * Full-width list item with border, used on category pages
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
      to={`/help/articles/${slug}`}
      className={`
        group flex items-center justify-between 
        px-5 py-4
        transition-all duration-150
        hover:bg-[#fafafa]
        ${!isLast ? 'border-b border-[#f0f0f0]' : ''}
      `}
    >
      <span className="text-[14px] font-medium text-[#1a1a1a] pr-4">
        {title}
      </span>
      <ChevronRight 
        size={16} 
        className="
          shrink-0 text-[#999999] 
          transition-transform duration-150 
          group-hover:translate-x-0.5 group-hover:text-[#666666]
        " 
      />
    </Link>
  );
}

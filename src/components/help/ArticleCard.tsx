/**
 * Article Card
 * Grid item with title and chevron, hover animation
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ArticleCardProps {
  slug: string;
  title: string;
}

export function ArticleCard({ slug, title }: ArticleCardProps) {
  return (
    <Link
      to={`/help/articles/${slug}`}
      className="
        group flex items-center justify-between 
        px-5 py-4 
        border border-[#f0f0f0] rounded-lg
        transition-all duration-150
        hover:border-[#e5e5e5] hover:bg-[#fafafa]
      "
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

/**
 * Article Card
 * Grid item with title and chevron, hover animation
 * Padding: 14px 16px, border: #f5f5f5, radius: 6px
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
      to={`/hc/articles/${slug}`}
      className="
        group flex items-center justify-between 
        px-4 py-[14px]
        border border-[#f5f5f5] rounded-md
        bg-white cursor-pointer
        transition-all duration-150
        hover:border-[#e5e5e5] hover:bg-[#fafafa]
      "
    >
      <span className="text-[14px] font-medium text-[#1a1a1a] pr-3">
        {title}
      </span>
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

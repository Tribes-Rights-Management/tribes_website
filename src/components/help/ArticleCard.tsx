/**
 * Article Card Component
 * Used in grid layout on home page
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ArticleCardProps {
  slug: string;
  title: string;
  audienceSlug: string;
}

export function ArticleCard({ slug, title, audienceSlug }: ArticleCardProps) {
  return (
    <Link
      to={`/hc/${audienceSlug}/articles/${slug}`}
      className="
        group flex items-center justify-between
        p-[14px_16px] border border-[#f5f5f5] rounded-md
        hover:border-[#e5e5e5] hover:bg-[#fafafa]
        transition-all duration-150
      "
    >
      <span className="text-[14px] font-medium text-[#1a1a1a] truncate pr-2">
        {title}
      </span>
      <ChevronRight 
        size={16} 
        className="text-[#a3a3a3] shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" 
      />
    </Link>
  );
}

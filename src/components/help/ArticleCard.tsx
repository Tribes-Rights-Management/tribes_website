/**
 * Article Card Component
 * Used in grid layout on home page
 * Typography matches Portal exactly
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
      className="group flex items-center justify-between hover:bg-[#F3F4F6] transition-colors duration-150"
      style={{
        padding: '10px 12px',
        border: '1px solid #E6E8EC',
        borderRadius: '6px',
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

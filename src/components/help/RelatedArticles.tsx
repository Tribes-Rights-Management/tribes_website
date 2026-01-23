/**
 * Related Articles Section
 * Shows up to 3 related articles from same category
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ArticleByAudience } from "@/types/helpCenter";

interface RelatedArticlesProps {
  articles: ArticleByAudience[];
  audienceSlug: string;
}

export function RelatedArticles({ articles, audienceSlug }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a3a3a3] mb-4">
        Related Articles
      </h3>
      <div className="border border-[#f5f5f5] rounded-lg overflow-hidden">
        {articles.map((article, index) => (
          <Link
            key={article.article_id}
            to={`/hc/${audienceSlug}/articles/${article.article_slug}`}
            className={`
              flex items-center justify-between px-4 py-[14px]
              text-[14px] font-medium text-[#1a1a1a]
              hover:bg-[#fafafa] transition-colors duration-150
              ${index !== articles.length - 1 ? 'border-b border-[#f5f5f5]' : ''}
            `}
          >
            <span>{article.article_title}</span>
            <ChevronRight size={16} className="text-[#a3a3a3] shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Related Articles Section
 * Margin-top: 48px, uppercase label, list styling
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getArticleBySlug } from "@/data/helpArticles";

interface RelatedArticlesProps {
  articleSlugs: string[];
}

export function RelatedArticles({ articleSlugs }: RelatedArticlesProps) {
  const articles = articleSlugs
    .map(slug => getArticleBySlug(slug))
    .filter(Boolean);

  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a3a3a3] mb-4">
        Related Articles
      </h2>
      <div className="border border-[#f5f5f5] rounded-lg overflow-hidden">
        {articles.map((article, index) => (
          <Link
            key={article!.slug}
            to={`/hc/articles/${article!.slug}`}
            className={`
              group flex items-center justify-between 
              px-4 py-[14px]
              bg-white
              text-[14px] font-medium text-[#1a1a1a]
              transition-colors duration-150
              hover:bg-[#fafafa]
              ${index < articles.length - 1 ? 'border-b border-[#f5f5f5]' : ''}
            `}
          >
            <span>{article!.title}</span>
            <ChevronRight 
              size={16} 
              className="shrink-0 text-[#a3a3a3] transition-transform duration-150 group-hover:translate-x-0.5" 
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Related Articles Section
 * Displays 2-3 related articles at the bottom of article pages
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
    .filter(Boolean)
    .slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[#f0f0f0]">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#999999] mb-4">
        Related Articles
      </h2>
      <ul className="space-y-0">
        {articles.map((article) => (
          <li key={article!.slug}>
            <Link
              to={`/help/articles/${article!.slug}`}
              className="
                group flex items-center justify-between 
                py-3
                transition-colors duration-150
                hover:text-[#1a1a1a]
              "
            >
              <span className="text-[14px] font-medium text-[#666666] group-hover:text-[#1a1a1a]">
                {article!.title}
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
          </li>
        ))}
      </ul>
    </section>
  );
}

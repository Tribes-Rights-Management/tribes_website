/**
 * Help Center Home Page
 * Shows all categories and articles for an audience
 */

import { useParams, Navigate } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleCard } from "@/components/help/ArticleCard";
import { 
  useCategories, 
  useArticlesByAudience,
  groupArticlesByCategory 
} from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

export default function HelpHomePage() {
  const { audience } = useParams<{ audience: string }>();
  
  // Validate audience and redirect if invalid
  const validAudiences = ["publishers", "songwriters", "licensing"];
  if (!audience || !validAudiences.includes(audience)) {
    return <Navigate to="/hc/publishers" replace />;
  }

  const { data: categories, isLoading: categoriesLoading } = useCategories(audience);
  const { data: articles, isLoading: articlesLoading } = useArticlesByAudience(audience);

  const isLoading = categoriesLoading || articlesLoading;
  const groupedArticles = categories && articles 
    ? groupArticlesByCategory(articles, categories)
    : [];

  return (
    <HelpLayout currentAudience={audience}>
      {/* Search Section */}
      <div className="mb-12">
        <h1 className="text-[24px] font-semibold text-[#1a1a1a] mb-5">
          How can we help?
        </h1>
        <HelpSearchInput 
          placeholder="Search all articles..." 
          articles={articles || []}
          currentAudience={audience}
        />
      </div>

      {/* Article Sections */}
      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            </div>
          ))}
        </div>
      ) : groupedArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-[#525252]">
            No articles available yet for this section.
          </p>
        </div>
      ) : (
        <div>
          {groupedArticles.map((group, index) => (
            <section key={group.category.slug}>
              <h2 
                className={`text-[16px] font-semibold text-[#1a1a1a] mb-4 ${
                  index === 0 ? 'mt-0' : 'mt-10'
                }`}
              >
                {group.category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.articles.slice(0, 4).map((article) => (
                  <ArticleCard 
                    key={article.article_id} 
                    slug={article.article_slug} 
                    title={article.article_title}
                    audienceSlug={audience}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </HelpLayout>
  );
}

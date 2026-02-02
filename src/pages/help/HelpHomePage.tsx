/**
 * Help Center Home Page
 * Shows all categories and articles for an audience
 * Typography matches Portal exactly
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
      {/* Search Section - Portal uses 22px title */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '22px', 
          fontWeight: 600, 
          color: '#1F2937',
          marginBottom: '16px',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}>
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
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Skeleton className="h-11" />
                <Skeleton className="h-11" />
                <Skeleton className="h-11" />
                <Skeleton className="h-11" />
              </div>
            </div>
          ))}
        </div>
      ) : groupedArticles.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            No articles available yet for this section.
          </p>
        </div>
      ) : (
        <div>
          {groupedArticles.map((group, index) => (
            <section key={group.category.slug}>
              <h2 style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#1F2937',
                marginBottom: '12px',
                marginTop: index === 0 ? 0 : '32px',
              }}>
                {group.category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '8px' }}>
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

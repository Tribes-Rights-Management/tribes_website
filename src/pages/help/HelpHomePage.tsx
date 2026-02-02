/**
 * Help Center Home Page
 * EXACT Portal typography from page-header.tsx and page-container.tsx
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

/* Portal exact colors from tribes-theme.css */
const COLORS = {
  TEXT: '#111827',           /* --tribes-fg */
  TEXT_SECONDARY: '#6B7280', /* --tribes-fg-secondary */
  TEXT_MUTED: '#9CA3AF',     /* --tribes-fg-muted */
};

export default function HelpHomePage() {
  const { audience } = useParams<{ audience: string }>();
  
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
      {/* Portal PageHeader: text-[18px] sm:text-[20px] font-medium */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: 500, 
          color: COLORS.TEXT,
          marginBottom: '16px',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton style={{ height: '16px', width: '120px', marginBottom: '12px' }} />
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '8px' }}>
                <Skeleton style={{ height: '40px' }} />
                <Skeleton style={{ height: '40px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : groupedArticles.length === 0 ? (
        <div className="text-center" style={{ padding: '48px 0' }}>
          <p style={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>
            No articles available yet for this section.
          </p>
        </div>
      ) : (
        <div>
          {groupedArticles.map((group, index) => (
            <section key={group.category.slug}>
              {/* Portal SectionHeader: text-[15px] sm:text-[16px] font-medium */}
              <h2 style={{ 
                fontSize: '15px', 
                fontWeight: 500, 
                color: COLORS.TEXT,
                marginBottom: '12px',
                marginTop: index === 0 ? 0 : '24px',
                lineHeight: 1.3,
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

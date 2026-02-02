/**
 * Help Center Category Page
 * EXACT Portal typography
 */

import { useParams, Navigate, Link } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleListItem } from "@/components/help/ArticleListItem";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { useCategory, useArticlesByCategory } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

/* Portal exact colors */
const COLORS = {
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  BORDER: '#E6E8EC',
};

export default function HelpCategoryPage() {
  const { audience, categorySlug } = useParams<{ 
    audience: string; 
    categorySlug: string;
  }>();
  
  const validAudiences = ["publishers", "songwriters", "licensing"];
  if (!audience || !validAudiences.includes(audience)) {
    return <Navigate to="/hc/publishers" replace />;
  }

  const { data: category, isLoading: categoryLoading, error: categoryError } = useCategory(audience, categorySlug);
  const { data: articles, isLoading: articlesLoading } = useArticlesByCategory(audience, categorySlug);

  const isLoading = categoryLoading || articlesLoading;

  if (!isLoading && (categoryError || !category)) {
    return (
      <HelpLayout currentAudience={audience}>
        <div className="text-center" style={{ padding: '48px 0' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: COLORS.TEXT, marginBottom: '12px' }}>
            Category not found
          </h1>
          <p style={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY, marginBottom: '16px' }}>
            The category you're looking for doesn't exist.
          </p>
          <Link 
            to={`/hc/${audience}`}
            style={{ fontSize: '13px', fontWeight: 500, color: COLORS.TEXT, textDecoration: 'underline' }}
          >
            Back to Help Center
          </Link>
        </div>
      </HelpLayout>
    );
  }

  return (
    <HelpLayout currentAudience={audience} currentCategorySlug={categorySlug}>
      {isLoading ? (
        <>
          <Skeleton style={{ height: '14px', width: '140px', marginBottom: '20px' }} />
          <Skeleton style={{ height: '20px', width: '180px', marginBottom: '6px' }} />
          <Skeleton style={{ height: '14px', width: '60px', marginBottom: '20px' }} />
          <Skeleton style={{ height: '40px', width: '100%', marginBottom: '20px' }} />
          <div style={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '6px', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ padding: '12px 14px', borderBottom: i < 4 ? `1px solid ${COLORS.BORDER}` : 'none' }}>
                <Skeleton style={{ height: '14px', width: '75%' }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Breadcrumb 
            items={[{ label: category!.category_name }]} 
            audienceSlug={audience}
          />
          
          {/* Category Header - Portal: 20px font-medium */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 500, 
              color: COLORS.TEXT,
              marginBottom: '4px',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}>
              {category!.category_name}
            </h1>
            <p style={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
              {articles?.length || 0} articles
            </p>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '16px' }}>
            <HelpSearchInput 
              placeholder="Search in this category..." 
              articles={articles || []}
              currentAudience={audience}
            />
          </div>

          {/* Article List */}
          {articles && articles.length > 0 ? (
            <div style={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '6px', overflow: 'hidden' }}>
              {articles.map((article, index) => (
                <ArticleListItem 
                  key={article.article_id} 
                  slug={article.article_slug} 
                  title={article.article_title}
                  audienceSlug={audience}
                  isLast={index === articles.length - 1}
                />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>
              No articles in this category yet.
            </p>
          )}
        </>
      )}
    </HelpLayout>
  );
}

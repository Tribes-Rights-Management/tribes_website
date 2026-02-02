/**
 * Help Center Category Page
 * Mercury-inspired with better mobile touch targets
 * Inline article list items, 14px 16px padding
 */

import { useParams, Navigate, Link } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { useCategory, useArticlesByCategory } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

/* Portal exact colors */
const COLORS = {
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  BORDER: '#E6E8EC',
  HOVER_BG: '#F9FAFB',
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
          <Skeleton style={{ height: '48px', width: '100%', marginBottom: '20px' }} />
          <div style={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: i < 4 ? `1px solid ${COLORS.BORDER}` : 'none' }}>
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
          
          {/* Category Header */}
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
          <div style={{ marginBottom: '20px' }}>
            <HelpSearchInput 
              placeholder="Search in this category..." 
              articles={articles || []}
              currentAudience={audience}
            />
          </div>

          {/* Article List - Inline items with better touch targets */}
          {articles && articles.length > 0 ? (
            <div style={{ 
              border: `1px solid ${COLORS.BORDER}`, 
              borderRadius: '10px', 
              overflow: 'hidden',
            }}>
              {articles.map((article, index) => (
                <Link
                  key={article.article_id}
                  to={`/hc/${audience}/articles/${article.article_slug}`}
                  className="flex items-center justify-between"
                  style={{
                    padding: '14px 16px',
                    borderBottom: index !== articles.length - 1 ? `1px solid ${COLORS.BORDER}` : 'none',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.HOVER_BG}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span 
                    className="truncate"
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: COLORS.TEXT, 
                      paddingRight: '12px',
                    }}
                  >
                    {article.article_title}
                  </span>
                  <ChevronRight 
                    className="shrink-0"
                    style={{ width: '16px', height: '16px', color: COLORS.TEXT_MUTED }}
                  />
                </Link>
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

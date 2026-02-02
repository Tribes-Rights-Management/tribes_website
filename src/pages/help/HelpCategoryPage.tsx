/**
 * Help Center Category Page
 * Shows all articles in a category
 * Typography matches Portal exactly
 */

import { useParams, Navigate, Link } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleListItem } from "@/components/help/ArticleListItem";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { useCategory, useArticlesByCategory } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

export default function HelpCategoryPage() {
  const { audience, categorySlug } = useParams<{ 
    audience: string; 
    categorySlug: string;
  }>();
  
  // Validate audience
  const validAudiences = ["publishers", "songwriters", "licensing"];
  if (!audience || !validAudiences.includes(audience)) {
    return <Navigate to="/hc/publishers" replace />;
  }

  const { data: category, isLoading: categoryLoading, error: categoryError } = useCategory(audience, categorySlug);
  const { data: articles, isLoading: articlesLoading } = useArticlesByCategory(audience, categorySlug);

  const isLoading = categoryLoading || articlesLoading;

  // Handle not found
  if (!isLoading && (categoryError || !category)) {
    return (
      <HelpLayout currentAudience={audience}>
        <div className="text-center py-12">
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1F2937', marginBottom: '12px' }}>
            Category not found
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
            The category you're looking for doesn't exist.
          </p>
          <Link 
            to={`/hc/${audience}`}
            style={{ fontSize: '13px', fontWeight: 500, color: '#1F2937', textDecoration: 'underline' }}
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
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-1" />
          <Skeleton className="h-4 w-24 mb-6" />
          <Skeleton className="h-11 w-full mb-6" />
          <div className="border border-[#E6E8EC] rounded-lg overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-4 py-3 border-b border-[#E6E8EC] last:border-b-0">
                <Skeleton className="h-4 w-3/4" />
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
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: '#1F2937',
              marginBottom: '6px',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}>
              {category!.category_name}
            </h1>
            {category!.category_description && (
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                {category!.category_description}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
              {articles?.length || 0} articles
            </p>
          </div>

          {/* Search in Category */}
          <div style={{ marginBottom: '20px' }}>
            <HelpSearchInput 
              placeholder="Search in this category..." 
              articles={articles || []}
              currentAudience={audience}
            />
          </div>

          {/* Article List */}
          {articles && articles.length > 0 ? (
            <div className="border border-[#E6E8EC] rounded-lg overflow-hidden">
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
            <p style={{ fontSize: '13px', color: '#6B7280' }}>
              No articles in this category yet.
            </p>
          )}
        </>
      )}
    </HelpLayout>
  );
}

/**
 * Help Center Category Page
 * Shows all articles in a category
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
          <h1 className="text-[24px] font-semibold text-[#1a1a1a] mb-4">
            Category not found
          </h1>
          <p className="text-[14px] text-[#525252] mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Link 
            to={`/hc/${audience}`}
            className="text-[14px] font-medium text-[#1a1a1a] underline hover:no-underline"
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
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-1" />
          <Skeleton className="h-4 w-24 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="border border-[#f5f5f5] rounded-lg overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-4 py-4 border-b border-[#f5f5f5] last:border-b-0">
                <Skeleton className="h-5 w-3/4" />
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
          <div className="mb-8">
            <h1 className="text-[24px] font-semibold text-[#1a1a1a] mb-2">
              {category!.category_name}
            </h1>
            {category!.category_description && (
              <p className="text-[14px] text-[#525252] mb-1">
                {category!.category_description}
              </p>
            )}
            <p className="text-[13px] text-[#a3a3a3]">
              {articles?.length || 0} articles
            </p>
          </div>

          {/* Search in Category */}
          <div className="mb-6">
            <HelpSearchInput 
              placeholder="Search in this category..." 
              articles={articles || []}
              currentAudience={audience}
            />
          </div>

          {/* Article List */}
          {articles && articles.length > 0 ? (
            <div className="border border-[#f5f5f5] rounded-lg overflow-hidden">
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
            <p className="text-[14px] text-[#525252]">
              No articles in this category yet.
            </p>
          )}
        </>
      )}
    </HelpLayout>
  );
}

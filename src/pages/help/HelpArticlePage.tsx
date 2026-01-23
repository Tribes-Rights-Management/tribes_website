/**
 * Help Center Article Page
 * Displays article content with markdown rendering
 */

import { useParams, Navigate, Link } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { FeedbackButtons } from "@/components/help/FeedbackButtons";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ArticleContent } from "@/components/help/ArticleContent";
import { useArticle, useRelatedArticles } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";

export default function HelpArticlePage() {
  const { audience, articleSlug } = useParams<{ 
    audience: string; 
    articleSlug: string;
  }>();
  
  // Validate audience
  const validAudiences = ["publishers", "songwriters", "licensing"];
  if (!audience || !validAudiences.includes(audience)) {
    return <Navigate to="/hc/publishers" replace />;
  }

  const { data: article, isLoading: articleLoading, error: articleError } = useArticle(audience, articleSlug);
  const { data: relatedArticles } = useRelatedArticles(
    audience, 
    article?.category_slug, 
    articleSlug
  );

  // Handle not found
  if (!articleLoading && (articleError || !article)) {
    return (
      <HelpLayout currentAudience={audience}>
        <div className="text-center py-12">
          <h1 className="text-[24px] font-semibold text-[#1a1a1a] mb-4">
            Article not found
          </h1>
          <p className="text-[14px] text-[#525252] mb-6">
            The article you're looking for doesn't exist.
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <HelpLayout 
      currentAudience={audience} 
      currentCategorySlug={article?.category_slug}
    >
      {articleLoading ? (
        <>
          <Skeleton className="h-4 w-64 mb-6" />
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-8 w-3/4 mb-3" />
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </>
      ) : (
        <article>
          <Breadcrumb 
            items={[
              { 
                label: article!.category_name, 
                href: `/hc/${audience}/categories/${article!.category_slug}` 
              },
              { label: article!.article_title }
            ]} 
            audienceSlug={audience}
          />
          
          {/* Article Header */}
          <header className="mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#a3a3a3] mb-3 block">
              {article!.category_name}
            </span>
            <h1 className="text-[28px] font-semibold text-[#1a1a1a] leading-[1.3] mb-3">
              {article!.article_title}
            </h1>
            <p className="text-[13px] text-[#a3a3a3]">
              Updated {formatDate(article!.updated_at)}
            </p>
          </header>

          {/* Article Body */}
          <ArticleContent content={article!.article_content} />

          <FeedbackButtons articleSlug={article!.article_slug} />
          
          {relatedArticles && relatedArticles.length > 0 && (
            <RelatedArticles 
              articles={relatedArticles} 
              audienceSlug={audience}
            />
          )}
        </article>
      )}
    </HelpLayout>
  );
}

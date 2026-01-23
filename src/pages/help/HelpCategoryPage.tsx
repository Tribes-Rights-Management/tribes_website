import { useParams } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleListItem } from "@/components/help/ArticleListItem";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { getCategoryById } from "@/data/helpCategories";
import NotFound from "@/pages/NotFound";

export default function HelpCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  if (!category) return <NotFound />;

  return (
    <HelpLayout>
      <Breadcrumb items={[{ label: category.name }]} />
      
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[#1a1a1a] mb-2">
          {category.name}
        </h1>
        <p className="text-[14px] text-[#525252] mb-1">
          {category.description}
        </p>
        <p className="text-[13px] text-[#a3a3a3]">
          {category.articles.length} articles
        </p>
      </div>

      {/* Search in Category */}
      <div className="mb-6">
        <HelpSearchInput 
          placeholder="Search in this category..." 
          categoryFilter={category.id}
        />
      </div>

      {/* Article List */}
      <div className="border border-[#f5f5f5] rounded-lg overflow-hidden">
        {category.articles.map((article, index) => (
          <ArticleListItem 
            key={article.slug} 
            slug={article.slug} 
            title={article.title}
            isLast={index === category.articles.length - 1}
          />
        ))}
      </div>
    </HelpLayout>
  );
}

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
      
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#1a1a1a] mb-2">
          {category.name}
        </h1>
        <p className="text-[15px] text-[#666666] mb-1">
          {category.description}
        </p>
        <p className="text-[13px] text-[#999999]">
          {category.articles.length} articles
        </p>
      </div>

      <div className="mb-8">
        <HelpSearchInput 
          placeholder={`Search in ${category.name}...`} 
          categoryFilter={category.id}
        />
      </div>

      <div className="border border-[#f0f0f0] rounded-lg overflow-hidden">
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

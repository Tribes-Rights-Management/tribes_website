import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleCard } from "@/components/help/ArticleCard";
import { helpCategories } from "@/data/helpCategories";

export default function HelpHomePage() {
  return (
    <HelpLayout>
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-[#1a1a1a] mb-6">
          How can we help?
        </h1>
        <HelpSearchInput placeholder="Search all articles..." />
      </div>

      <div className="space-y-12">
        {helpCategories.map((category) => (
          <section key={category.id}>
            <h2 className="text-[18px] font-semibold text-[#1a1a1a] mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.articles.slice(0, 4).map((article) => (
                <ArticleCard key={article.slug} slug={article.slug} title={article.title} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </HelpLayout>
  );
}

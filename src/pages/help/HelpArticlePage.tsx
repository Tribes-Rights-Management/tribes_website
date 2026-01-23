import { useParams } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { Breadcrumb } from "@/components/help/Breadcrumb";
import { FeedbackButtons } from "@/components/help/FeedbackButtons";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { getArticleBySlug } from "@/data/helpArticles";
import { getCategoryById } from "@/data/helpCategories";
import NotFound from "@/pages/NotFound";

export default function HelpArticlePage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = articleSlug ? getArticleBySlug(articleSlug) : undefined;
  const category = article ? getCategoryById(article.category) : undefined;

  if (!article || !category) return <NotFound />;

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1">
            {listItems.map((item, i) => (
              <li key={i} className="text-[15px] leading-[1.7] text-[#1a1a1a]">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="text-[20px] font-semibold text-[#1a1a1a] mt-8 mb-4">{trimmed.slice(3)}</h2>);
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="text-[16px] font-semibold text-[#1a1a1a] mt-6 mb-3">{trimmed.slice(4)}</h3>);
      } else if (trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.slice(2));
      } else if (trimmed.match(/^\d+\. \*\*/)) {
        flushList();
        const text = trimmed.replace(/\*\*/g, '');
        elements.push(<p key={i} className="text-[15px] leading-[1.7] text-[#1a1a1a] mb-2 font-medium">{text}</p>);
      } else if (trimmed) {
        flushList();
        elements.push(<p key={i} className="text-[15px] leading-[1.7] text-[#1a1a1a] mb-4">{trimmed}</p>);
      }
    });
    
    flushList();
    return elements;
  };

  return (
    <HelpLayout>
      <Breadcrumb items={[
        { label: category.name, href: `/help/categories/${category.id}` },
        { label: article.title }
      ]} />
      
      <article>
        <header className="mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#999999] mb-2 block">
            {category.name}
          </span>
          <h1 className="text-[32px] font-semibold text-[#1a1a1a] leading-tight mb-3">
            {article.title}
          </h1>
          <p className="text-[13px] text-[#999999]">
            Updated {new Date(article.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </p>
        </header>

        <div className="prose-tribes">
          {renderContent(article.content)}
        </div>

        <FeedbackButtons articleSlug={article.slug} />
        
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <RelatedArticles articleSlugs={article.relatedArticles} />
        )}
      </article>
    </HelpLayout>
  );
}

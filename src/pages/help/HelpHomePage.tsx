/**
 * Help Center Home Page
 * Mercury-inspired mobile-first design
 * Mobile: Two-column sections grid with icons
 * Desktop: Article cards layout
 */

import { Navigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpSearchInput } from "@/components/help/HelpSearchInput";
import { ArticleCard } from "@/components/help/ArticleCard";
import { useCategories, useArticlesByAudience } from "@/hooks/useHelpCenter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Settings, 
  CreditCard, 
  Users,
  Music,
  Shield,
  Headphones,
  BarChart3,
  type LucideIcon
} from "lucide-react";

/* Portal exact colors */
const COLORS = {
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  BORDER: '#E6E8EC',
  SECTION_BG: '#F9FAFB',
};

/* Icon mapping for categories */
const iconMap: Record<string, LucideIcon> = {
  'getting-started': BookOpen,
  'account': Settings,
  'billing': CreditCard,
  'team': Users,
  'catalog': Music,
  'security': Shield,
  'support': Headphones,
  'reports': BarChart3,
  'documents': FileText,
  'help': HelpCircle,
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
  const recentArticles = articles?.slice(0, 6) || [];

  return (
    <HelpLayout currentAudience={audience}>
      {isLoading ? (
        <>
          <Skeleton style={{ height: '28px', width: '220px', marginBottom: '20px' }} />
          <Skeleton style={{ height: '48px', width: '100%', marginBottom: '32px' }} />
          <div className="grid grid-cols-2 gap-3 md:hidden" style={{ marginBottom: '24px' }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} style={{ height: '60px', borderRadius: '8px' }} />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Page Title - 28px on mobile, 20px on desktop */}
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 500, 
            color: COLORS.TEXT,
            marginBottom: '20px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            <span className="md:hidden">How can we help?</span>
            <span className="hidden md:inline" style={{ fontSize: '20px', letterSpacing: '-0.01em' }}>
              {audience === 'publishers' ? 'Publisher' : audience === 'songwriters' ? 'Songwriter' : 'Licensing'} Help Center
            </span>
          </h1>

          {/* Search */}
          <div style={{ marginBottom: '32px' }}>
            <HelpSearchInput 
              placeholder="Search articles..." 
              articles={articles || []}
              currentAudience={audience}
            />
          </div>

          {/* Mobile: Sections Grid */}
          <div className="md:hidden" style={{ marginBottom: '32px' }}>
            {/* Section Label */}
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: COLORS.TEXT_MUTED,
              marginBottom: '12px',
            }}>
              SECTIONS
            </div>

            {/* Two-column grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '10px',
            }}>
              {categories?.map((category) => {
                const IconComponent = iconMap[category.category_slug] || FileText;
                return (
                  <Link
                    key={category.category_id}
                    to={`/hc/${audience}/categories/${category.category_slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      backgroundColor: COLORS.SECTION_BG,
                      borderRadius: '8px',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.SECTION_BG}
                  >
                    <IconComponent 
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        color: COLORS.TEXT_SECONDARY,
                        flexShrink: 0,
                      }} 
                    />
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: 500, 
                      color: COLORS.TEXT,
                      lineHeight: 1.3,
                    }}>
                      {category.category_name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop: Recent Articles */}
          <div className="hidden md:block">
            {recentArticles.length > 0 && (
              <>
                <h2 style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: COLORS.TEXT,
                  marginBottom: '12px',
                }}>
                  Recent Articles
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '12px',
                }}>
                  {recentArticles.map((article) => (
                    <ArticleCard
                      key={article.article_id}
                      slug={article.article_slug}
                      title={article.article_title}
                      categoryName={article.category_name}
                      audienceSlug={audience}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile: Recent Articles (below sections) */}
          <div className="md:hidden">
            {recentArticles.length > 0 && (
              <>
                <div style={{ 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: COLORS.TEXT_MUTED,
                  marginBottom: '12px',
                }}>
                  RECENT ARTICLES
                </div>
                <div style={{ 
                  border: `1px solid ${COLORS.BORDER}`, 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                }}>
                  {recentArticles.map((article, index) => (
                    <Link
                      key={article.article_id}
                      to={`/hc/${audience}/articles/${article.article_slug}`}
                      style={{
                        display: 'block',
                        padding: '14px 16px',
                        borderBottom: index !== recentArticles.length - 1 ? `1px solid ${COLORS.BORDER}` : 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: COLORS.TEXT,
                        display: 'block',
                        marginBottom: '2px',
                      }}>
                        {article.article_title}
                      </span>
                      <span style={{ fontSize: '12px', color: COLORS.TEXT_MUTED }}>
                        {article.category_name}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </HelpLayout>
  );
}

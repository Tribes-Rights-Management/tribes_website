/**
 * TypeScript types for the public Help Center
 * Matches Supabase views: v_help_categories_by_audience, v_help_articles_by_audience
 */

export type HelpTab = "publishers" | "songwriters" | "licensing";

export interface Audience {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  is_active: boolean;
}

export interface CategoryByAudience {
  audience_id: string;
  audience_slug: string;
  audience_name: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  category_description: string | null;
  category_icon: string | null;
  position: number;
}

export interface ArticleByAudience {
  audience_id: string;
  audience_slug: string;
  category_id: string;
  category_slug: string;
  category_name: string;
  article_id: string;
  article_slug: string;
  article_title: string;
  article_content: string;
  status: string;
  updated_at: string;
  published_at: string | null;
  position: number;
}

export interface ArticlesByCategory {
  category: {
    slug: string;
    name: string;
    description?: string | null;
    icon?: string | null;
  };
  articles: ArticleByAudience[];
}


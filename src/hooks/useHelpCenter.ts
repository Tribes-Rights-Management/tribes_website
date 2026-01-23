/**
 * React Query hooks for Help Center data fetching
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { 
  Audience, 
  CategoryByAudience, 
  ArticleByAudience,
  ArticlesByCategory 
} from "@/types/helpCenter";

// Fetch all active audiences
export function useAudiences() {
  return useQuery({
    queryKey: ["help-audiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_audiences")
        .select("*")
        .eq("is_active", true)
        .order("position");
      
      if (error) throw error;
      return data as Audience[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch categories for a specific audience
export function useCategories(audienceSlug: string | undefined) {
  return useQuery({
    queryKey: ["help-categories", audienceSlug],
    queryFn: async () => {
      if (!audienceSlug) return [];
      
      const { data, error } = await supabase
        .from("v_help_categories_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .order("position");
      
      if (error) throw error;
      return data as CategoryByAudience[];
    },
    enabled: !!audienceSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch all articles for an audience, grouped by category
export function useArticlesByAudience(audienceSlug: string | undefined) {
  return useQuery({
    queryKey: ["help-articles", audienceSlug],
    queryFn: async () => {
      if (!audienceSlug) return [];
      
      const { data, error } = await supabase
        .from("v_help_articles_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .order("position");
      
      if (error) throw error;
      return data as ArticleByAudience[];
    },
    enabled: !!audienceSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch articles for a specific category
export function useArticlesByCategory(
  audienceSlug: string | undefined, 
  categorySlug: string | undefined
) {
  return useQuery({
    queryKey: ["help-articles", audienceSlug, categorySlug],
    queryFn: async () => {
      if (!audienceSlug || !categorySlug) return [];
      
      const { data, error } = await supabase
        .from("v_help_articles_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .eq("category_slug", categorySlug)
        .order("position");
      
      if (error) throw error;
      return data as ArticleByAudience[];
    },
    enabled: !!audienceSlug && !!categorySlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch a single category's info
export function useCategory(
  audienceSlug: string | undefined, 
  categorySlug: string | undefined
) {
  return useQuery({
    queryKey: ["help-category", audienceSlug, categorySlug],
    queryFn: async () => {
      if (!audienceSlug || !categorySlug) return null;
      
      const { data, error } = await supabase
        .from("v_help_categories_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .eq("category_slug", categorySlug)
        .single();
      
      if (error) throw error;
      return data as CategoryByAudience;
    },
    enabled: !!audienceSlug && !!categorySlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch a single article
export function useArticle(
  audienceSlug: string | undefined, 
  articleSlug: string | undefined
) {
  return useQuery({
    queryKey: ["help-article", audienceSlug, articleSlug],
    queryFn: async () => {
      if (!audienceSlug || !articleSlug) return null;
      
      const { data, error } = await supabase
        .from("v_help_articles_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .eq("article_slug", articleSlug)
        .single();
      
      if (error) throw error;
      return data as ArticleByAudience;
    },
    enabled: !!audienceSlug && !!articleSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch related articles (same category, excluding current)
export function useRelatedArticles(
  audienceSlug: string | undefined,
  categorySlug: string | undefined,
  currentArticleSlug: string | undefined
) {
  return useQuery({
    queryKey: ["help-related-articles", audienceSlug, categorySlug, currentArticleSlug],
    queryFn: async () => {
      if (!audienceSlug || !categorySlug || !currentArticleSlug) return [];
      
      const { data, error } = await supabase
        .from("v_help_articles_by_audience")
        .select("*")
        .eq("audience_slug", audienceSlug)
        .eq("category_slug", categorySlug)
        .neq("article_slug", currentArticleSlug)
        .order("position")
        .limit(3);
      
      if (error) throw error;
      return data as ArticleByAudience[];
    },
    enabled: !!audienceSlug && !!categorySlug && !!currentArticleSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Group articles by category
export function groupArticlesByCategory(
  articles: ArticleByAudience[],
  categories: CategoryByAudience[]
): ArticlesByCategory[] {
  const grouped: Record<string, ArticlesByCategory> = {};
  
  // Initialize with all categories
  categories.forEach(cat => {
    grouped[cat.category_slug] = {
      category: {
        slug: cat.category_slug,
        name: cat.category_name,
        description: cat.category_description,
        icon: cat.category_icon,
      },
      articles: [],
    };
  });
  
  // Add articles to their categories
  articles.forEach(article => {
    if (grouped[article.category_slug]) {
      grouped[article.category_slug].articles.push(article);
    }
  });
  
  // Convert to array and filter empty categories
  return Object.values(grouped).filter(g => g.articles.length > 0);
}

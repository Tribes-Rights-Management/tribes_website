/**
 * Help Center Type Definitions
 * Mercury-style institutional help center
 */

export interface HelpArticle {
  slug: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
  relatedArticles?: string[];
}

export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: { slug: string; title: string }[];
}

export type HelpTab = "publishers" | "songwriters" | "licensing";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
}

export function useKnowledgeBaseSearch(query: string, debounceMs = 300) {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchArticles = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setArticles([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchTerms = searchQuery.trim().toLowerCase();
      
      const { data, error } = await supabase
        .from("support_knowledge_base")
        .select("id, title, content, category")
        .eq("is_active", true)
        .or(`title.ilike.%${searchTerms}%,content.ilike.%${searchTerms}%`)
        .limit(3);

      if (error) {
        console.error("Knowledge base search error:", error);
        setArticles([]);
        return;
      }

      setArticles(data || []);
    } catch (err) {
      console.error("Knowledge base search failed:", err);
      setArticles([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchArticles(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, searchArticles]);

  const clearResults = useCallback(() => {
    setArticles([]);
  }, []);

  return { articles, isSearching, clearResults };
}

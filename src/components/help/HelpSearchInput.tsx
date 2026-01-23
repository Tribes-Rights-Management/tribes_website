/**
 * Help Center Search Input
 * Real-time search with results dropdown
 */

import { useState, useRef, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ArticleByAudience } from "@/types/helpCenter";

interface HelpSearchInputProps {
  placeholder?: string;
  articles: ArticleByAudience[];
  currentAudience: string;
}

export function HelpSearchInput({ 
  placeholder = "Search all articles...", 
  articles,
  currentAudience 
}: HelpSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter articles based on search query
  const filteredArticles = query.trim()
    ? articles.filter((article) =>
        article.article_title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3a3a3]" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="
            w-full h-12 pl-11 pr-4
            text-[14px] text-[#1a1a1a] placeholder:text-[#a3a3a3]
            bg-white border border-[#e5e5e5] rounded-lg
            focus:outline-none focus:border-[#1a1a1a]
            transition-colors duration-150
          "
        />
      </div>

      {/* Results dropdown */}
      {isOpen && filteredArticles.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-20 overflow-hidden">
          {filteredArticles.map((article, index) => (
            <Link
              key={article.article_id}
              to={`/hc/${currentAudience}/articles/${article.article_slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className={`
                flex items-center justify-between px-4 py-3
                text-[14px] text-[#1a1a1a] hover:bg-[#fafafa]
                ${index !== filteredArticles.length - 1 ? 'border-b border-[#f5f5f5]' : ''}
              `}
            >
              <div>
                <span className="font-medium">{article.article_title}</span>
                <span className="text-[12px] text-[#a3a3a3] ml-2">{article.category_name}</span>
              </div>
              <ChevronRight size={16} className="text-[#a3a3a3]" />
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && filteredArticles.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-20 p-4">
          <p className="text-[14px] text-[#a3a3a3]">No articles found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

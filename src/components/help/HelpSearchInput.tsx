/**
 * Help Center Search Input
 * Real-time search with results dropdown
 * Typography matches Portal exactly
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
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ width: '16px', height: '16px', color: '#9CA3AF' }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={(e) => {
            setIsOpen(true);
            e.currentTarget.style.borderColor = '#1F2937';
          }}
          onBlur={(e) => e.currentTarget.style.borderColor = '#E6E8EC'}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '36px',
            paddingRight: '12px',
            fontSize: '13px',
            color: '#1F2937',
            backgroundColor: 'white',
            border: '1px solid #E6E8EC',
            borderRadius: '6px',
            outline: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        />
      </div>

      {/* Results dropdown */}
      {isOpen && filteredArticles.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E8EC] rounded-lg shadow-lg z-20 overflow-hidden"
        >
          {filteredArticles.map((article, index) => (
            <Link
              key={article.article_id}
              to={`/hc/${currentAudience}/articles/${article.article_slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="flex items-center justify-between hover:bg-[#F3F4F6]"
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                color: '#1F2937',
                borderBottom: index !== filteredArticles.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{article.article_title}</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '8px' }}>{article.category_name}</span>
              </div>
              <ChevronRight style={{ width: '14px', height: '14px', color: '#9CA3AF' }} />
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && filteredArticles.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E8EC] rounded-lg shadow-lg z-20 p-3">
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>No articles found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

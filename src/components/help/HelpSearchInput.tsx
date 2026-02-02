/**
 * Help Center Search Input
 * Mercury-inspired enhanced styling
 * Height: 48px, Font: 15px, Icon: 18px
 * Background: #F9FAFB, Border radius: 10px
 */

import { useState, useRef, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ArticleByAudience } from "@/types/helpCenter";

/* Portal exact colors */
const COLORS = {
  TEXT: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  BORDER: '#E6E8EC',
  HOVER_BG: '#F3F4F6',
  INPUT_BG: '#F9FAFB',
};

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
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredArticles = query.trim()
    ? articles.filter((article) =>
        article.article_title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

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
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ width: '18px', height: '18px', color: COLORS.TEXT_MUTED }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => { setIsOpen(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '48px',
            paddingLeft: '48px',
            paddingRight: '16px',
            fontSize: '15px',
            color: COLORS.TEXT,
            backgroundColor: COLORS.INPUT_BG,
            border: `1px solid ${isFocused ? COLORS.TEXT_SECONDARY : COLORS.BORDER}`,
            borderRadius: '10px',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: isFocused ? '0 0 0 3px rgba(107, 114, 128, 0.1)' : 'none',
          }}
        />
      </div>

      {isOpen && filteredArticles.length > 0 && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            border: `1px solid ${COLORS.BORDER}`,
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          {filteredArticles.map((article, index) => (
            <Link
              key={article.article_id}
              to={`/hc/${currentAudience}/articles/${article.article_slug}`}
              onClick={() => { setIsOpen(false); setQuery(""); }}
              className="flex items-center justify-between"
              style={{
                padding: '12px 16px',
                fontSize: '14px',
                color: COLORS.TEXT,
                borderBottom: index !== filteredArticles.length - 1 ? `1px solid ${COLORS.HOVER_BG}` : 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.HOVER_BG}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{article.article_title}</span>
                <span style={{ fontSize: '12px', color: COLORS.TEXT_MUTED, marginLeft: '8px' }}>{article.category_name}</span>
              </div>
              <ChevronRight style={{ width: '14px', height: '14px', color: COLORS.TEXT_MUTED }} />
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim() && filteredArticles.length === 0 && (
        <div 
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            border: `1px solid ${COLORS.BORDER}`,
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 20,
            padding: '16px',
          }}
        >
          <p style={{ fontSize: '14px', color: COLORS.TEXT_MUTED }}>No articles found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

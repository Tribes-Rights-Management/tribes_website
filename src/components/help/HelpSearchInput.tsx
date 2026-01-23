/**
 * Help Center Search Input
 * Full-width search with icon and subtle styling
 */

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllArticles } from "@/data/helpCategories";

interface HelpSearchInputProps {
  placeholder?: string;
  categoryFilter?: string;
  onResultsChange?: (hasResults: boolean) => void;
}

export function HelpSearchInput({ 
  placeholder = "Search articles...", 
  categoryFilter,
  onResultsChange 
}: HelpSearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const allArticles = useMemo(() => getAllArticles(), []);
  
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return allArticles
      .filter(article => {
        const matchesQuery = article.title.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || article.categoryId === categoryFilter;
        return matchesQuery && matchesCategory;
      })
      .slice(0, 8);
  }, [query, allArticles, categoryFilter]);

  useEffect(() => {
    onResultsChange?.(filteredArticles.length > 0);
  }, [filteredArticles.length, onResultsChange]);

  const showResults = query.trim().length > 0 && isFocused;

  // Highlight matching text
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-100 text-inherit">{part}</mark> : part
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={`
            w-full pl-11 pr-10 py-3.5 
            text-[15px] text-[#1a1a1a] placeholder:text-[#999999]
            bg-white border border-[#e5e5e5] rounded-lg
            transition-all duration-150
            focus:outline-none focus:border-[#1a1a1a] focus:shadow-[0_0_0_1px_rgba(26,26,26,0.05)]
          `}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#999999] hover:text-[#666666]"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e5e5e5] rounded-lg shadow-lg overflow-hidden z-20">
          {filteredArticles.length > 0 ? (
            <ul>
              {filteredArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    to={`/help/articles/${article.slug}`}
                    className="block px-4 py-3 hover:bg-[#fafafa] transition-colors duration-150 border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <div className="text-[14px] font-medium text-[#1a1a1a]">
                      {highlightMatch(article.title, query)}
                    </div>
                    <div className="text-[12px] text-[#999999] mt-0.5">
                      {article.categoryName}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-[14px] text-[#666666]">
              No articles found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

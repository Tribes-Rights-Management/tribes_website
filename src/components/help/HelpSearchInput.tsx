/**
 * Help Center Search Input
 * 48px height, minimal styling, no shadows
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { helpCategories } from "@/data/helpCategories";

interface HelpSearchInputProps {
  placeholder?: string;
  categoryFilter?: string;
}

interface SearchResult {
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
}

export function HelpSearchInput({ 
  placeholder = "Search all articles...", 
  categoryFilter 
}: HelpSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const category of helpCategories) {
      if (categoryFilter && category.id !== categoryFilter) continue;
      
      for (const article of category.articles) {
        if (article.title.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            slug: article.slug,
            title: article.title,
            categoryId: category.id,
            categoryName: category.name
          });
        }
      }
    }

    setResults(searchResults.slice(0, 8));
    setIsOpen(searchResults.length > 0);
    setSelectedIndex(-1);
  }, [query, categoryFilter]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          navigate(`/hc/articles/${results[selectedIndex].slug}`);
          setIsOpen(false);
          setQuery("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#a3a3a3]" 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="
            w-full h-12 pl-11 pr-4
            border border-[#e5e5e5] rounded-lg
            text-[14px] text-[#1a1a1a] bg-white
            placeholder:text-[#a3a3a3]
            focus:outline-none focus:border-[#1a1a1a]
            transition-colors duration-150
          "
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#e5e5e5] rounded-lg overflow-hidden z-50"
        >
          {results.map((result, index) => (
            <button
              key={result.slug}
              onClick={() => {
                navigate(`/hc/articles/${result.slug}`);
                setIsOpen(false);
                setQuery("");
              }}
              className={`
                w-full text-left px-4 py-3 
                text-[14px] text-[#1a1a1a]
                transition-colors duration-150
                ${index === selectedIndex ? 'bg-[#f5f5f5]' : 'hover:bg-[#fafafa]'}
                ${index < results.length - 1 ? 'border-b border-[#f5f5f5]' : ''}
              `}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-[12px] text-[#a3a3a3] mt-0.5">{result.categoryName}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

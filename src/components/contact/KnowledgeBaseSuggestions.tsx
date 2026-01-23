import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface KnowledgeBaseSuggestionsProps {
  articles: KnowledgeBaseArticle[];
  isSearching: boolean;
  onContinue: () => void;
}

export function KnowledgeBaseSuggestions({
  articles,
  isSearching,
  onContinue,
}: KnowledgeBaseSuggestionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isSearching) {
    return (
      <div className="text-[13px] text-muted-foreground py-2">
        Searching knowledge base...
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 pt-2">
      <p className="text-[13px] text-muted-foreground">
        We found some articles that might help:
      </p>
      
      <div className="space-y-2">
        {articles.map((article) => {
          const isExpanded = expandedId === article.id;
          
          return (
            <div
              key={article.id}
              className="border border-border rounded-lg overflow-hidden bg-background"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-left",
                  "hover:bg-muted/50 transition-colors"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-[14px] font-medium text-foreground truncate">
                    {article.title}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-3 pb-3 pt-0">
                  <div className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border pt-3">
                    {article.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onContinue}
        className="w-full"
      >
        Continue with my question
      </Button>
    </div>
  );
}

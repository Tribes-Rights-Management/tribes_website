/**
 * Public Help Article Browser
 *
 * A public read-only listing of help articles, browsable by category or as a
 * full list. Content is managed in the Tribes Portal; this page only reads
 * publicly available article metadata from Supabase.
 */

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------- types ---------- */

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
}

interface HelpCategory {
  id: string;
  slug: string;
  name: string;
}

interface CategoryArticle {
  id: string;
  article_id: string;
  category_id: string;
  position: number;
  article: HelpArticle;
}

/* ---------- component ---------- */

export default function HelpArticlesPage() {
  const [viewMode, setViewMode] = useState<"all" | "byCategory">("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch all articles
  const { data: allArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ["help-articles-browse"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("id, slug, title, status, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as HelpArticle[];
    },
  });

  // Fetch categories for dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["help-categories-browse"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_categories")
        .select("id, slug, name")
        .order("name");

      if (error) throw error;
      return data as HelpCategory[];
    },
  });

  // Fetch articles for selected category (read-only)
  const { data: categoryArticles, isLoading: categoryArticlesLoading } =
    useQuery({
      queryKey: ["help-category-articles-browse", selectedCategoryId],
      queryFn: async () => {
        if (!selectedCategoryId) return [];

        const { data, error } = await supabase
          .from("help_article_audiences")
          .select(
            `
            id,
            article_id,
            category_id,
            position,
            article:help_articles!inner(id, slug, title, status, updated_at)
          `
          )
          .eq("category_id", selectedCategoryId)
          .order("position");

        if (error) throw error;

        return (data || []).map((item: any) => ({
          id: item.id,
          article_id: item.article_id,
          category_id: item.category_id,
          position: item.position,
          article: item.article,
        })) as CategoryArticle[];
      },
      enabled: !!selectedCategoryId && viewMode === "byCategory",
    });

  // Set first category as default when categories load
  useMemo(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const isLoading = articlesLoading || categoriesLoading;

  // Filter articles by status
  const filteredArticles = useMemo(() => {
    if (!allArticles) return [];
    if (statusFilter === "all") return allArticles;
    return allArticles.filter((article) => article.status === statusFilter);
  }, [allArticles, statusFilter]);

  const articleCount = allArticles?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
          HELP CENTER
        </p>
        <h1 className="text-[24px] font-semibold text-foreground">Articles</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Article count */}
        <p className="text-[14px] text-muted-foreground mb-4">
          {articleCount} articles
        </p>

        {/* View toggle and filters */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[14px] text-muted-foreground">View:</span>
          <RadioGroup
            value={viewMode}
            onValueChange={(value) =>
              setViewMode(value as "all" | "byCategory")
            }
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="view-all" />
              <Label htmlFor="view-all" className="text-[14px] cursor-pointer">
                All Articles
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="byCategory" id="view-category" />
              <Label
                htmlFor="view-category"
                className="text-[14px] cursor-pointer"
              >
                By Category:
              </Label>
            </div>
          </RadioGroup>

          {viewMode === "byCategory" && (
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {viewMode === "all" && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* All Articles View */}
        {viewMode === "all" && (
          <>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[12px] uppercase tracking-wide">
                        Title
                      </TableHead>
                      <TableHead className="text-[12px] uppercase tracking-wide w-[120px]">
                        Status
                      </TableHead>
                      <TableHead className="text-[12px] uppercase tracking-wide w-[140px]">
                        Updated
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <span className="text-[14px] text-foreground">
                            {article.title}
                          </span>
                          <span className="block text-[12px] text-muted-foreground">
                            /{article.slug}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-[13px] ${
                              article.status === "published"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {article.status === "published"
                              ? "Published"
                              : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">
                          {format(new Date(article.updated_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : allArticles && allArticles.length > 0 ? (
              <p className="text-[14px] text-muted-foreground">
                No articles match the selected filter.
              </p>
            ) : (
              <p className="text-[14px] text-muted-foreground">
                No articles yet.
              </p>
            )}
          </>
        )}

        {/* By Category View */}
        {viewMode === "byCategory" && (
          <>
            {categoryArticlesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : categoryArticles && categoryArticles.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                {categoryArticles.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0 bg-background"
                  >
                    <span className="w-8 text-[14px] text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-[14px] text-foreground">
                      {item.article.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-muted-foreground">
                No articles in this category yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

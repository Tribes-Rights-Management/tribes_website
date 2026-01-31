/**
 * Help Workstation - Articles Page
 * View toggle between "All Articles" table and "By Category" sortable list
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, GripVertical } from "lucide-react";
import { format } from "date-fns";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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

interface ArticleAudience {
  id: string;
  article_id: string;
  category_id: string;
  position: number;
  article: HelpArticle;
}

// Sortable row component for By Category view
function SortableArticleRow({
  item,
  index,
}: {
  item: ArticleAudience;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-4 py-3 border-b border-border bg-background hover:bg-muted/50"
    >
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="w-8 text-[14px] text-muted-foreground">{index + 1}</span>
      <Link
        to={`/help-workstation/articles/${item.article.slug}/edit`}
        className="flex-1 text-[14px] text-foreground hover:underline"
      >
        {item.article.title}
      </Link>
    </div>
  );
}

export default function HelpArticlesPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"all" | "byCategory">("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [localArticles, setLocalArticles] = useState<ArticleAudience[]>([]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch all articles for "All Articles" view
  const { data: allArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ["help-workstation-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("id, slug, title, status, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as HelpArticle[];
    },
  });

  // Fetch all categories for dropdown
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["help-workstation-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_categories")
        .select("id, slug, name")
        .order("name");

      if (error) throw error;
      return data as HelpCategory[];
    },
  });

  // Fetch articles for selected category
  const { data: categoryArticles, isLoading: categoryArticlesLoading } =
    useQuery({
      queryKey: ["help-workstation-category-articles", selectedCategoryId],
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
        
        // Transform the data to match our interface
        return (data || []).map((item: any) => ({
          id: item.id,
          article_id: item.article_id,
          category_id: item.category_id,
          position: item.position,
          article: item.article,
        })) as ArticleAudience[];
      },
      enabled: !!selectedCategoryId && viewMode === "byCategory",
    });

  // Sync local articles when category articles change
  useMemo(() => {
    if (categoryArticles) {
      setLocalArticles(categoryArticles);
    }
  }, [categoryArticles]);

  // Handle drag end for reordering
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localArticles.findIndex((item) => item.id === active.id);
      const newIndex = localArticles.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(localArticles, oldIndex, newIndex);
      setLocalArticles(reordered);

      // Save all new positions to database
      try {
        const updates = reordered.map((item, index) => ({
          id: item.id,
          position: index + 1,
        }));

        for (const update of updates) {
          const { error } = await supabase
            .from("help_article_audiences")
            .update({ position: update.position })
            .eq("id", update.id);

          if (error) throw error;
        }

        // Invalidate queries to refetch
        queryClient.invalidateQueries({
          queryKey: ["help-workstation-category-articles", selectedCategoryId],
        });

        toast({
          description: "Order saved",
        });
      } catch (error) {
        console.error("Failed to save order:", error);
        toast({
          variant: "destructive",
          description: "Failed to save order",
        });
        // Revert on error
        if (categoryArticles) {
          setLocalArticles(categoryArticles);
        }
      }
    }
  }

  // Set first category as default when categories load
  useMemo(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const isLoading = articlesLoading || categoriesLoading;
  const articleCount = allArticles?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
          HELP WORKSTATION
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-semibold text-foreground">Articles</h1>
          <Button asChild size="sm">
            <Link to="/help-workstation/articles/new">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Article count */}
        <p className="text-[14px] text-muted-foreground mb-4">
          {articleCount} articles
        </p>

        {/* View toggle */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[14px] text-muted-foreground">View:</span>
          <RadioGroup
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "all" | "byCategory")}
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
            ) : allArticles && allArticles.length > 0 ? (
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
                    {allArticles.map((article) => (
                      <TableRow
                        key={article.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>
                          <Link
                            to={`/help-workstation/articles/${article.slug}/edit`}
                            className="block"
                          >
                            <span className="text-[14px] text-foreground">
                              {article.title}
                            </span>
                            <span className="block text-[12px] text-muted-foreground">
                              /{article.slug}
                            </span>
                          </Link>
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
            ) : (
              <p className="text-[14px] text-muted-foreground">
                No articles created yet.
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
            ) : localArticles.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localArticles.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localArticles.map((item, index) => (
                      <SortableArticleRow
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
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

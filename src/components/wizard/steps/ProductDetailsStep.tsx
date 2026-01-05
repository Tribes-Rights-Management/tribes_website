import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProductDetailsStepProps {
  data: {
    label_master_owner: string;
    distributor: string;
    release_date: string | null;
    recording_artist: string;
    release_title: string;
    product_upc: string;
    additional_product_info: string;
  };
  onUpdate: (field: string, value: string | null) => void;
  errors: Record<string, string>;
}

export function ProductDetailsStep({ data, onUpdate, errors }: ProductDetailsStepProps) {
  const releaseDate = data.release_date ? new Date(data.release_date) : undefined;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Product Details</h2>
        <p className="text-muted-foreground text-sm">
          Tell us about the release.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label_master_owner">Label / Master Owner *</Label>
            <Input 
              id="label_master_owner"
              value={data.label_master_owner}
              onChange={(e) => onUpdate("label_master_owner", e.target.value)}
              placeholder="Record label name"
            />
            {errors.label_master_owner && (
              <p className="text-sm text-destructive">{errors.label_master_owner}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="distributor">Distributor *</Label>
            <Input 
              id="distributor"
              value={data.distributor}
              onChange={(e) => onUpdate("distributor", e.target.value)}
              placeholder="Distribution company"
            />
            {errors.distributor && (
              <p className="text-sm text-destructive">{errors.distributor}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Release Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !releaseDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {releaseDate ? format(releaseDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={releaseDate}
                onSelect={(date) => onUpdate("release_date", date ? format(date, "yyyy-MM-dd") : null)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.release_date && (
            <p className="text-sm text-destructive">{errors.release_date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recording_artist">Recording Artist *</Label>
          <Input 
            id="recording_artist"
            value={data.recording_artist}
            onChange={(e) => onUpdate("recording_artist", e.target.value)}
            placeholder="Artist name"
          />
          {errors.recording_artist && (
            <p className="text-sm text-destructive">{errors.recording_artist}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="release_title">Release Title *</Label>
            <Input 
              id="release_title"
              value={data.release_title}
              onChange={(e) => onUpdate("release_title", e.target.value)}
              placeholder="Album or single title"
            />
            {errors.release_title && (
              <p className="text-sm text-destructive">{errors.release_title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="product_upc">Product UPC *</Label>
            <Input 
              id="product_upc"
              value={data.product_upc}
              onChange={(e) => onUpdate("product_upc", e.target.value)}
              placeholder="123456789012"
            />
            {errors.product_upc && (
              <p className="text-sm text-destructive">{errors.product_upc}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional_product_info">Additional Product Info</Label>
          <Textarea 
            id="additional_product_info"
            value={data.additional_product_info}
            onChange={(e) => onUpdate("additional_product_info", e.target.value)}
            placeholder="Any additional details about the release..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UsageFormData, MediaType, MEDIA_TYPE_LABELS } from "@/types";

interface StepUsageProps {
  data: UsageFormData;
  onChange: (data: Partial<UsageFormData>) => void;
}

const mediaTypes: MediaType[] = ["film", "tv", "ad", "trailer", "social", "ugc", "podcast", "game", "other"];

export function StepUsage({ data, onChange }: StepUsageProps) {
  const isAdvertising = data.media_type === "ad";
  const showExclusivityTerms = data.is_exclusive;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Usage Details</h2>
        <p className="text-sm text-muted-foreground">
          How and where the music will be used.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="media_type">Media Type *</Label>
          <Select
            value={data.media_type || ""}
            onValueChange={(value) => onChange({ media_type: value as MediaType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {MEDIA_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="placement">Placement / Scene Description</Label>
          <Input
            id="placement"
            placeholder="e.g., Opening credits, background music in bar scene"
            value={data.placement}
            onChange={(e) => onChange({ placement: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">Duration of Use</Label>
          <Input
            id="duration"
            placeholder="e.g., 30 seconds, full song"
            value={data.usage_duration}
            onChange={(e) => onChange({ usage_duration: e.target.value })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start_date">Usage Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={data.usage_start_date || ""}
              onChange={(e) => onChange({ usage_start_date: e.target.value || null })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end_date">Usage End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={data.usage_end_date || ""}
              onChange={(e) => onChange({ usage_end_date: e.target.value || null })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="term">Term</Label>
          <Input
            id="term"
            placeholder="e.g., In perpetuity, 5 years"
            value={data.term}
            onChange={(e) => onChange({ term: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="territory">Territory</Label>
          <Input
            id="territory"
            placeholder="e.g., Worldwide, North America"
            value={data.territory}
            onChange={(e) => onChange({ territory: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="exclusive">Exclusive License</Label>
            <p className="text-xs text-muted-foreground">
              Request exclusive rights to the music
            </p>
          </div>
          <Switch
            id="exclusive"
            checked={data.is_exclusive}
            onCheckedChange={(checked) => onChange({ is_exclusive: checked })}
          />
        </div>

        {showExclusivityTerms && (
          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground animate-fade-in">
            Exclusive licenses typically require higher fees and may have additional terms. 
            Our team will discuss the specifics during review.
          </div>
        )}

        {isAdvertising && (
          <div className="flex items-center justify-between py-2 animate-fade-in">
            <div className="space-y-0.5">
              <Label htmlFor="paid_media">Paid Media</Label>
              <p className="text-xs text-muted-foreground">
                Will this be used in paid advertising?
              </p>
            </div>
            <Switch
              id="paid_media"
              checked={data.has_paid_media}
              onCheckedChange={(checked) => onChange({ has_paid_media: checked })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

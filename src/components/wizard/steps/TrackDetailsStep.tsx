import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TrackDetailsStepProps {
  data: {
    track_title: string;
    track_artist: string;
    track_isrc: string;
    runtime: string;
    appears_multiple_times: boolean;
    times_count: number | null;
    additional_track_info: string;
  };
  onUpdate: (field: string, value: string | boolean | number | null) => void;
  errors: Record<string, string>;
}

export function TrackDetailsStep({ data, onUpdate, errors }: TrackDetailsStepProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Track Details</h2>
        <p className="text-muted-foreground text-sm">
          Tell us about the specific track.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="track_title">Track / Song Title *</Label>
            <Input 
              id="track_title"
              value={data.track_title}
              onChange={(e) => onUpdate("track_title", e.target.value)}
              placeholder="Song title"
            />
            {errors.track_title && (
              <p className="text-sm text-destructive">{errors.track_title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="track_artist">Track Artist *</Label>
            <Input 
              id="track_artist"
              value={data.track_artist}
              onChange={(e) => onUpdate("track_artist", e.target.value)}
              placeholder="Artist name"
            />
            {errors.track_artist && (
              <p className="text-sm text-destructive">{errors.track_artist}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="track_isrc">Track ISRC *</Label>
            <Input 
              id="track_isrc"
              value={data.track_isrc}
              onChange={(e) => onUpdate("track_isrc", e.target.value)}
              placeholder="USRC12345678"
            />
            {errors.track_isrc && (
              <p className="text-sm text-destructive">{errors.track_isrc}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="runtime">Runtime (MM:SS) *</Label>
            <Input 
              id="runtime"
              value={data.runtime}
              onChange={(e) => onUpdate("runtime", e.target.value)}
              placeholder="03:45"
            />
            {errors.runtime && (
              <p className="text-sm text-destructive">{errors.runtime}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Does this song appear on the release more than once? *</Label>
          <Select 
            value={data.appears_multiple_times ? "yes" : "no"} 
            onValueChange={(v) => onUpdate("appears_multiple_times", v === "yes")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.appears_multiple_times && (
          <div className="space-y-2">
            <Label htmlFor="times_count">How many times?</Label>
            <Select 
              value={data.times_count?.toString() || ""} 
              onValueChange={(v) => onUpdate("times_count", parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="additional_track_info">Additional Track Info</Label>
          <Textarea 
            id="additional_track_info"
            value={data.additional_track_info}
            onChange={(e) => onUpdate("additional_track_info", e.target.value)}
            placeholder="Any additional details about the track..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

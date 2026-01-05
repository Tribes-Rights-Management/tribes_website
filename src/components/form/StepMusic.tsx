import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MusicFormData } from "@/types";

interface StepMusicProps {
  data: MusicFormData;
  onChange: (data: Partial<MusicFormData>) => void;
}

export function StepMusic({ data, onChange }: StepMusicProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Music Information</h2>
        <p className="text-sm text-muted-foreground">
          Details about the song you want to license.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="song_title">Song Title *</Label>
          <Input
            id="song_title"
            placeholder="Title of the song"
            value={data.song_title}
            onChange={(e) => onChange({ song_title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="writers">Writers / Publishers (if known)</Label>
          <Input
            id="writers"
            placeholder="e.g., John Smith (ASCAP) / Warner Chappell"
            value={data.writers_publishers}
            onChange={(e) => onChange({ writers_publishers: e.target.value })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="isrc">ISRC (optional)</Label>
            <Input
              id="isrc"
              placeholder="USRC12345678"
              value={data.isrc}
              onChange={(e) => onChange({ isrc: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="iswc">ISWC (optional)</Label>
            <Input
              id="iswc"
              placeholder="T-123.456.789-0"
              value={data.iswc}
              onChange={(e) => onChange({ iswc: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reference_link">Reference Cut / Link</Label>
          <Input
            id="reference_link"
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
            value={data.reference_link}
            onChange={(e) => onChange({ reference_link: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Link to a video or audio preview showing how you plan to use the music
          </p>
        </div>
      </div>
    </div>
  );
}

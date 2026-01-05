import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectFormData } from "@/types";

interface StepProjectProps {
  data: ProjectFormData;
  onChange: (data: Partial<ProjectFormData>) => void;
}

export function StepProject({ data, onChange }: StepProjectProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Project Information</h2>
        <p className="text-sm text-muted-foreground">
          Details about the production where the music will be used.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="project_title">Project Title *</Label>
          <Input
            id="project_title"
            placeholder="Name of the film, show, or production"
            value={data.project_title}
            onChange={(e) => onChange({ project_title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="production_company">Production Company</Label>
          <Input
            id="production_company"
            placeholder="Production company name"
            value={data.production_company}
            onChange={(e) => onChange({ production_company: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="distributor">Distributor / Network / Platform</Label>
          <Input
            id="distributor"
            placeholder="e.g., Netflix, HBO, Disney+"
            value={data.distributor_network_platform}
            onChange={(e) => onChange({ distributor_network_platform: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="release_date">Release Date (if known)</Label>
          <Input
            id="release_date"
            type="date"
            value={data.release_date || ""}
            onChange={(e) => onChange({ release_date: e.target.value || null })}
          />
        </div>
      </div>
    </div>
  );
}

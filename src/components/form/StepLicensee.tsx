import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LicenseeFormData, EntityType, ENTITY_TYPE_LABELS } from "@/types";

interface StepLicenseeProps {
  data: LicenseeFormData;
  onChange: (data: Partial<LicenseeFormData>) => void;
}

const entityTypes: EntityType[] = ["individual", "corporation", "llc", "partnership", "other"];

export function StepLicensee({ data, onChange }: StepLicenseeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Licensee Information</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about the entity requesting the license.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="legal_name">Legal Name *</Label>
          <Input
            id="legal_name"
            placeholder="Company or individual name"
            value={data.licensee_legal_name}
            onChange={(e) => onChange({ licensee_legal_name: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="entity_type">Entity Type</Label>
          <Select
            value={data.licensee_entity_type || ""}
            onValueChange={(value) => onChange({ licensee_entity_type: value as EntityType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {ENTITY_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Street address, city, state, country"
            value={data.licensee_address}
            onChange={(e) => onChange({ licensee_address: e.target.value })}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@company.com"
              value={data.licensee_email}
              onChange={(e) => onChange({ licensee_email: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.licensee_phone}
              onChange={(e) => onChange({ licensee_phone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

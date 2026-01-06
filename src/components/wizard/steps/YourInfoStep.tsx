import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YourInfoStepProps {
  data: {
    first_name: string;
    last_name: string;
    organization: string;
    licensee_email: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    address_country: string;
  };
  onUpdate: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "PR", "VI", "GU", "AS", "MP"
];

const CANADIAN_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", "Other"
];

export function YourInfoStep({ data, onUpdate, errors }: YourInfoStepProps) {
  const isUS = data.address_country === "United States";
  const isCanada = data.address_country === "Canada";
  const stateOptions = isUS ? US_STATES : isCanada ? CANADIAN_PROVINCES : [];
  const stateLabel = isCanada ? "Province" : "State";
  const zipLabel = isCanada ? "Postal Code" : "ZIP Code";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1">Your Info</h2>
        <p className="text-sm text-muted-foreground">Contact and address information.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="First Name" required error={errors.first_name}>
            <Input 
              value={data.first_name}
              onChange={(e) => onUpdate("first_name", e.target.value)}
              placeholder="John"
            />
          </FieldGroup>
          <FieldGroup label="Last Name" required error={errors.last_name}>
            <Input 
              value={data.last_name}
              onChange={(e) => onUpdate("last_name", e.target.value)}
              placeholder="Doe"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Organization">
          <Input 
            value={data.organization}
            onChange={(e) => onUpdate("organization", e.target.value)}
            placeholder="Company name (optional)"
          />
        </FieldGroup>

        <FieldGroup label="Email" required error={errors.licensee_email}>
          <Input 
            type="email"
            value={data.licensee_email}
            onChange={(e) => onUpdate("licensee_email", e.target.value)}
            placeholder="john@example.com"
          />
        </FieldGroup>

        <FieldGroup label="Country" required error={errors.address_country}>
          <Select 
            value={data.address_country} 
            onValueChange={(v) => {
              onUpdate("address_country", v);
              if (v !== data.address_country) onUpdate("address_state", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </FieldGroup>

        <FieldGroup label="Street Address" required error={errors.address_street}>
          <Input 
            value={data.address_street}
            onChange={(e) => onUpdate("address_street", e.target.value)}
            placeholder="123 Main St"
          />
        </FieldGroup>

        <div className="grid grid-cols-3 gap-3">
          <FieldGroup label="City" required error={errors.address_city}>
            <Input 
              value={data.address_city}
              onChange={(e) => onUpdate("address_city", e.target.value)}
              placeholder="New York"
            />
          </FieldGroup>
          <FieldGroup label={stateLabel} required error={errors.address_state}>
            {stateOptions.length > 0 ? (
              <Select value={data.address_state} onValueChange={(v) => onUpdate("address_state", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                value={data.address_state}
                onChange={(e) => onUpdate("address_state", e.target.value)}
                placeholder="State/Province"
              />
            )}
          </FieldGroup>
          <FieldGroup label={zipLabel} required error={errors.address_zip}>
            <Input 
              value={data.address_zip}
              onChange={(e) => onUpdate("address_zip", e.target.value)}
              placeholder={isCanada ? "A1A 1A1" : "10001"}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({ 
  label, 
  required, 
  error, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label} {required && <span className="text-muted-foreground">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

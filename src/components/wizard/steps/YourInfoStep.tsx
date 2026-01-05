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
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Other"
];

export function YourInfoStep({ data, onUpdate, errors }: YourInfoStepProps) {
  const isUS = data.address_country === "United States";
  const isCanada = data.address_country === "Canada";
  const stateOptions = isUS ? US_STATES : isCanada ? CANADIAN_PROVINCES : [];
  const stateLabel = isCanada ? "Province" : "State";
  const zipLabel = isCanada ? "Postal Code" : "ZIP Code";

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Your Info</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your contact and address information.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input 
              id="first_name"
              value={data.first_name}
              onChange={(e) => onUpdate("first_name", e.target.value)}
              placeholder="John"
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input 
              id="last_name"
              value={data.last_name}
              onChange={(e) => onUpdate("last_name", e.target.value)}
              placeholder="Doe"
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input 
            id="organization"
            value={data.organization}
            onChange={(e) => onUpdate("organization", e.target.value)}
            placeholder="Company name (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensee_email">Email *</Label>
          <Input 
            id="licensee_email"
            type="email"
            value={data.licensee_email}
            onChange={(e) => onUpdate("licensee_email", e.target.value)}
            placeholder="john@example.com"
          />
          {errors.licensee_email && (
            <p className="text-sm text-destructive">{errors.licensee_email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_country">Country *</Label>
          <Select 
            value={data.address_country} 
            onValueChange={(v) => {
              onUpdate("address_country", v);
              // Clear state when country changes
              if (v !== data.address_country) {
                onUpdate("address_state", "");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.address_country && (
            <p className="text-sm text-destructive">{errors.address_country}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_street">Street Address *</Label>
          <Input 
            id="address_street"
            value={data.address_street}
            onChange={(e) => onUpdate("address_street", e.target.value)}
            placeholder="123 Main St"
          />
          {errors.address_street && (
            <p className="text-sm text-destructive">{errors.address_street}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_city">City *</Label>
            <Input 
              id="address_city"
              value={data.address_city}
              onChange={(e) => onUpdate("address_city", e.target.value)}
              placeholder="New York"
            />
            {errors.address_city && (
              <p className="text-sm text-destructive">{errors.address_city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_state">{stateLabel} *</Label>
            {stateOptions.length > 0 ? (
              <Select 
                value={data.address_state} 
                onValueChange={(v) => onUpdate("address_state", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="address_state"
                value={data.address_state}
                onChange={(e) => onUpdate("address_state", e.target.value)}
                placeholder="State/Province"
              />
            )}
            {errors.address_state && (
              <p className="text-sm text-destructive">{errors.address_state}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_zip">{zipLabel} *</Label>
            <Input 
              id="address_zip"
              value={data.address_zip}
              onChange={(e) => onUpdate("address_zip", e.target.value)}
              placeholder={isCanada ? "A1A 1A1" : "10001"}
            />
            {errors.address_zip && (
              <p className="text-sm text-destructive">{errors.address_zip}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

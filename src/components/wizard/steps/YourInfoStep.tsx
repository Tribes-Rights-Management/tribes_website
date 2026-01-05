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
  };
  onUpdate: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function YourInfoStep({ data, onUpdate, errors }: YourInfoStepProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Your Info</h2>
        <p className="text-muted-foreground text-sm">
          Please provide your contact information.
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
          <Label htmlFor="address_street">Street Address</Label>
          <Input 
            id="address_street"
            value={data.address_street}
            onChange={(e) => onUpdate("address_street", e.target.value)}
            placeholder="123 Main St"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_city">City</Label>
            <Input 
              id="address_city"
              value={data.address_city}
              onChange={(e) => onUpdate("address_city", e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_state">State</Label>
            <Select 
              value={data.address_state} 
              onValueChange={(v) => onUpdate("address_state", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_zip">ZIP</Label>
            <Input 
              id="address_zip"
              value={data.address_zip}
              onChange={(e) => onUpdate("address_zip", e.target.value)}
              placeholder="10001"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/countries";

interface YourInfoData {
  first_name: string;
  last_name: string;
  organization: string;
  licensee_email: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
}

interface YourInfoStepProps {
  data: YourInfoData;
  onUpdate: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export function YourInfoStep({ data, onUpdate, errors }: YourInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Information</h2>
        <p className="text-[14px] text-muted-foreground">
          Enter the licensee's contact and address details.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={data.first_name}
              onChange={(e) => onUpdate("first_name", e.target.value)}
              className={errors.first_name ? "border-[#737373]" : ""}
            />
            {errors.first_name && (
              <p className="text-[13px] text-[#525252] leading-snug">{errors.first_name}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={data.last_name}
              onChange={(e) => onUpdate("last_name", e.target.value)}
              className={errors.last_name ? "border-[#737373]" : ""}
            />
            {errors.last_name && (
              <p className="text-[13px] text-[#525252] leading-snug">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            value={data.organization}
            onChange={(e) => onUpdate("organization", e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="licensee_email">Email *</Label>
          <Input
            id="licensee_email"
            type="email"
            value={data.licensee_email}
            onChange={(e) => onUpdate("licensee_email", e.target.value)}
            className={errors.licensee_email ? "border-[#737373]" : ""}
          />
          {errors.licensee_email && (
            <p className="text-[13px] text-[#525252] leading-snug">{errors.licensee_email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address_country">Country *</Label>
          <Select
            value={data.address_country}
            onValueChange={(value) => onUpdate("address_country", value)}
          >
            <SelectTrigger className={errors.address_country ? "border-[#737373]" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.address_country && (
            <p className="text-[13px] text-[#525252] leading-snug">{errors.address_country}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address_street">Street Address *</Label>
          <Input
            id="address_street"
            value={data.address_street}
            onChange={(e) => onUpdate("address_street", e.target.value)}
            className={errors.address_street ? "border-[#737373]" : ""}
          />
          {errors.address_street && (
            <p className="text-[13px] text-[#525252] leading-snug">{errors.address_street}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="address_city">City *</Label>
            <Input
              id="address_city"
              value={data.address_city}
              onChange={(e) => onUpdate("address_city", e.target.value)}
              className={errors.address_city ? "border-[#737373]" : ""}
            />
            {errors.address_city && (
              <p className="text-[13px] text-[#525252] leading-snug">{errors.address_city}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address_state">State/Province *</Label>
            <Input
              id="address_state"
              value={data.address_state}
              onChange={(e) => onUpdate("address_state", e.target.value)}
              className={errors.address_state ? "border-[#737373]" : ""}
            />
            {errors.address_state && (
              <p className="text-[13px] text-[#525252] leading-snug">{errors.address_state}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address_zip">Postal Code *</Label>
            <Input
              id="address_zip"
              value={data.address_zip}
              onChange={(e) => onUpdate("address_zip", e.target.value)}
              className={errors.address_zip ? "border-[#737373]" : ""}
            />
            {errors.address_zip && (
              <p className="text-[13px] text-[#525252] leading-snug">{errors.address_zip}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

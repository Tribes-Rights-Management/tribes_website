import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LicenseType {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

interface LicenseTypeStepProps {
  selectedTypes: string[];
  onUpdate: (field: string, value: string[]) => void;
  errors: Record<string, string>;
}

export function LicenseTypeStep({ selectedTypes, onUpdate, errors }: LicenseTypeStepProps) {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLicenseTypes();
  }, []);

  async function fetchLicenseTypes() {
    try {
      const { data, error } = await supabase
        .from("license_types")
        .select("id, code, name, description")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      setLicenseTypes(data || []);
    } catch (error) {
      console.error("Error fetching license types:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleType(code: string) {
    const newTypes = selectedTypes.includes(code)
      ? selectedTypes.filter(t => t !== code)
      : [...selectedTypes, code];
    onUpdate("selected_license_types", newTypes);
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading license types...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">License Type</h2>
        <p className="text-[15px] text-muted-foreground">
          Select the type(s) of license required.
        </p>
      </div>

      {/* INSTITUTIONAL ERROR: neutral gray, no red (LOCKED) */}
      {errors.selected_license_types && (
        <p className="text-[13px] text-[#525252]">{errors.selected_license_types}</p>
      )}

      <div className="space-y-3">
        {licenseTypes.map((type) => (
          <div key={type.id} className="flex items-start gap-3 p-3 rounded-md border border-[#d4d4d4] hover:bg-[#fafafa] transition-colors duration-150">
            <Checkbox
              id={type.code}
              checked={selectedTypes.includes(type.code)}
              onCheckedChange={() => toggleType(type.code)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor={type.code} className="text-[14px] font-medium cursor-pointer">
                {type.name}
              </Label>
              {type.description && (
                <p className="text-[13px] text-muted-foreground leading-snug">{type.description}</p>
              )}
            </div>
          </div>
        ))}

        {licenseTypes.length === 0 && (
          <p className="text-[13px] text-muted-foreground">
            No license types available.
          </p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

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

export function LicenseTypeStep({ 
  selectedTypes, 
  onUpdate,
  errors 
}: LicenseTypeStepProps) {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLicenseTypes() {
      const { data } = await supabase
        .from("license_types")
        .select("id, code, name, description")
        .eq("is_active", true)
        .order("sort_order");
      
      setLicenseTypes(data || []);
      setIsLoading(false);
    }
    fetchLicenseTypes();
  }, []);

  function toggleType(code: string) {
    const newSelected = selectedTypes.includes(code)
      ? selectedTypes.filter(t => t !== code)
      : [...selectedTypes, code];
    onUpdate("selected_license_types", newSelected);
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">License Types</h2>
          <p className="text-muted-foreground text-sm">Loading available license types…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">License Types</h2>
        <p className="text-muted-foreground text-sm">
          Select all license types you expect to need for this song.
          <br />
          Each selected use will be reviewed and licensed separately.
        </p>
      </div>

      <div className="space-y-4">
        {licenseTypes.map(type => (
          <div key={type.code} className="space-y-1.5">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id={`license-type-${type.code}`}
                checked={selectedTypes.includes(type.code)}
                onCheckedChange={() => toggleType(type.code)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label 
                  htmlFor={`license-type-${type.code}`} 
                  className="text-sm font-medium cursor-pointer leading-tight"
                >
                  {type.name}
                </Label>
                {type.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {errors.selected_license_types && (
          <p className="text-sm text-destructive">{errors.selected_license_types}</p>
        )}
      </div>
    </div>
  );
}

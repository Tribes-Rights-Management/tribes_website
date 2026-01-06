import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { WizardFormData } from "@/types";

interface ReviewStepProps {
  data: WizardFormData;
  onEditStep: (step: number) => void;
}

interface LicenseType {
  code: string;
  name: string;
}

function ReviewSection({ 
  title, 
  step, 
  onEdit, 
  children 
}: { 
  title: string; 
  step: number; 
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} className="h-7 text-xs">
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  
  useEffect(() => {
    async function fetchLicenseTypes() {
      const { data: types } = await supabase
        .from("license_types")
        .select("code, name")
        .eq("is_active", true);
      setLicenseTypes(types || []);
    }
    fetchLicenseTypes();
  }, []);

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");
  const fullAddress = [
    data.address_street,
    [data.address_city, data.address_state, data.address_zip].filter(Boolean).join(", "),
    data.address_country
  ].filter(Boolean).join(", ");

  const selectedTypeNames = data.selected_license_types
    .map(code => licenseTypes.find(t => t.code === code)?.name || code)
    .join(", ");

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Review & Submit</h2>
        <p className="text-muted-foreground text-sm">
          Please review your information before submitting.
        </p>
      </div>

      <div className="space-y-6 divide-y">
        <ReviewSection title="License Types" step={2} onEdit={onEditStep}>
          <ReviewField label="Selected Types" value={selectedTypeNames || "None selected"} />
          <p className="text-[13px] text-muted-foreground pt-2">
            Each license type will generate an independent license with its own License ID.
          </p>
        </ReviewSection>

        <ReviewSection title="Your Info" step={3} onEdit={onEditStep}>
          <ReviewField label="Name" value={fullName} />
          {data.organization && <ReviewField label="Organization" value={data.organization} />}
          <ReviewField label="Email" value={data.licensee_email} />
          {fullAddress && <ReviewField label="Address" value={fullAddress} />}
        </ReviewSection>

        <ReviewSection title="Product Details" step={4} onEdit={onEditStep}>
          <ReviewField label="Label / Master Owner" value={data.label_master_owner} />
          <ReviewField label="Distributor" value={data.distributor} />
          <ReviewField 
            label="Release Date" 
            value={data.release_date ? format(new Date(data.release_date), "PPP") : null} 
          />
          <ReviewField label="Recording Artist" value={data.recording_artist} />
          <ReviewField label="Release Title" value={data.release_title} />
          <ReviewField label="Product UPC" value={data.product_upc} />
          {data.additional_product_info && (
            <ReviewField label="Additional Info" value={data.additional_product_info} />
          )}
        </ReviewSection>

        <ReviewSection title="Track Details" step={5} onEdit={onEditStep}>
          <ReviewField label="Track Title" value={data.track_title} />
          <ReviewField label="Track Artist" value={data.track_artist} />
          <ReviewField label="Track ISRC" value={data.track_isrc} />
          <ReviewField label="Runtime" value={data.runtime} />
          <ReviewField 
            label="Multiple Appearances" 
            value={data.appears_multiple_times ? `Yes (${data.times_count} times)` : "No"} 
          />
          {data.additional_track_info && (
            <ReviewField label="Additional Info" value={data.additional_track_info} />
          )}
        </ReviewSection>
      </div>
    </div>
  );
}

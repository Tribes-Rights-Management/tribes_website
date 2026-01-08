import { WizardFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// INSTITUTIONAL REVIEW STEP (LOCKED)
// - Document-like layout
// - Minimal edit affordance
// - No decorative elements

interface ReviewStepProps {
  data: WizardFormData;
  onEditStep: (step: number) => void;
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Review</h2>
        <p className="text-[15px] text-muted-foreground">
          Verify the information below before submitting.
        </p>
      </div>

      {/* License Types */}
      <Section title="License Types" onEdit={() => onEditStep(2)}>
        <p className="text-[14px]">
          {data.selected_license_types.length > 0 
            ? data.selected_license_types.join(", ")
            : "None selected"}
        </p>
      </Section>

      {/* Your Information */}
      <Section title="Licensee Information" onEdit={() => onEditStep(3)}>
        <div className="space-y-1.5 text-[14px]">
          <Row label="Name" value={`${data.first_name} ${data.last_name}`} />
          {data.organization && <Row label="Organization" value={data.organization} />}
          <Row label="Email" value={data.licensee_email} />
          <Row label="Address" value={[
            data.address_street,
            data.address_city,
            data.address_state,
            data.address_zip,
            data.address_country
          ].filter(Boolean).join(", ")} />
        </div>
      </Section>

      {/* Product Details */}
      <Section title="Product Details" onEdit={() => onEditStep(4)}>
        <div className="space-y-1.5 text-[14px]">
          <Row label="Label / Master Owner" value={data.label_master_owner} />
          <Row label="Distributor" value={data.distributor} />
          <Row label="Recording Artist" value={data.recording_artist} />
          <Row label="Release Title" value={data.release_title} />
          <Row label="Release Date" value={data.release_date ? format(new Date(data.release_date), "PPP") : "—"} />
          <Row label="UPC" value={data.product_upc} />
          {data.additional_product_info && <Row label="Additional Info" value={data.additional_product_info} />}
        </div>
      </Section>

      {/* Track Details */}
      <Section title="Track Details" onEdit={() => onEditStep(5)}>
        <div className="space-y-1.5 text-[14px]">
          <Row label="Track Title" value={data.track_title} />
          <Row label="Track Artist" value={data.track_artist} />
          <Row label="ISRC" value={data.track_isrc} />
          <Row label="Runtime" value={data.runtime} />
          <Row label="Multiple Appearances" value={data.appears_multiple_times ? `Yes (${data.times_count || "—"} times)` : "No"} />
          {data.additional_track_info && <Row label="Additional Info" value={data.additional_track_info} />}
        </div>
      </Section>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}

function Section({ title, children, onEdit }: SectionProps) {
  return (
    <div className="border border-[#d4d4d4] rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-medium text-foreground">{title}</h3>
        <button 
          onClick={onEdit}
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="text-muted-foreground w-40 shrink-0">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// INSTITUTIONAL COVER STEP (LOCKED)
// - Administrative tone, not onboarding
// - No autosave messaging
// - Feels like filing, not marketing

interface CoverStepProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function CoverStep({ onStart, isLoading }: CoverStepProps) {
  return (
    <div className="py-12">
      <h1 className="text-xl font-semibold mb-3">License Request</h1>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
        Complete this form to submit a license request for review. 
        All fields marked as required must be completed.
      </p>
      <Button onClick={onStart} disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading…
          </>
        ) : (
          "Begin"
        )}
      </Button>
    </div>
  );
}

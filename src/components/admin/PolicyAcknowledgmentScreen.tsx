import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// Current policy version - increment when policy is updated
export const CURRENT_POLICY_VERSION = "2026-01-06-v1";

interface PolicyAcknowledgmentScreenProps {
  onAcknowledge: () => void;
  isSubmitting: boolean;
}

export function PolicyAcknowledgmentScreen({ 
  onAcknowledge, 
  isSubmitting 
}: PolicyAcknowledgmentScreenProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-[520px]">
        
        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground mb-8">
          Admin Conduct Policy
        </h1>

        {/* Body */}
        <div className="space-y-6 mb-10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This platform is used to review, approve, execute, and manage legally 
            binding music licenses and related records.
          </p>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Administrative access is granted based on trust and professional responsibility.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-foreground">
              By continuing, you acknowledge that:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-muted-foreground/60">—</span>
                <span>Administrative access is for authorized business purposes only</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground/60">—</span>
                <span>Executed licenses and finalized records may not be altered or deleted</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground/60">—</span>
                <span>You will act within the scope of your assigned role</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground/60">—</span>
                <span>All administrative actions are logged and subject to audit</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground/60">—</span>
                <span>Informal commitments or off-platform assurances are not permitted</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3 mb-8">
          <Checkbox
            id="policy-agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <label 
            htmlFor="policy-agreement" 
            className="text-sm text-foreground leading-relaxed cursor-pointer"
          >
            I have read and agree to the Admin Conduct Policy.
          </label>
        </div>

        {/* Button */}
        <Button
          onClick={onAcknowledge}
          disabled={!agreed || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Processing..." : "Continue to Admin Portal"}
        </Button>
      </div>
    </div>
  );
}

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AgreementStepProps {
  agreementAccounting: boolean;
  agreementTerms: boolean;
  onUpdate: (field: string, value: boolean) => void;
  errors: Record<string, string>;
}

export function AgreementStep({ agreementAccounting, agreementTerms, onUpdate, errors }: AgreementStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Agreement</h2>
        <p className="text-[14px] text-muted-foreground">
          Please review and accept the following terms before proceeding.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreement_accounting"
            checked={agreementAccounting}
            onCheckedChange={(checked) => onUpdate("agreement_accounting", !!checked)}
            className="shrink-0 mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="agreement_accounting" className="text-[14px] cursor-pointer">
              I agree to provide accurate accounting information
            </Label>
            <p className="text-[13px] text-muted-foreground leading-snug">
              You certify that all financial and usage data provided will be accurate and complete.
            </p>
            {errors.agreement_accounting && (
              <p className="text-[13px] text-[#525252] leading-snug mt-1">{errors.agreement_accounting}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="agreement_terms"
            checked={agreementTerms}
            onCheckedChange={(checked) => onUpdate("agreement_terms", !!checked)}
            className="shrink-0 mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="agreement_terms" className="text-[14px] cursor-pointer">
              I agree to the license terms and conditions
            </Label>
            <p className="text-[13px] text-muted-foreground leading-snug">
              You agree to abide by the terms of the license agreement once executed.
            </p>
            {errors.agreement_terms && (
              <p className="text-[13px] text-[#525252] leading-snug mt-1">{errors.agreement_terms}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

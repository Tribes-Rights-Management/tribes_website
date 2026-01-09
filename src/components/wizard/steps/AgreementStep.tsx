import { TribesCheckbox } from "@/components/ui/tribes-checkbox";
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
          <TribesCheckbox
            id="agreement_accounting"
            checked={agreementAccounting}
            onCheckedChange={(checked) => onUpdate("agreement_accounting", checked)}
          >
            <span className="block space-y-1">
              <Label htmlFor="agreement_accounting" className="text-[14px] cursor-pointer">
                I agree to provide accurate accounting information
              </Label>
              <span className="block text-[13px] text-muted-foreground leading-snug">
                You certify that all financial and usage data provided will be accurate and complete.
              </span>
              {errors.agreement_accounting && (
                <span className="block text-[13px] text-[#525252] leading-snug mt-1">{errors.agreement_accounting}</span>
              )}
            </span>
          </TribesCheckbox>

        <TribesCheckbox
          id="agreement_terms"
          checked={agreementTerms}
          onCheckedChange={(checked) => onUpdate("agreement_terms", checked)}
        >
          <span className="block space-y-1">
            <Label htmlFor="agreement_terms" className="text-[14px] cursor-pointer">
              I agree to the license terms and conditions
            </Label>
            <span className="block text-[13px] text-muted-foreground leading-snug">
              You agree to abide by the terms of the license agreement once executed.
            </span>
            {errors.agreement_terms && (
              <span className="block text-[13px] text-[#525252] leading-snug mt-1">{errors.agreement_terms}</span>
            )}
          </span>
        </TribesCheckbox>
      </div>
    </div>
  );
}

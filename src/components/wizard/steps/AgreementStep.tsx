import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AgreementStepProps {
  agreementAccounting: boolean;
  agreementTerms: boolean;
  onUpdate: (field: string, value: boolean) => void;
  errors: Record<string, string>;
}

export function AgreementStep({ 
  agreementAccounting, 
  agreementTerms, 
  onUpdate,
  errors 
}: AgreementStepProps) {
  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Understanding and Agreement</h2>
        <p className="text-muted-foreground text-sm">
          Please review and acknowledge the following before continuing.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            As a commercial license user, I agree to provide accounting, pursuant to the terms of the licensing agreement to be entered into.
          </p>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="agreement_accounting"
              checked={agreementAccounting}
              onCheckedChange={(checked) => onUpdate("agreement_accounting", checked === true)}
            />
            <Label 
              htmlFor="agreement_accounting" 
              className="text-sm font-medium cursor-pointer"
            >
              I understand and agree
            </Label>
          </div>
          {errors.agreement_accounting && (
            <p className="text-sm text-destructive">{errors.agreement_accounting}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            By selecting the checkbox below and completing this form, I agree to the{" "}
            <a 
              href="https://www.tribesrightsmanagement.com/terms-of-use" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Terms of Use
            </a>{" "}
            of Tribes Rights Management LLC.
          </p>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="agreement_terms"
              checked={agreementTerms}
              onCheckedChange={(checked) => onUpdate("agreement_terms", checked === true)}
            />
            <Label 
              htmlFor="agreement_terms" 
              className="text-sm font-medium cursor-pointer"
            >
              I understand and agree
            </Label>
          </div>
          {errors.agreement_terms && (
            <p className="text-sm text-destructive">{errors.agreement_terms}</p>
          )}
        </div>
      </div>
    </div>
  );
}

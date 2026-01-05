import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetFormData } from "@/types";

interface StepBudgetProps {
  data: BudgetFormData;
  onChange: (data: Partial<BudgetFormData>) => void;
}

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
];

export function StepBudget({ data, onChange }: StepBudgetProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Budget & Terms</h2>
        <p className="text-sm text-muted-foreground">
          Your proposed fee and any special terms.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="proposed_fee">Proposed Fee</Label>
            <Input
              id="proposed_fee"
              type="number"
              min="0"
              step="100"
              placeholder="5000"
              value={data.proposed_fee || ""}
              onChange={(e) => onChange({ 
                proposed_fee: e.target.value ? parseFloat(e.target.value) : null 
              })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={data.currency}
              onValueChange={(value) => onChange({ currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="mfn">Most Favored Nations (MFN)</Label>
            <p className="text-xs text-muted-foreground">
              Fee matches highest paid to any licensor on this project
            </p>
          </div>
          <Switch
            id="mfn"
            checked={data.is_mfn}
            onCheckedChange={(checked) => onChange({ is_mfn: checked })}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="most_favored">Most Favored Terms</Label>
            <p className="text-xs text-muted-foreground">
              Request parity with best terms offered to other licensors
            </p>
          </div>
          <Switch
            id="most_favored"
            checked={data.is_most_favored_terms}
            onCheckedChange={(checked) => onChange({ is_most_favored_terms: checked })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information or special requests..."
            value={data.additional_notes}
            onChange={(e) => onChange({ additional_notes: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

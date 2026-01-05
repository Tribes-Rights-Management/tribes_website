import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  "Cover",
  "Agreement",
  "Your Info",
  "Product",
  "Track",
  "Review",
  "Done"
];

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  // Don't show progress on cover (0) or thank you (6) steps
  if (currentStep === 0 || currentStep === 6) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps - 2}
        </span>
        <span className="text-sm font-medium">
          {STEP_LABELS[currentStep]}
        </span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full bg-primary transition-all duration-300 ease-out")}
          style={{ width: `${(currentStep / (totalSteps - 2)) * 100}%` }}
        />
      </div>
    </div>
  );
}

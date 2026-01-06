interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ["Cover", "Agreement", "Your Info", "Product", "Track", "Review", "Done"];

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  if (currentStep === 0 || currentStep === 6) return null;

  const progress = (currentStep / (totalSteps - 2)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps - 2}
        </span>
        <span className="text-xs font-medium">{STEP_LABELS[currentStep]}</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

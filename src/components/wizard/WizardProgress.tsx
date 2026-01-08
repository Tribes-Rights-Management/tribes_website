// INSTITUTIONAL PROGRESS INDICATOR (LOCKED)
// - Text-only, no progress bars or animations
// - Minimal, left-aligned
// - Administrative tone

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  // Hide on cover step (0) and thank you step (last)
  if (currentStep === 0 || currentStep >= totalSteps - 1) return null;

  // Calculate actual step number (excluding cover and thank you)
  const displayStep = currentStep;
  const displayTotal = totalSteps - 2;

  return (
    <p className="text-[13px] text-muted-foreground">
      Step {displayStep} of {displayTotal}
    </p>
  );
}

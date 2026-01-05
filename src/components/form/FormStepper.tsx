import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <li key={step} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isCompleted && onStepClick?.(index)}
                  disabled={!isCompleted}
                  className={cn(
                    "step-indicator",
                    isCompleted && "step-completed cursor-pointer hover:bg-primary/20",
                    isCurrent && "step-active",
                    isPending && "step-pending"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </button>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center max-w-[80px] hidden sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px",
                    isCompleted ? "bg-primary/30" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const STORAGE_KEY = "tribes_portal_onboarding_completed";

interface OnboardingStep {
  headline: string;
  body?: string;
  bullets?: string[];
  supportingLine?: string;
  action: string;
}

const STEPS: OnboardingStep[] = [
  {
    headline: "Welcome to Tribes",
    body: "This portal is where your music rights, licenses, and records are managed.\n\nEverything submitted here is reviewed before it's finalized.\nNothing moves forward without confirmation.",
    action: "Continue",
  },
  {
    headline: "How this portal is used",
    bullets: [
      "Submit catalog and licensing details in a structured format",
      "Review status and documents at each step",
      "Access finalized agreements and records anytime",
    ],
    supportingLine: "If something is missing or unclear, we'll reach out before anything is completed.",
    action: "Get started",
  },
  {
    headline: "Designed for clarity",
    body: "This system is designed to be straightforward and reliable.\nIf you ever have questions, you'll see clear status updates or hear directly from us.",
    action: "Enter portal",
  },
];

export function PortalOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsOpen(false);
    }
  };

  const step = STEPS[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md p-8 gap-0 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentStep ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <h2 className="text-xl font-medium tracking-tight">
            {step.headline}
          </h2>

          {step.body && (
            <p className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-line">
              {step.body}
            </p>
          )}

          {step.bullets && (
            <ul className="text-left space-y-3 py-2">
              {step.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                  <span className="text-[14px] text-foreground leading-relaxed">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {step.supportingLine && (
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {step.supportingLine}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleNext} className="min-w-[140px]">
            {step.action}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

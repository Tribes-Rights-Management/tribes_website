import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CoverStepProps {
  onStart: () => void;
  isLoading: boolean;
}

export function CoverStep({ onStart, isLoading }: CoverStepProps) {
  return (
    <div className="text-center py-12 max-w-lg mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          New License Request
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          This form collects the information needed to review and issue a license accurately.
          <br /><br />
          Take your time—nothing is finalized until review and approval.
        </p>
      </div>
      
      <Button 
        size="lg" 
        onClick={onStart} 
        disabled={isLoading}
        className="px-8"
      >
        Start
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

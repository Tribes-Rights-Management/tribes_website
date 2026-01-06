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
          New license request
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Complete all fields so we can review and process your request accurately.
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

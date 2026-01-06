import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ThankYouStep() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 max-w-md mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your license request has been submitted
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          We'll review the information provided and follow up if clarification is needed before approval.
        </p>
      </div>

      <Button 
        variant="outline"
        onClick={() => navigate("/portal")}
      >
        Return to Portal
      </Button>
    </div>
  );
}

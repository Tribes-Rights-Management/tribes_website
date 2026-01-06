import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ThankYouStep() {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 max-w-md mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Request received
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          You'll see status updates in your portal.
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

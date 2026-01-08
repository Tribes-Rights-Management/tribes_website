import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// INSTITUTIONAL SUCCESS STATE (LOCKED)
// - No celebratory language, icons, or illustrations
// - Neutral, administrative confirmation
// - Single neutral CTA

export function ThankYouStep() {
  return (
    <div className="py-12">
      <h1 className="text-xl font-semibold mb-3">Submission received.</h1>
      <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
        Your information has been received and will be reviewed.
        If additional information is required, you will be contacted.
      </p>
      
      <Button asChild variant="outline">
        <Link to="/portal">Return to site</Link>
      </Button>
    </div>
  );
}

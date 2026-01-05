import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ThankYouStep() {
  return (
    <div className="text-center py-12 max-w-md mx-auto space-y-8">
      <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Thank you</h1>
        <p className="text-muted-foreground">
          Success! Please check your inbox.
        </p>
      </div>

      <Button 
        variant="outline"
        onClick={() => window.open("https://open.spotify.com/artist/TRIBES_ARTIST_ID", "_blank")}
      >
        Follow on Spotify
      </Button>

      <p className="text-xs text-muted-foreground">
        and close this window
      </p>
    </div>
  );
}

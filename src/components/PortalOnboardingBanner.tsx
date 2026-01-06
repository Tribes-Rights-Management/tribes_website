import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "tribes_portal_banner_dismissed";

export function PortalOnboardingBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-10 py-6 border-b border-border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] text-foreground leading-relaxed mb-1">
            Submit details, review status, and access records.
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            All submissions are reviewed before anything is finalized.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

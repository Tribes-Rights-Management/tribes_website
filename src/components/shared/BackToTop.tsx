import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * BACK TO TOP — INSTITUTIONAL STANDARD
 * 
 * Minimal, accessible back-to-top button.
 * - Black circle with white arrow
 * - Appears after scrolling past 100vh
 * - Smooth fade in/out
 * - Respects prefers-reduced-motion
 */

interface BackToTopProps {
  className?: string;
  /** Threshold in pixels before button appears (default: window.innerHeight) */
  threshold?: number;
}

export function BackToTop({ className, threshold }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollThreshold = threshold ?? window.innerHeight;
      setIsVisible(window.pageYOffset > scrollThreshold);
    };

    // Initial check
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        // Base styles
        "fixed bottom-6 right-6 z-40",
        "w-11 h-11 rounded-full",
        "bg-foreground text-white",
        "flex items-center justify-center",
        "shadow-lg shadow-black/10",
        // Transitions
        "transition-all duration-200 ease-out",
        // Hover/Active states
        "hover:opacity-90 active:scale-95",
        // Focus state
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50",
        // Visibility
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
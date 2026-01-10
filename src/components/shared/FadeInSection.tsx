import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * FADE-IN SECTION — INSTITUTIONAL STANDARD
 * 
 * Provides subtle, professional scroll-triggered fade-in animation.
 * Animation is restrained (0.4s duration, slight upward movement).
 * Uses IntersectionObserver for performance.
 * 
 * Respects prefers-reduced-motion for accessibility.
 */

interface FadeInSectionProps {
  children: ReactNode;
  /** Delay in milliseconds before animation starts */
  delay?: number;
  className?: string;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
}

export function FadeInSection({ 
  children, 
  delay = 0, 
  className,
  threshold = 0.1 
}: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
                setHasAnimated(true);
              }, delay);
            } else {
              setIsVisible(true);
              setHasAnimated(true);
            }
          }
        });
      },
      { threshold }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, threshold, hasAnimated]);

  return (
    <div
      ref={domRef}
      className={cn(
        "transition-all duration-[400ms] ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}
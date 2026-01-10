import { useEffect, useRef } from "react";

/**
 * useScrollLock — Prevents background scroll when modals/menus open.
 * 
 * Features:
 * - Preserves scroll position (no "jump" on open/close)
 * - Compensates for scrollbar width on desktop (no layout shift)
 * - Uses CSS class for styling (scroll-locked on body)
 * 
 * Usage:
 *   useScrollLock(isOpen);
 */
export function useScrollLock(isLocked: boolean) {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      
      // Calculate scrollbar width (difference between window and document width)
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply scrollbar compensation via CSS variable
      document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
      
      // Add scroll-lock class
      document.body.classList.add("scroll-locked");
      
      // Fix scroll position via top offset (prevents iOS Safari jump)
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      // Remove scroll-lock class
      document.body.classList.remove("scroll-locked");
      
      // Remove inline styles
      document.body.style.removeProperty("--scrollbar-width");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("scroll-locked");
      document.body.style.removeProperty("--scrollbar-width");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("width");
    };
  }, [isLocked]);
}

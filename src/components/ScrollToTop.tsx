/**
 * ScrollToTop — Resets scroll position on route changes
 * 
 * This component ensures that when navigating between pages,
 * the viewport scrolls to the top. Works across all devices
 * and browsers including iOS Safari.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use both methods for maximum browser compatibility
    // requestAnimationFrame ensures the DOM has updated before scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    });
  }, [pathname]);

  return null;
}

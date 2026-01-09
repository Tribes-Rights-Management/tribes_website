/**
 * FooterSpacer Component
 * 
 * Creates breathing room between content and footer when content is short.
 * Theme-aware: uses the correct background color based on page theme.
 * 
 * USAGE:
 * - Add at the end of main content, before the footer
 * - Set isDark={true} for dark-themed pages
 * - This ensures no white fall-through on mobile
 * 
 * HEIGHTS (locked):
 * - Mobile: 80px (64-96px range)
 * - Desktop: 100px (80-120px range)
 */

import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";

interface FooterSpacerProps {
  /** Use dark theme background */
  isDark?: boolean;
}

export function FooterSpacer({ isDark = false }: FooterSpacerProps) {
  return (
    <div
      className="w-full min-h-[80px] md:min-h-[100px]"
      style={{ backgroundColor: isDark ? THEME_DARK_BG : THEME_LIGHT_BG }}
      aria-hidden="true"
    />
  );
}

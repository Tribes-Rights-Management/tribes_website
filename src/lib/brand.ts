/**
 * TRIBES Brand System — Institutional Standards
 * 
 * This file establishes locked rules for brand presentation.
 * These values are system-wide constants and should not be overridden.
 * 
 * The TRIBES wordmark is treated as institutional signage:
 * - Always intentional, confident, and permanent
 * - Never incidental, decorative, or diminished
 */

export const BRAND = {
  /** Primary wordmark text */
  wordmark: "TRIBES",
  
  /** Full legal entity name */
  legalName: "Tribes Rights Management",
  
  /** Full legal entity with suffix */
  legalEntity: "Tribes Rights Management LLC",
} as const;

/**
 * Logo Sizing System
 * 
 * Minimum visual size rules ensure the TRIBES mark never appears
 * small or diminished. These are MINIMUM values — components may
 * use larger sizes but never smaller.
 * 
 * All values in pixels for predictable rendering.
 */
export const LOGO_SIZES = {
  /** Header wordmark sizing */
  header: {
    desktop: {
      fontSize: 14,        // text-sm equivalent
      fontWeight: 500,     // font-medium
      letterSpacing: 0,    // normal tracking
    },
    mobile: {
      fontSize: 14,        // maintain readability
      fontWeight: 600,     // font-semibold for small screens
      letterSpacing: 0.5,  // slight tracking for legibility
    },
  },
  
  /** Footer wordmark sizing */
  footer: {
    fontSize: 12,          // text-xs equivalent
    fontWeight: 400,       // font-normal
  },
  
  /** Auth screens (sign-in, request access) */
  auth: {
    fontSize: 24,          // prominent but not overwhelming
    fontWeight: 600,       // font-semibold
    letterSpacing: 1,      // slight tracking for display
  },
  
  /** Portal UI header */
  portal: {
    fontSize: 14,
    fontWeight: 500,
  },
  
  /** Open Graph / social previews */
  og: {
    fontSize: 48,          // large for preview cards
    fontWeight: 700,       // font-bold
    letterSpacing: 2,      // generous tracking at display size
  },
  
  /** Absolute minimums — never go below these */
  minimums: {
    fontSize: 12,          // smallest allowed font size
    tapTarget: 44,         // minimum touch target (px)
  },
} as const;

/**
 * Logo image assets (when using image-based logo)
 * Heights are minimum values to maintain visual presence.
 */
export const LOGO_IMAGES = {
  header: {
    desktop: { height: 24, minHeight: 20 },
    mobile: { height: 20, minHeight: 18 },
  },
  footer: {
    height: 16,
    minHeight: 14,
  },
  auth: {
    height: 32,
    minHeight: 28,
  },
} as const;

/**
 * Navigation sizing standards
 */
export const NAV_SIZES = {
  /** Header heights */
  header: {
    desktop: 56,           // h-14 equivalent
    mobile: 56,            // consistent across breakpoints
  },
  
  /** Tap target minimums (accessibility) */
  tapTarget: {
    min: 44,               // WCAG minimum
    comfortable: 48,       // preferred for primary actions
  },
  
  /** Spacing */
  padding: {
    mobile: 16,            // px-4 equivalent
    tablet: 32,            // px-8 equivalent
    desktop: 48,           // px-12 equivalent
  },
} as const;

/**
 * Animation standards for institutional interfaces
 * Motion should be linear, restrained, and fast.
 */
export const MOTION = {
  /** Duration in milliseconds */
  duration: {
    instant: 100,
    fast: 150,
    normal: 200,
  },
  
  /** Easing functions */
  easing: {
    linear: "linear",
    subtle: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
} as const;

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
  
  /** Primary slogan - LOCKED, do not modify */
  slogan: "Publishing administration, built for precision.",
  
  /** Full legal entity name */
  legalName: "Tribes Rights Management",
  
  /** Full legal entity with suffix */
  legalEntity: "Tribes Rights Management LLC",
} as const;

/**
 * Logo Sizing System — LOCKED BRAND CONSTRAINT
 * 
 * Logo scale is a brand constant, not a layout variable.
 * These values apply globally across header, footer, auth screens,
 * OG images, and system surfaces.
 * 
 * MINIMUM: 20px — logo must never appear smaller than this
 * MOBILE: 22–24px
 * DESKTOP: 24–28px
 * 
 * No responsive shrink or stretch behavior allowed.
 */
export const LOGO_SIZES = {
  /** Absolute minimum — NEVER go below this */
  absoluteMin: 20,
  
  /** Header wordmark sizing */
  header: {
    desktop: {
      fontSize: 15,        // 24-28px range target (using relative)
      fontWeight: 500,     // font-medium
      letterSpacing: 0,    // normal tracking
    },
    mobile: {
      fontSize: 15,        // 22-24px range, never below 20px
      fontWeight: 600,     // font-semibold for small screens
      letterSpacing: 0.5,  // slight tracking for legibility
    },
  },
  
  /** Footer wordmark sizing */
  footer: {
    fontSize: 13,          // above minimum
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
} as const;

/**
 * Logo image assets (when using image-based logo)
 * Heights follow the same locked scale rules.
 */
export const LOGO_IMAGES = {
  /** Absolute minimum height */
  absoluteMin: 20,
  
  header: {
    desktop: { height: 26, minHeight: 24 },
    mobile: { height: 24, minHeight: 22 },
  },
  footer: {
    height: 20,
    minHeight: 20,
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
  /** Header heights — LOCKED */
  header: {
    desktop: 64,           // 64-68px range
    mobile: 64,            // consistent, no shrink
  },
  
  /** Header padding */
  headerPadding: {
    vertical: 16,          // 16px top/bottom
    horizontal: {
      mobile: 20,          // 20px on mobile
      desktop: 48,         // 48px on desktop
    },
  },
  
  /** Tap target minimums (accessibility) */
  tapTarget: {
    min: 44,               // WCAG minimum
    comfortable: 48,       // preferred for primary actions
  },
  
  /** Spacing */
  padding: {
    mobile: 20,            // px-5 equivalent
    tablet: 32,            // px-8 equivalent
    desktop: 48,           // px-12 equivalent
  },
} as const;

/**
 * Animation & Interaction Standards — LOCKED
 * 
 * Motion should be linear, restrained, and fast.
 * No spring, bounce, or elastic effects.
 */
export const MOTION = {
  /** Duration in milliseconds */
  duration: {
    instant: 100,
    fast: 120,             // 120-150ms for interactions
    normal: 150,
  },
  
  /** Easing functions — ease-out only */
  easing: {
    default: "ease-out",
    linear: "linear",
  },
} as const;

/**
 * Interaction States — INSTITUTIONAL RESTRAINT
 * 
 * These rules ensure all hover, focus, and disabled states
 * feel calm, predictable, and professional.
 */
export const INTERACTION = {
  /** Hover opacity shift (10-12%) */
  hover: {
    opacityShift: 0.1,     // 10% shift
    backgroundShift: 0.04, // 4-6% for buttons
  },
  
  /** Focus ring */
  focus: {
    width: 1,              // 1px solid outline
    offset: 2,             // 2px offset
    light: "rgba(0,0,0,0.4)",
    dark: "rgba(255,255,255,0.4)",
  },
  
  /** Disabled state */
  disabled: {
    opacity: 0.5,          // opacity only, no blur/grayscale
  },
  
  /** Active/pressed state */
  active: {
    opacity: 0.85,         // slight opacity dip
  },
} as const;

/**
 * Navigation Pattern Rules — LOCKED
 * 
 * These rules define the structural navigation patterns for institutional interfaces.
 * They reflect approval-based workflows, not consumer browsing behavior.
 * 
 * VIOLATIONS OF THESE RULES REQUIRE EXPLICIT ARCHITECTURAL REVIEW.
 */
export const NAV_PATTERNS = {
  /**
   * Mobile navigation MUST remain top-aligned.
   * 
   * PROHIBITED:
   * - Bottom navigation bars
   * - Tab bars
   * - Floating action buttons for navigation
   * - Swipe-based navigation drawers
   * 
   * REQUIRED:
   * - Fixed top header with hamburger trigger
   * - Right-side slide-in sheet for menu items
   * - Sheet opens with fast, linear animation (no bounce/spring)
   */
  mobile: {
    position: "top" as const,
    menuTrigger: "hamburger" as const,
    menuPosition: "right" as const,
    menuType: "sheet" as const,
    bottomNav: false as const,
    tabBar: false as const,
  },
  
  /**
   * Desktop/tablet navigation uses inline links.
   * No hamburger menu above mobile breakpoint.
   */
  desktop: {
    position: "top" as const,
    layout: "inline" as const,
  },
} as const;

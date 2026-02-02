/**
 * Global Layout Constants — TRIBES INSTITUTIONAL STANDARD (LOCKED)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * MAIN SITE:
 * - Container: 1120px max-width
 * - Gutters: 20px mobile / 28px desktop
 * - Header: 64px
 * 
 * HELP CENTER (must match Portal):
 * - Sidebar: 200px
 * - Header: 56px
 * - Logo: 20px height, 80px max width
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SITE LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

/** 
 * Inner content container: max-width + centering + responsive horizontal padding
 * Uses --gutter (20px mobile / 28px desktop) from index.css
 */
export const CONTENT_CONTAINER_CLASS = "max-w-[1120px] mx-auto w-full px-[var(--gutter)]";

/** Main site header height in pixels */
export const HEADER_HEIGHT = 64;

/** Desktop header height in pixels (legacy alias) */
export const DESKTOP_HEADER_HEIGHT = 64;

/** Mobile header height in pixels (legacy alias) */
export const MOBILE_HEADER_HEIGHT = 64;

/** Desktop sidebar panel width (main site overlays) */
export const DESKTOP_SIDEBAR_WIDTH = 420;

// ═══════════════════════════════════════════════════════════════════════════════
// HELP CENTER LAYOUT (matches Portal exactly)
// ═══════════════════════════════════════════════════════════════════════════════

export const HELP_CENTER = {
  /** Sidebar width — MUST match Portal's 200px */
  SIDEBAR_WIDTH: "200px",
  SIDEBAR_WIDTH_PX: 200,
  
  /** Header height — MUST match Portal's 56px */
  HEADER_HEIGHT: "56px",
  HEADER_HEIGHT_PX: 56,
  
  /** Sidebar horizontal padding */
  SIDEBAR_PADDING_X: "16px",
  
  /** Content max width */
  CONTENT_MAX_WIDTH: "800px",
  
  /** Mobile sidebar width (slide-out drawer) */
  MOBILE_SIDEBAR_WIDTH: "280px",
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BRAND ASSETS (shared with Portal)
// ═══════════════════════════════════════════════════════════════════════════════

export const BRAND = {
  /** Tribes wordmark logo — black on transparent (SVG for website) */
  LOGO_URL: "https://rsdjfnsbimcdrxlhognv.supabase.co/storage/v1/object/public/Tribes%20Brand%20Files/Tribes%20-%20Wordmark%20Black%20Transparent.svg",
  
  /** Logo dimensions — MUST match Portal exactly */
  LOGO_HEIGHT: "20px",
  LOGO_HEIGHT_PX: 20,
  LOGO_MAX_WIDTH: "80px",
  LOGO_MAX_WIDTH_PX: 80,
} as const;

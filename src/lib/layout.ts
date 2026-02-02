/**
 * Global Layout Constants — TRIBES INSTITUTIONAL STANDARD (LOCKED)
 * 
 * MAIN SITE:
 * - Container: 1120px max-width
 * - Gutters: 20px mobile / 28px desktop
 * - Header: 64px
 * 
 * HELP CENTER (matches Portal):
 * - Sidebar: 200px
 * - Header: 56px
 * - Logo: 20px height, 80px max width
 */

// MAIN SITE LAYOUT
export const CONTENT_CONTAINER_CLASS = "max-w-[1120px] mx-auto w-full px-[var(--gutter)]";
export const HEADER_HEIGHT = 64;
export const DESKTOP_HEADER_HEIGHT = 64;
export const MOBILE_HEADER_HEIGHT = 64;
export const DESKTOP_SIDEBAR_WIDTH = 420;

// HELP CENTER LAYOUT (matches Portal exactly)
export const HELP_CENTER = {
  SIDEBAR_WIDTH: "200px",
  SIDEBAR_WIDTH_PX: 200,
  HEADER_HEIGHT: "56px",
  HEADER_HEIGHT_PX: 56,
  CONTENT_MAX_WIDTH: "800px",
  MOBILE_SIDEBAR_WIDTH: "280px",
  SIDEBAR_BG: "#fafafa",
} as const;

// BRAND ASSETS (shared with Portal)
export const BRAND = {
  LOGO_URL: "https://rsdjfnsbimcdrxlhognv.supabase.co/storage/v1/object/public/Tribes%20Brand%20Files/Tribes%20-%20Wordmark%20Black%20Transparent.svg",
  LOGO_HEIGHT: "20px",
  LOGO_HEIGHT_PX: 20,
  LOGO_MAX_WIDTH: "80px",
  LOGO_MAX_WIDTH_PX: 80,
} as const;

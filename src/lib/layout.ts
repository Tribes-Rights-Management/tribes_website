/**
 * Global Layout Constants — TRIBES INSTITUTIONAL STANDARD (LOCKED)
 * 
 * Container: 1120px max-width
 * Gutters: 20px mobile / 28px desktop
 * Header: 64px (all breakpoints)
 * 
 * NON-REGRESSION RULE:
 * - Container is locked at 1120px
 * - Gutters are locked at 20px/28px
 * - Header height is locked at 64px
 */

/** 
 * Inner content container: max-width + centering + responsive horizontal padding
 * Uses --gutter (20px mobile / 28px desktop) from index.css
 */
export const CONTENT_CONTAINER_CLASS = "max-w-[1120px] mx-auto w-full px-[var(--gutter)]";

/** Header height in pixels (locked — same on all breakpoints) */
export const HEADER_HEIGHT = 64;

/** Desktop header height in pixels (legacy alias) */
export const DESKTOP_HEADER_HEIGHT = 64;

/** Mobile header height in pixels (legacy alias) */
export const MOBILE_HEADER_HEIGHT = 64;

/** Desktop sidebar panel width */
export const DESKTOP_SIDEBAR_WIDTH = 420;

/**
 * Global Layout Constants
 * 
 * These values define the horizontal grid system for Tribes Rights Management.
 * All primary content must align to this container to prevent layout drift.
 * 
 * NON-REGRESSION RULE:
 * - Do not widen beyond 1200px unless explicitly instructed
 * - Do not alter padding values without explicit instruction
 * - Header, body, and footer content must share this same grid
 * - Desktop header height is locked at 64px
 * - Mobile header height is locked at 56px
 */

/** 
 * Inner content container: max-width + centering + responsive horizontal padding
 * Desktop: 40px padding | Mobile: 20px padding
 */
export const CONTENT_CONTAINER_CLASS = "max-w-[1200px] mx-auto px-5 md:px-10";

/** Desktop header height in pixels (locked) */
export const DESKTOP_HEADER_HEIGHT = 64;

/** Mobile header height in pixels (locked) */
export const MOBILE_HEADER_HEIGHT = 56;

/** Desktop sidebar panel width */
export const DESKTOP_SIDEBAR_WIDTH = 420;

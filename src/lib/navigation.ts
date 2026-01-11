/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  DO NOT TOUCH NAVIGATION DATA WITHOUT EXPLICIT INSTRUCTION                 ║
 * ║                                                                            ║
 * ║  Source of truth: /docs/NAVIGATION_SPEC.md                                 ║
 * ║                                                                            ║
 * ║  Any change must be validated against spec and regression-tested on        ║
 * ║  mobile/tablet/desktop.                                                    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavConfig {
  primary: NavItem[];
  actions: NavItem[];
}

/**
 * Centralized navigation configuration.
 * Renders identically across mobile overlay and desktop/tablet dropdown.
 * 
 * LOCKED: Do not modify without explicit instruction.
 * See /docs/NAVIGATION_SPEC.md for the full specification.
 */
export const NAV_CONFIG: NavConfig = {
  // Group 1: Primary Navigation
  primary: [
    { label: "Services", href: "/services" },
    { label: "How Administration Works", href: "/how-publishing-admin-works" },
    { label: "How Licensing Works", href: "/how-licensing-works" },
    { label: "Contact", href: "/contact" },
  ],
  
  // Group 2: Action Items
  // LOCKED BRAND STANDARD: "Client Portal" is the canonical label for portal access
  actions: [
    { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
    { label: "Request Licensing Access", href: "/licensing-account" },
  ],
};

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  INSTITUTIONAL MOTION TIMING SPEC v2.0 — LOCKED                            ║
 * ║  Calm, controlled, engineered. No playful or fast motion.                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Motion duration tiers (LOCKED)
 * 
 * Micro:   120ms — Focus, underline, opacity shifts
 * Standard: 220ms — Buttons, links, small state changes
 * Panel:    280ms — Navigation, overlays, modals
 */
export const NAV_TIMING = {
  /** Micro-interactions — 120ms */
  micro: 120,
  /** Standard transitions — 220ms */
  standard: 220,
  /** Panel/overlay transitions — 280ms */
  panel: 280,
  /** Legacy aliases */
  dropdownOpen: 280,
  dropdownClose: 220,
  mobileSlide: 280,
} as const;

/**
 * Institutional easing curve (LOCKED)
 * 
 * Single curve for entire platform: cubic-bezier(0.25, 0.1, 0.25, 1)
 * Calm, controlled, no overshoot or bounce.
 */
export const NAV_EASING = {
  /** Primary easing — institutional standard */
  primary: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  /** Legacy aliases */
  open: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  close: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

/**
 * Navigation transform values (locked)
 * Subtle vertical shift only — no scale, no bounce
 */
export const NAV_TRANSFORM = {
  /** Starting position on open */
  openFrom: 'translateY(-6px)',
  /** Ending position */
  openTo: 'translateY(0)',
  /** Ending position on close */
  closeTo: 'translateY(-4px)',
} as const;

/**
 * Desktop dropdown blur intensity (px)
 */
export const NAV_BLUR_INTENSITY = 6;

/**
 * CSS variable for global use
 */
export const MOTION_CSS = {
  easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  durationMicro: '120ms',
  durationStandard: '220ms',
  durationPanel: '280ms',
} as const;

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
  actions: [
    { label: "Sign in", href: "https://app.tribesrightsmanagement.com", external: true },
    { label: "Request Licensing Access", href: "/licensing-account" },
  ],
};

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  DROPDOWN ANIMATION TIMINGS/EASING ARE FINAL                               ║
 * ║  Do not alter without explicit instruction.                                ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Navigation timing constants (Apple-grade, locked)
 * 
 * Open:  320ms - deliberate, smooth reveal
 * Close: 240ms - controlled, slightly faster than open
 */
export const NAV_TIMING = {
  /** Desktop dropdown open animation duration */
  dropdownOpen: 320,
  /** Desktop dropdown close animation duration */
  dropdownClose: 240,
  /** Mobile overlay slide transition */
  mobileSlide: 280,
} as const;

/**
 * Navigation easing curves (Apple-grade, locked)
 * 
 * Open:  cubic-bezier(0.16, 1, 0.3, 1) - smooth, Apple-like ease-out
 * Close: cubic-bezier(0.4, 0, 0.2, 1)  - controlled, standard ease-out
 */
export const NAV_EASING = {
  /** Open: smooth ease-out, Apple-like */
  open: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Close: controlled, slightly quicker */
  close: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Navigation transform values (locked)
 * 
 * Open:  translateY(-10px) → translateY(0)
 * Close: translateY(0) → translateY(-8px)
 */
export const NAV_TRANSFORM = {
  /** Starting position on open */
  openFrom: 'translateY(-10px)',
  /** Ending position on open / starting position on close */
  openTo: 'translateY(0)',
  /** Ending position on close */
  closeTo: 'translateY(-8px)',
} as const;

/**
 * Desktop dropdown blur intensity (px)
 * Per spec: 4-8px, currently set to 6px
 */
export const NAV_BLUR_INTENSITY = 6;

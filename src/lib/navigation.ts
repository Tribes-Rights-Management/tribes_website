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
 * Navigation timing constants (locked to premium feel)
 */
export const NAV_TIMING = {
  /** Desktop dropdown reveal animation */
  dropdownReveal: 280,
  /** Desktop dropdown content slide delay */
  dropdownContentDelay: 40,
  /** Background blur transition */
  blurTransition: 100,
  /** Mobile overlay slide transition */
  mobileSlide: 220,
} as const;

/**
 * Desktop dropdown blur intensity (px)
 * Per spec: 4-8px, currently set to 6px
 */
export const NAV_BLUR_INTENSITY = 6;

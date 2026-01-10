/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GLOBAL THEME & SPACING SYSTEM — TRIBES LOCKED STANDARD
 * 
 * DO NOT MODIFY SPACING VALUES OR ADD CUSTOM MARGINS.
 * All vertical spacing is governed by the global spacing token system in index.css.
 * Any new section must use existing tokens only.
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THEME ZONE SYSTEM
 * 
 * Dark zones use THEME_DARK_BG (#0B0F14) exclusively
 * Light zones use THEME_LIGHT_BG (#F5F5F7) exclusively
 * No arbitrary background colors in page components
 * Theme transitions happen ONLY at explicit section boundaries
 * 
 * FORM ZONE SYSTEM (LOCKED)
 * 
 * All intake and transactional pages use THEME_LIGHT_BG (neutral gray #F5F5F7)
 * with white input fields (bg-white). This creates clear affordance and
 * distinguishes form pages from marketing content.
 * 
 * FORM PAGES (gray background + white inputs):
 * - Contact (/contact)
 * - Licensing Account (/licensing-account)
 * - Service Inquiry (/services/inquiry)
 * - Auth/Login (/auth)
 * 
 * MARKETING PAGES (white or dark backgrounds only):
 * - All explanatory and promotional content
 * - Legal pages (Privacy, Terms)
 * - Services overview
 * 
 * DO NOT mix white background + white inputs (low affordance).
 * DO NOT use multiple grays across different forms.
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * VERTICAL RHYTHM TOKEN REFERENCE (see index.css for source of truth)
 * 
 * SECTION SPACING (CSS vars):
 * - Dark sections:  var(--section-padding-y-dark)   96px → 120px → 160px
 * - Light sections: var(--section-padding-y-light)  88px → 112px → 144px
 * 
 * STACK SPACING (CSS vars):
 * - --stack-tight:    12px → 14px → 16px  (list items, metadata)
 * - --stack-standard: 20px → 24px → 28px  (heading → paragraph)
 * - --stack-loose:    36px → 44px → 52px  (between subsections)
 * 
 * UTILITY CLASSES:
 * - .section-padding-dark   — Dark section vertical padding
 * - .section-padding-light  — Light section vertical padding
 * - .stack-tight/standard/loose — Flex gap utilities
 * - .mb-stack-tight/standard/loose — Margin utilities
 * - .lede-to-list — Bridge spacing from lede to list content
 * - .list-step-stack — Locked list/step item spacing
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** Primary dark background - used for hero, marketing, and dark sections */
export const THEME_DARK_BG = "#0B0F14";

/** Primary light background - used for form pages, body pages, and light sections */
export const THEME_LIGHT_BG = "#F5F5F7";

/** Tailwind class for dark theme zone background */
export const THEME_DARK_CLASS = "bg-[#0B0F14]";

/** Tailwind class for light theme zone background (form zone) */
export const THEME_LIGHT_CLASS = "bg-[#F5F5F7]";

/**
 * Section padding utility classes (LOCKED)
 * Use these instead of arbitrary padding values
 */
export const SECTION_CLASSES = {
  dark: "section-padding-dark",
  light: "section-padding-light",
} as const;

/**
 * Stack spacing utility classes (LOCKED)
 * For flex containers and margin-based layouts
 */
export const STACK_CLASSES = {
  tight: "stack-tight",      // 12-16px
  standard: "stack-standard", // 20-28px
  loose: "stack-loose",       // 36-52px
  mbTight: "mb-stack-tight",
  mbStandard: "mb-stack-standard",
  mbLoose: "mb-stack-loose",
} as const;

/** Overlay backdrop - institutional standard (dim-first, subtle blur) */
export const OVERLAY_BACKDROP = {
  color: "rgba(0, 0, 0, 0.40)",
  blur: "6px",
};

/** Motion timing - institutional standard (firm, restrained) */
export const MOTION_TIMING = {
  enter: 180, // Fast, restrained
  exit: 140,  // Slightly faster than enter
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)", // Standard ease-out, no spring
};

/** Header height CSS variable name */
export const HEADER_HEIGHT_VAR = "--header-h";

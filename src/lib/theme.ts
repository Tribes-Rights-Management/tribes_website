/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TRIBES MARKETING SITE — LOCKED DESIGN TOKENS (DO NOT TOUCH)
 * 
 * Source of truth for spacing + typography.
 * 
 * RULES:
 * 1) Use ONLY these tokens for spacing (no ad-hoc px/rem).
 * 2) No custom margins/paddings on pages/components.
 * 3) Section padding MUST use section* tokens.
 * 4) Stacks MUST use stack* tokens.
 * 5) Divider blocks MUST use dividerSpacing* tokens.
 * 6) Typography MUST use the locked type scale.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * SPACING SCALE (use only these — see index.css for CSS vars):
 * - space-1:  4px  = 0.25rem
 * - space-2:  8px  = 0.5rem
 * - space-3:  12px = 0.75rem
 * - space-4:  16px = 1rem
 * - space-5:  20px = 1.25rem
 * - space-6:  24px = 1.5rem
 * - space-7:  32px = 2rem
 * - space-8:  40px = 2.5rem
 * - space-9:  48px = 3rem
 * - space-10: 64px = 4rem
 * - space-11: 80px = 5rem
 * - space-12: 96px = 6rem
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * SECTION PADDING (Mobile → Desktop):
 * - sectionDarkMobileY:   64px (4rem)   → sectionDarkDesktopY:   96px (6rem)
 * - sectionLightMobileY:  72px (4.5rem) → sectionLightDesktopY: 104px (6.5rem)
 * - footerMobileTop:      80px (5rem)   → footerDesktopTop:     112px (7rem)
 * - footerMobileBottom:   56px (3.5rem) → footerDesktopBottom:   80px (5rem)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STACK SPACING (Mobile → Desktop):
 * - stackTight:   8px (0.5rem)   → 10px (0.625rem)
 * - stackSmall:  12px (0.75rem)  → 16px (1rem)
 * - stackMedium: 20px (1.25rem)  → 24px (1.5rem)
 * - stackLarge:  32px (2rem)     → 40px (2.5rem)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * TYPOGRAPHY (Mobile → Desktop):
 * - labelCaps: 12px, 500 weight, 0.12em tracking
 * - h1: 44px (2.75rem) → 64px (4rem), 600 weight
 * - h2: 28px (1.75rem) → 36px (2.25rem), 600 weight
 * - h3: 18px (1.125rem) → 20px (1.25rem), 600 weight
 * - body: 16px (1rem) → 18px (1.125rem), 400 weight
 * - small: 14px (0.875rem) → 15px (0.9375rem), 400 weight
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * UTILITY CLASSES (use these in components):
 * - .section--dark / .section--light — Section vertical padding
 * - .footer — Footer asymmetric padding
 * - .stack / .stack--lg/md/sm/tight — Child margin-top rhythm
 * - .stack-tight/small/standard/loose — Flex gap rhythm
 * - .mb-stack-tight/small/standard/loose — Margin bottom utilities
 * - .labelCaps / .h1 / .h2 / .h3 / .body / .small — Typography primitives
 * - .lede-to-list — Bridge spacing from lede to list content
 * - .list-step-stack — List/steps container with locked item gap
 * - .dividerBlock — Divider padding above/below
 * - .container — Responsive container with max-width
 * - .motion — Locked transition duration + easing
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THEME ZONE SYSTEM:
 * - Dark zones use THEME_DARK_BG (#0B0F14) exclusively
 * - Light zones use THEME_LIGHT_BG (#F5F5F7) exclusively
 * - No arbitrary background colors in page components
 * - Theme transitions happen ONLY at explicit section boundaries
 * 
 * FORM ZONE SYSTEM (LOCKED):
 * - All intake/transactional pages use THEME_LIGHT_BG with white inputs
 * - Form pages: Contact, Licensing Account, Service Inquiry, Auth
 * - Marketing pages: white or dark backgrounds only
 * 
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
  dark: "section--dark",
  light: "section--light",
} as const;

/**
 * Stack spacing utility classes (LOCKED)
 * For flex containers and margin-based layouts
 */
export const STACK_CLASSES = {
  tight: "stack-tight",       // 8-10px
  small: "stack-small",       // 12-16px  
  standard: "stack-standard", // 20-24px
  loose: "stack-loose",       // 32-40px
  mbTight: "mb-stack-tight",
  mbSmall: "mb-stack-small",
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
  enter: 200, // Fast, restrained (matches --motionFast)
  exit: 180,  // Slightly faster than enter
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", // Matches --motionEase
};

/** Header height CSS variable name */
export const HEADER_HEIGHT_VAR = "--header-h";

# NAV SYSTEM — FINAL SPEC (LOCKED)

> **DO NOT MODIFY** without explicit instruction. This is the canonical source of truth for the Tribes navigation system.

---

## A. Unified Navigation Architecture

The navigation system is a **single, unified component** that renders identically across all breakpoints. There are no separate "mobile" or "desktop" navigation components.

### Core Principles

1. **One Component**: `UnifiedNavigation` is the sole navigation component
2. **One Data Model**: `NAV_CONFIG` in `src/lib/navigation.ts` is the single source of truth
3. **Responsive Container Sizing Only**: The only difference between breakpoints is container sizing
4. **No Parallel Logic**: No duplicated markup, no separate mobile/desktop code paths

---

## B. Breakpoints

| Name    | Range           | Container Behavior                    |
|---------|-----------------|---------------------------------------|
| Mobile  | < 768px         | Full-screen dropdown sheet            |
| Tablet  | 768px – 1023px  | Content-fit dropdown panel            |
| Desktop | ≥ 1024px        | Content-fit dropdown panel            |

---

## C. Header Behavior

- **All Breakpoints**: Header shows logo + hamburger only. No inline nav items.
- The hamburger is the **only navigation entry point** on all screen sizes.
- Mobile header height: 64px
- Tablet/Desktop header height: 72px

---

## D. Menu Behavior

| Breakpoint      | Container Style                                |
|-----------------|------------------------------------------------|
| Mobile          | Full viewport height below header              |
| Tablet + Desktop| Content-fit height with max-height constraint  |

- Navigation panel is **always** anchored to the top (below header)
- Panel must **not** use side-drawer or lateral slide-in patterns
- Close button visible on mobile only; tablet/desktop close via click-outside or ESC

---

## E. Dropdown Animation (All Breakpoints) — LOCKED

> **Animation values are final. Do not modify easing, duration, or transform behavior unless explicitly instructed.**

| Property         | Open                                      | Close                                     |
|------------------|-------------------------------------------|-------------------------------------------|
| Animation type   | opacity + transform (no height animation) | opacity + transform (no height animation) |
| Transform origin | top center                                | top center                                |
| Opacity          | 0 → 1                                     | 1 → 0                                     |
| Transform        | translateY(-10px) → translateY(0)         | translateY(0) → translateY(-8px)          |
| Duration         | 320ms                                     | 240ms                                     |
| Easing           | cubic-bezier(0.16, 1, 0.3, 1)             | cubic-bezier(0.4, 0, 0.2, 1)              |
| Blur sync        | Same duration + easing as dropdown        | Same duration + easing as dropdown        |

**Motion Rules:**
- No bounce, overshoot, or spring physics
- No scaling effects
- No delay on user input
- Close animation feels slightly faster than open
- Motion is calm, restrained, and premium
- Respects `prefers-reduced-motion` (instant fade, no transforms)

---

## F. Backdrop Blur

- When dropdown is open, apply subtle blur to page content behind the dropdown.
- **Blur intensity**: 6px
- **Background scrim**: rgba(0, 0, 0, 0.3)
- **Transition**: Synchronized with dropdown timing (320ms open, 240ms close)
- Blur affects content only—**not** header or dropdown panel.

---

## G. Visual Tokens

- Menu typography, spacing, dividers, and weights must remain consistent with current premium Tribes styling.
- **Do not change** font families or global type scale.
- Use **shared tokens** (CSS variables / Tailwind config) rather than one-off values.

### Current Token References:
- `--nav-padding-x-mobile`
- `--nav-header-pt-mobile`
- `--nav-header-pb-mobile`
- `--nav-content-pt-mobile`
- `--nav-item-spacing-mobile`
- `--nav-section-spacing-mobile`
- `--nav-divider-color-mobile`

---

## H. Information Architecture

Menu items and grouping are **locked**:

### Group 1 (Primary Navigation)
1. Services → `/services`
2. How Administration Works → `/how-publishing-admin-works`
3. How Licensing Works → `/how-licensing-works`
4. Contact → `/contact`

### Group 2 (Action Items)
1. Client Portal → `https://app.tribesrightsmanagement.com` (external)
2. Request Licensing Access → `/licensing-account`

**LOCKED BRAND STANDARD**: "Client Portal" is the canonical label for portal access across header and footer navigation. Exception: "Sign in" may be used on the Request an Account page for authentication context.

**No renames, reordering, or new items without explicit instruction.**

---

## I. Accessibility + Interaction

| Feature                  | Requirement                                    |
|--------------------------|------------------------------------------------|
| ESC key                  | Closes menu (all breakpoints)                  |
| Click outside            | Closes dropdown (all breakpoints)              |
| Body scroll lock         | When menu is open (all breakpoints)            |
| Scroll position          | Preserved on open/close (no jump)              |
| Scroll bleed prevention  | Wheel/touch events blocked on overlay          |
| Focus trap               | Within menu while open                         |
| Focus states             | Visible focus rings on all interactive elements|
| Skip to content          | Available for keyboard users                   |
| prefers-reduced-motion   | Instant transitions, no transforms             |

---

## J. Implementation Files

| File                                  | Purpose                                        |
|---------------------------------------|------------------------------------------------|
| `src/lib/navigation.ts`               | Centralized nav data + timing constants        |
| `src/components/UnifiedNavigation.tsx`| Single unified navigation component            |
| `src/components/PublicLayout.tsx`     | Layout wrapper, scroll lock, event handlers    |
| `src/index.css`                       | Nav-related CSS tokens and classes             |
| `docs/NAVIGATION_SPEC.md`             | This spec (canonical source of truth)          |

---

## K. Regression Checklist

After any change, verify:

- [ ] Mobile menu = full-screen dropdown, correct hierarchy
- [ ] Tablet menu = content-fit dropdown panel
- [ ] Desktop menu = content-fit dropdown panel
- [ ] No inline nav items appear in header on any breakpoint
- [ ] No layout shift, no scroll bleed, no jitter
- [ ] Keyboard navigation works; focus trap works
- [ ] ESC closes menu on all breakpoints
- [ ] Click outside closes dropdown
- [ ] Menu structure identical across all breakpoints (only sizing differs)

---

**Last Updated**: 2026-01-10  
**Status**: LOCKED — UNIFIED NAVIGATION SYSTEM

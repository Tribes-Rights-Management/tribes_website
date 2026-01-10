# NAV SYSTEM — FINAL SPEC (LOCKED)

> **DO NOT MODIFY** without explicit instruction. This is the canonical source of truth for the Tribes navigation system.

---

## A. Breakpoints

| Name    | Range           |
|---------|-----------------|
| Mobile  | < 768px         |
| Tablet  | 768px – 1023px  |
| Desktop | ≥ 1024px        |

---

## B. Header Behavior

- **Mobile**: Header shows logo + hamburger only. No inline nav items.
- **Tablet**: Header shows logo + hamburger only. No inline nav items.
- **Desktop**: Header shows logo + hamburger only. No inline nav items.

The hamburger is the **only navigation entry point** on all screen sizes.

---

## C. Menu Behavior

| Breakpoint      | Menu Type                                      |
|-----------------|------------------------------------------------|
| Mobile          | Full-screen overlay menu (no blur on content)  |
| Tablet + Desktop| Apple-style dropdown panel (NOT full-screen)   |

- Dropdown panel height is **content-fit** with a comfortable max-height.
- Panel must **not** fill the full viewport.

---

## D. Dropdown Animation (Tablet + Desktop Only) — LOCKED

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

## E. Dropdown Blur (Tablet + Desktop Only)

- When dropdown is open, apply subtle blur to page content behind the dropdown.
- **Blur intensity**: 4–8px equivalent (currently 6px).
- **No dark overlay**, no color wash, no opacity dim (or ≤ 0.05 if absolutely necessary).
- **Transition speed**: ≤ 120ms (currently 100ms).
- Blur affects content only—**not** header or dropdown panel.

---

## F. Visual Tokens

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

## G. Information Architecture

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

## H. Accessibility + Interaction

| Feature                  | Requirement                                    |
|--------------------------|------------------------------------------------|
| ESC key                  | Closes menu (desktop/tablet)                   |
| Click outside            | Closes dropdown (desktop/tablet)               |
| Body scroll lock         | When menu is open (ALL breakpoints)            |
| Scroll position          | Preserved on open/close (no jump)              |
| Scroll bleed prevention  | Wheel/touch events blocked on overlay          |
| Focus trap               | Within menu while open                         |
| Focus states             | Visible focus rings on all interactive elements|
| Skip to content          | Available for keyboard users                   |
| prefers-reduced-motion   | Instant transitions, no transforms             |

---

## I. Implementation Files

| File                              | Purpose                                |
|-----------------------------------|----------------------------------------|
| `src/lib/navigation.ts`           | Centralized nav data + timing constants|
| `src/components/PublicLayout.tsx` | Navigation rendering (single source)   |
| `src/index.css`                   | Nav-related CSS tokens and classes     |
| `docs/NAVIGATION_SPEC.md`         | This spec (canonical source of truth)  |

---

## I. Regression Checklist

After any change, verify:

- [ ] Mobile menu = full-screen overlay, no blur, correct hierarchy
- [ ] Tablet menu = dropdown panel (content-fit), blur on background content only
- [ ] Desktop menu = dropdown panel (content-fit), blur on background content only
- [ ] No inline nav items appear in header on any breakpoint
- [ ] No layout shift, no scroll bleed, no jitter
- [ ] Keyboard navigation works; focus trap works
- [ ] ESC closes menu on tablet/desktop
- [ ] Click outside closes dropdown on tablet/desktop

---

**Last Updated**: 2026-01-10  
**Status**: LOCKED

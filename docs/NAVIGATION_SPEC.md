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

## D. Dropdown Blur (Tablet + Desktop Only)

- When dropdown is open, apply subtle blur to page content behind the dropdown.
- **Blur intensity**: 4–8px equivalent (currently 6px).
- **No dark overlay**, no color wash, no opacity dim (or ≤ 0.05 if absolutely necessary).
- **Transition speed**: ≤ 120ms (currently 100ms).
- Blur affects content only—**not** header or dropdown panel.

---

## E. Visual Tokens

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

## F. Information Architecture

Menu items and grouping are **locked**:

### Group 1 (Primary Navigation)
1. Services → `/services`
2. How Administration Works → `/how-publishing-admin-works`
3. How Licensing Works → `/how-licensing-works`
4. Contact → `/contact`

### Group 2 (Action Items)
1. Sign in → `https://app.tribesrightsmanagement.com` (external)
2. Request Licensing Access → `/licensing-account`

**No renames, reordering, or new items without explicit instruction.**

---

## G. Accessibility + Interaction

| Feature                  | Requirement                                    |
|--------------------------|------------------------------------------------|
| ESC key                  | Closes menu (desktop/tablet)                   |
| Click outside            | Closes dropdown (desktop/tablet)               |
| Body scroll lock         | When menu is open (all sizes, mobile only)     |
| Focus trap               | Within menu while open                         |
| Focus states             | Visible focus rings on all interactive elements|
| Skip to content          | Available for keyboard users                   |

---

## H. Implementation Files

| File                              | Purpose                                |
|-----------------------------------|----------------------------------------|
| `src/lib/navigation.ts`           | Centralized nav data structure         |
| `src/components/PublicLayout.tsx` | Navigation rendering (single source)   |
| `src/index.css`                   | Nav-related CSS tokens and classes     |

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

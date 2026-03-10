# Tribes Website — Codebase Structure

A developer-facing guide to the public website's file organization and conventions.

---

## Directory Layout

```
src/
├── components/          # UI components
│   ├── ui/              # shadcn/ui primitives (do not edit directly)
│   ├── shared/          # Reusable components (ErrorBoundary, FadeInSection, etc.)
│   ├── help/            # Help center rendering components
│   ├── contact/         # Contact form components (KnowledgeBaseSuggestions)
│   ├── PublicLayout.tsx  # Main site layout (header, footer, nav overlay)
│   ├── ContentPageLayout.tsx  # Body page layout (services, legal, info pages)
│   ├── FormPageLayout.tsx     # Form page layout (contact, inquiry, licensing)
│   ├── Hero.tsx          # Landing page hero section
│   ├── Footer.tsx        # Global footer
│   ├── NavOverlay.tsx    # Navigation overlay/menu
│   ├── ConsentRow.tsx    # Privacy/terms consent checkbox
│   └── ScrollToTop.tsx   # Scroll restoration on navigation
├── pages/               # Route-level page components
│   ├── help/            # Public help center pages
│   ├── help-workstation/  # Content management (boundary exception, see below)
│   └── *.tsx            # Marketing, legal, contact, and intake pages
├── hooks/               # Custom React hooks
│   ├── useHelpCenter.ts        # Help center data fetching (Supabase views)
│   ├── useKnowledgeBaseSearch.ts  # Contact form KB suggestions
│   ├── useScrollLock.ts        # Body scroll lock for overlays
│   ├── use-mobile.tsx          # Responsive breakpoint detection
│   └── use-toast.ts            # Toast notification hook
├── lib/                 # Utilities and constants
│   ├── brand.ts         # Brand tokens (wordmark, logo sizes, motion)
│   ├── copyright.ts     # Copyright line generator
│   ├── countries.ts     # Country list for forms
│   ├── layout.ts        # Layout constants (container widths, header heights)
│   ├── navigation.ts    # Navigation config and motion tokens
│   ├── theme.ts         # Theme zone colors and timing
│   └── utils.ts         # General utilities (cn, etc.)
├── types/               # TypeScript type definitions
│   ├── helpCenter.ts    # Help center types (audiences, categories, articles)
│   └── index.ts         # Shared types
├── integrations/        # External service clients
│   └── supabase/        # Supabase client and generated types
└── config/
    └── env.ts           # Environment variable validation
```

---

## Page Layouts

Three layout shells cover all pages:

| Layout | Used By | Purpose |
|---|---|---|
| `PublicLayout` | All pages (wrapped by other layouts) | Header, footer, nav overlay |
| `ContentPageLayout` | Services, legal, informational pages | Standardized body page with H1, lede, content area |
| `FormPageLayout` | Contact, inquiry, licensing pages | Narrower form-optimized layout with dark variant |

The help center uses its own `HelpLayout` component (in `src/components/help/`) which provides a sidebar-based layout independent of `PublicLayout`.

---

## Routes

All routes are public and unauthenticated. See `src/App.tsx` for the complete route table.

- `/` — Landing page
- `/services`, `/our-approach`, `/how-*` — Marketing and informational
- `/contact`, `/services/inquiry`, `/licensing-account` — Intake forms
- `/privacy`, `/terms` — Legal
- `/hc/:audience/**` — Public help center

---

## Help Center

The help center is a **read-only rendering surface**. All content comes from Supabase database views:

- `v_help_categories_by_audience`
- `v_help_articles_by_audience`

Data fetching hooks are in `src/hooks/useHelpCenter.ts`. Rendering components are in `src/components/help/`.

The help center does not author or manage content. Content management belongs in the Tribes Portal.

---

## Backend Interaction

This project uses Supabase with the **anonymous/publishable key only**:

- **Read**: Help center content from database views, knowledge base search
- **Write**: Contact form submission via the `submit-contact` edge function

No authenticated queries. No service-role keys.

---

## Boundary Exception

`/help-workstation/articles` is a content management page that exists in this codebase but belongs in the Portal per `docs/REPO_BOUNDARY.md`. It is a known exception documented for future migration. No additional management routes should be added.

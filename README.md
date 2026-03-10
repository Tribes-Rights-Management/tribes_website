# Tribes Website

The public-facing website for [Tribes Rights Management](https://www.tribesrightsmanagement.com). This repository owns the institutional brand presence, informational content, licensing intake flows, and public help-center rendering.

This is **not** the authenticated application. The **Tribes Portal** — a separate project and repository — handles user accounts, operational workflows, admin consoles, content management, and all product functionality.

---

## What This Repository Owns

| Surface | Description |
|---|---|
| Marketing pages | Brand narrative, service descriptions, approach overview |
| Informational pages | How licensing works, how publishing admin works |
| Legal and policy pages | Privacy policy, terms of service |
| Contact and intake | Contact form, service inquiry form |
| Public help center | Audience-segmented help articles rendered from Supabase (`/hc`) |
| Public article browser | Read-only article listing (`/help-workstation/articles`) |

## What This Repository Does Not Own

- Authenticated user sessions or login flows
- User dashboards, portals, or work areas
- Admin consoles or internal workstations
- Help-center content authoring, editing, reordering, or publishing
- Billing, governance, or operational product features
- Any feature requiring an authenticated user context

See [`docs/REPO_BOUNDARY.md`](docs/REPO_BOUNDARY.md) for the full boundary definition.

---

## Relationship to Tribes Portal

The **Tribes Portal** is a separate repository responsible for all authenticated product operations — user account management, admin consoles, content management, contract workflows, royalty processing, and internal tools.

The Portal is accessed at `https://app.tribesrightsmanagement.com`. Links from this website to the Portal (labeled "Client Portal") open in the same browser tab and point to that external domain.

Both projects share a common Supabase backend. This website accesses only public-safe views and tables using the anonymous key; the Portal operates with authenticated user sessions and manages all content authoring workflows.

---

## Local Development

### Prerequisites

- Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```sh
git clone https://github.com/Tribes-Rights-Management/tribesrightsmanagement
cd tribesrightsmanagement
npm i
npm run dev
```

### Environment Variables

Required:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/publishable key |

Optional:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier |
| `VITE_APP_URL` | Application URL (defaults to `http://localhost:5173`) |

---

## Technology Stack

- React with TypeScript
- Vite
- Tailwind CSS (semantic design tokens)
- shadcn/ui
- Supabase (database views, edge functions)
- React Router
- React Query

---

## Deployment

Deployed via Lovable (Share → Publish). Custom domains are configured in Project → Settings → Domains.

---

## Documentation

| Document | Purpose |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture and design principles |
| [`docs/REPO_BOUNDARY.md`](docs/REPO_BOUNDARY.md) | Boundary definition between Website and Portal |
| [`docs/STRUCTURE.md`](docs/STRUCTURE.md) | Codebase structure and file organization |
| [`docs/NAVIGATION_SPEC.md`](docs/NAVIGATION_SPEC.md) | Navigation system specification |

---

## Contributing

- All routes must be public and unauthenticated
- Use semantic design tokens from `index.css` and `tailwind.config.ts` — no hardcoded colors
- Review [`docs/REPO_BOUNDARY.md`](docs/REPO_BOUNDARY.md) before adding features to confirm they belong in this project
- Keep components small and focused; shared utilities belong in `src/lib/`
- The Website reads help content; it never writes, edits, or manages it

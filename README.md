# Tribes Rights Management — Public Website

## Overview

This repository contains the **public-facing Tribes Rights Management website**. It serves as the institutional brand presence, informational resource, and licensing intake surface for Tribes Rights Management.

This is **not** the authenticated application. The Tribes Portal — which handles user accounts, operational workflows, admin consoles, and all product functionality — is a separate project and repository.

## Intended Audience

- Prospective clients evaluating Tribes services
- Songwriters, publishers, and licensees seeking information
- Visitors accessing public help-center articles
- Users submitting contact or licensing inquiry forms

## Surfaces and Modules

| Surface | Description |
|---|---|
| **Marketing Pages** | Brand narrative, service descriptions, approach overview |
| **Informational Pages** | How licensing works, how publishing admin works |
| **Legal/Policy Pages** | Privacy policy, terms of service |
| **Contact & Intake** | Contact form, service inquiry form |
| **Public Help Center** | Audience-segmented help articles rendered from Supabase (`/hc/:audience`) |
| **Pre-Launch Page** | Landing page / primary entry point |

## What This Repository Does NOT Own

- Authenticated user sessions or login flows
- User dashboards, portals, or work areas
- Admin consoles or internal workstations
- Tenant/membership context management
- Help-center content authoring or management (read-only consumption only)
- Billing, governance, or operational product features
- Any feature requiring an authenticated user context

## Relationship to Tribes Portal

The **Tribes Portal** is a separate project and repository responsible for all authenticated product operations. This includes user account management, admin consoles, content management workstations, contract workflows, royalty processing, and all internal operational tools.

The Portal is accessed externally at `https://app.tribesrightsmanagement.com`. Links from this website to the Portal (labeled "Client Portal") open in the same browser tab and point to that external domain.

These two projects share a common Supabase backend for data storage and edge functions, but serve fundamentally different purposes: this website is a public read/intake surface; the Portal is a private operational application.

## Local Development

### Prerequisites

- Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup

```sh
# Clone the repository
git clone <https://github.com/Tribes-Rights-Management/tribesrightsmanagement>

# Navigate to the project directory
cd tribesrightsmanagement

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Environment Variables

The following environment variables are required:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/publishable key |

Optional:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier |
| `VITE_APP_URL` | Application URL (defaults to `http://localhost:5173`) |

## Technology Stack

- **React** with **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS** (styling via semantic design tokens)
- **shadcn/ui** (component library)
- **Supabase** (backend: database views, edge functions)
- **React Router** (client-side routing)
- **React Query** (data fetching and caching)

## Deployment

This project is deployed via Lovable. To publish, open the Lovable project and use Share → Publish.

Custom domains are supported via Project → Settings → Domains. See [Lovable custom domain docs](https://docs.lovable.dev/features/custom-domain#custom-domain).

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture and design principles
- [`docs/REPO_BOUNDARY.md`](docs/REPO_BOUNDARY.md) — Boundary definition between Website and Portal
- [`docs/NAVIGATION_SPEC.md`](docs/NAVIGATION_SPEC.md) — Navigation system specification

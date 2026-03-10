# Tribes — Repository Boundary Definition

This document defines the boundary between the **Tribes Website** (this repository) and the **Tribes Portal** (separate repository). It governs where features, routes, and responsibilities belong.

---

## Responsibilities Owned by Tribes Website

| Area | Scope |
|---|---|
| **Public marketing** | Brand pages, service descriptions, approach narrative |
| **Informational content** | How licensing works, how publishing admin works, licensing account info |
| **Legal and policy** | Privacy policy, terms of service |
| **Contact and intake** | Contact form, service inquiry form, form submission via edge functions |
| **Help center rendering** | Public display of help articles, categories, and search (read-only) |
| **Brand presentation** | Visual identity, typography, layout, and design token ownership |
| **External Portal linking** | "Client Portal" links pointing to `https://app.tribesrightsmanagement.com` |

---

## Responsibilities Owned by Tribes Portal

| Area | Scope |
|---|---|
| **Authentication** | Login, signup, password reset, session management |
| **User accounts** | Profiles, preferences, account settings |
| **Dashboards and work areas** | Client dashboards, operational views |
| **Admin consoles** | Platform administration, user management |
| **Content management** | Help article authoring, editing, publishing workflows |
| **Contract workflows** | Contract creation, amendment, signature tracking |
| **Royalty processing** | Statements, payments, disputes |
| **Catalog management** | Compositions, metadata, territory rights |
| **Team and permissions** | User roles, access controls, invitations |
| **Billing and governance** | Invoicing, financial operations, compliance |
| **Tenant context** | Multi-tenant isolation, organization switching |
| **API token management** | Token issuance, revocation, access logging |
| **Operational workstations** | Any internal tool requiring authenticated access |

---

## Shared Backend Dependencies

Both projects connect to the **same Supabase instance**. They share:

- **Database tables and views**: The schema is shared, but each project accesses only the subset appropriate to its role
- **Edge functions**: Some edge functions (e.g., `submit-contact`) serve the Website; others serve the Portal; some may serve both
- **Row-Level Security policies**: RLS enforces access boundaries at the database level

### Access Pattern Differences

| | Website | Portal |
|---|---|---|
| **Supabase key** | Anonymous/publishable only | Anonymous + service-role as needed |
| **User context** | None | Authenticated user sessions |
| **Data access** | Public views and tables | Full schema with RLS-enforced policies |
| **Write operations** | Form submissions only | Full CRUD on operational data |

---

## Decision Rules: Website or Portal?

Use the following questions to determine where a new feature belongs:

1. **Does it require a logged-in user?** → Portal
2. **Does it create, update, or delete operational data?** → Portal
3. **Does it display information that varies by user identity or tenant?** → Portal
4. **Does it manage content that other users consume?** → Portal
5. **Is it a tool, console, or workstation?** → Portal
6. **Is it public information that any visitor can see?** → Website
7. **Is it a form that submits data without requiring authentication?** → Website
8. **Is it brand, trust, or educational content?** → Website

If the answer is ambiguous, default to the Portal. The Website should remain a minimal, public-only surface.

---

## Examples: Features That Belong in Website

- A new marketing page explaining a service offering
- A new legal page (e.g., cookie policy)
- Adding a new audience tab to the help center
- Updating the contact form to collect additional fields
- A public FAQ or knowledge base search interface
- Informational landing pages for specific campaigns

---

## Examples: Features That Do NOT Belong in Website

- A login page or authentication flow
- A dashboard showing user-specific data
- An admin panel for managing help articles
- A page that lists a user's contracts or royalties
- A settings page for notification preferences
- Any page that checks `auth.uid()` or requires a session
- A content editor or CMS interface
- Bulk import tools, data export features, or operational utilities

---

## Help Center Rendering Rules

The public help center (`/hc`) in this Website project operates under these constraints:

1. **Read-only**: The Website renders help content; it never creates, edits, or deletes it
2. **Audience-segmented**: Content is filtered by audience slug (publishers, songwriters, licensing)
3. **Database-driven**: All content comes from Supabase views (`v_help_categories_by_audience`, `v_help_articles_by_audience`); no hardcoded article content in the codebase
4. **Anonymous access**: All help center queries use the anonymous Supabase key
5. **No editorial controls**: Features like publish/unpublish, reordering, or content editing belong in the Portal
6. **Search is public-safe**: Search queries run against the `support_knowledge_base` table using keyword matching with no elevated permissions

---

## Rules Preventing This Repo from Becoming an Authenticated Application

1. **No auth dependencies**: This project must not import or configure Supabase auth, AuthContext, or session management utilities
2. **No protected routes**: No route in this project should redirect to a login page or check authentication state
3. **No user-specific rendering**: No component should conditionally render based on a user's identity, role, or tenant membership
4. **No service-role keys**: Only the anonymous/publishable Supabase key is permitted
5. **No session storage**: No tokens, user IDs, or session data should be stored in localStorage, sessionStorage, or cookies
6. **No portal-style layouts**: Dashboard layouts, sidebar navigation for authenticated contexts, and admin chrome must not be added
7. **External Portal links only**: Any reference to authenticated functionality must link to `https://app.tribesrightsmanagement.com`, not to a local route

### Boundary Exception

The route `/help-workstation/articles` currently exists in this codebase. This is a content management interface that, per the boundary rules above, belongs in the Portal. It is documented here as a **known exception** and candidate for future migration. No additional workstation or management routes should be added to this project.

---

## Governance

Changes that would move this project closer to an authenticated application — including adding auth libraries, protected routes, user-specific data fetching, or operational workflows — require explicit architectural review and must not be implemented without updating this boundary document.

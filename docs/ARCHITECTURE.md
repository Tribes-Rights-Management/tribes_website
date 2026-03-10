# Tribes Website — Architecture

## System Role

This repository serves as the **public-facing website** for Tribes Rights Management. Its role in the broader Tribes ecosystem is strictly limited to:

1. Presenting the institutional brand and service information
2. Rendering public help-center content for multiple audiences
3. Accepting contact and licensing inquiry submissions
4. Displaying legal and policy documents

This repository does not host any authenticated application functionality. All product operations, user account management, administrative workflows, and content management belong to the separate Tribes Portal project.

---

## Route and Surface Structure

All routes in this project are **public and unauthenticated**.

### Marketing and Informational

| Route | Purpose |
|---|---|
| `/` | Pre-launch / primary landing page |
| `/marketing` | Marketing page |
| `/services` | Services overview |
| `/services/inquiry` | Service inquiry intake form |
| `/our-approach` | Approach and methodology |
| `/how-licensing-works` | Licensing process explanation |
| `/how-publishing-admin-works` | Publishing administration explanation |
| `/licensing-account` | Licensing account information |
| `/contact` | Contact form |

### Legal and Policy

| Route | Purpose |
|---|---|
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Public Help Center

| Route | Purpose |
|---|---|
| `/hc` | Redirect to default audience |
| `/hc/:audience` | Help center home for a specific audience |
| `/hc/:audience/categories/:categorySlug` | Category listing within an audience |
| `/hc/:audience/articles/:articleSlug` | Individual article rendering |
| `/help/articles` | Public article browser (read-only listing of help content) |

---

## Backend and Data Dependencies

### Supabase

This project connects to a shared Supabase instance using only the **anonymous/publishable key**. It does not use service-role keys or perform any privileged backend operations.

#### Database Views (Read-Only)

- `v_help_categories_by_audience` — Categories filtered by audience for help center rendering
- `v_help_articles_by_audience` — Articles filtered by audience for help center rendering

#### Tables (Read-Only)

- `help_audiences` — Audience definitions (publishers, songwriters, licensing)
- `help_articles` — Article metadata for the public article browser
- `help_categories` — Category metadata for the public article browser
- `help_article_audiences` — Article-to-category mappings for category-filtered browsing
- `support_knowledge_base` — Knowledge base articles for contact form suggestions

#### Edge Functions

- `submit-contact` — Processes contact form submissions

### Data Access Pattern

All Supabase queries use the anonymous client and rely on Row-Level Security (RLS) policies to enforce public-safe access. No authenticated user context is required or used.

---

## Help Center Public Rendering

The help center is a **read-only consumption surface**. It renders content that is authored and managed in the Tribes Portal.

### Public Help Routes

- `/hc/:audience/**` — Audience-segmented article reading experience (sidebar layout, markdown rendering, search)
- `/help/articles` — Public article browser with list and category views

### Architecture

- **Audience-segmented**: Content is organized by audience (publishers, songwriters, licensing)
- **Supabase-powered**: Articles and categories are fetched from database views and tables
- **Sidebar + responsive layout**: Desktop uses a 200px sidebar; mobile uses a horizontal header with grid layout
- **Markdown rendering**: Article content is rendered via `react-markdown` with typography overrides
- **Search**: Keyword-based search queries against the `support_knowledge_base` table

### Constraints

- This project **renders** help content; it does not **author** it
- No article creation, editing, deletion, or reordering operations belong in this project
- Content management (authoring, publishing, ordering) belongs in the Portal

---

## Operational Boundaries

### This Project May

- Fetch and display public data from Supabase using the anonymous key
- Submit form data via Supabase edge functions
- Render markdown content from the database
- Link to the external Portal at `https://app.tribesrightsmanagement.com`
- Use client-side caching (React Query) for performance

### This Project Must Not

- Implement authentication flows (login, signup, password reset)
- Create, update, or delete backend records (except form submissions)
- Access data requiring an authenticated user session
- Use service-role keys or elevated Supabase credentials
- Implement admin, dashboard, or operational interfaces
- Store or manage user sessions, tokens, or tenant context
- Provide content authoring, editing, or publishing workflows

---

## Architectural Principles

1. **Public-only surface**: Every page must be accessible without authentication
2. **Read-heavy, write-minimal**: The only write operations are form submissions via edge functions
3. **Shared backend, separate concerns**: The Supabase instance is shared with the Portal, but this project accesses only public-safe views and tables
4. **Semantic design tokens**: All styling uses the design token system defined in `index.css` and `tailwind.config.ts`; no hardcoded colors in components
5. **Component boundaries**: UI components are small and focused; shared utilities live in `src/lib/`
6. **No shadow application**: Features that require user context, state management beyond caching, or operational workflows must not be added to this project

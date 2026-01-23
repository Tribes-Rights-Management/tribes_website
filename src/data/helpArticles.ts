import type { HelpArticle } from "@/types/helpCenter";

export const helpArticles: Record<string, HelpArticle> = {
  "welcome-to-tribes": {
    slug: "welcome-to-tribes",
    title: "Welcome to Tribes Rights Management",
    category: "getting-started",
    updatedAt: "2025-01-15",
    relatedArticles: ["create-first-project", "understanding-dashboard", "add-first-catalog"],
    content: `This is your complete guide to getting started with Tribes Rights Management. We provide premium music publishing administration and licensing services designed for the creative and executive class in the music community.

## What is Tribes?

Tribes is a modern music rights management platform that helps publishers, songwriters, and rights holders manage their catalogs, track royalties, and handle licensing—all in one place.

Our platform is built for professionals who need:
- Comprehensive catalog management with ISWC tracking
- Real-time royalty analytics and statements
- Automated split calculations and payments
- Sync licensing workflow management
- Team collaboration with role-based permissions

## Getting Started

To begin using Tribes, you'll need to complete a few setup steps:

1. **Verify your account** - Complete identity verification to unlock all features
2. **Add your catalog** - Import your compositions manually or via CSV
3. **Configure splits** - Set up songwriter and publisher splits
4. **Invite your team** - Add collaborators with appropriate permissions
5. **Set up payments** - Configure your payment methods and thresholds

## Need Help?

If you have questions during setup, our support team is available to help. You can reach us through the contact page on our website.`
  },
  "create-first-project": {
    slug: "create-first-project",
    title: "How to Create Your First Project",
    category: "getting-started",
    updatedAt: "2025-01-10",
    relatedArticles: ["welcome-to-tribes", "add-first-catalog", "invite-team-members"],
    content: `Projects in Tribes help you organize your work by album, release, or campaign. Here's how to create your first project.

## Creating a New Project

1. Navigate to the Projects section from your dashboard
2. Click the "New Project" button in the top right
3. Enter a project name and optional description
4. Select the project type (Album, Single, Sync, or Custom)
5. Click "Create Project"

## Project Settings

After creating your project, you can configure:

### Basic Information
- Project name and description
- Cover art or thumbnail
- Release date (if applicable)
- Label or client association

### Team Access
- Add team members with specific roles
- Set permission levels for viewing and editing
- Enable or disable external collaborator access

## Best Practices

- Use clear, descriptive project names
- Add all relevant compositions before inviting collaborators
- Set up splits early to avoid confusion later`
  },
  "understanding-dashboard": {
    slug: "understanding-dashboard",
    title: "Understanding Your Dashboard",
    category: "getting-started",
    updatedAt: "2025-01-08",
    relatedArticles: ["welcome-to-tribes", "earnings-reports", "dashboard-overview"],
    content: `Your Tribes dashboard provides an at-a-glance view of your most important metrics and recent activity.

## Dashboard Overview

The dashboard is divided into several key sections:

### Earnings Summary
- Current period earnings
- Pending payments
- Comparison to previous periods
- Top performing works

### Recent Activity
- New royalty statements received
- Contract updates
- Team member actions
- System notifications

### Quick Actions
- Add new composition
- Generate report
- Invite team member
- View full analytics

## Customizing Your Dashboard

You can personalize your dashboard by:
- Rearranging widgets via drag and drop
- Hiding sections you don't need
- Setting your preferred date range
- Choosing between chart types`
  },
  "add-first-catalog": {
    slug: "add-first-catalog",
    title: "Adding Your First Catalog",
    category: "getting-started",
    updatedAt: "2025-01-05",
    relatedArticles: ["register-compositions", "bulk-import-csv", "catalog-metadata"],
    content: `Learn how to add your music catalog to Tribes for comprehensive rights management.

## Manual Entry

For smaller catalogs or individual works:

1. Go to Catalog > Add Composition
2. Enter the work title and alternate titles
3. Add songwriter information and splits
4. Enter publisher details
5. Add ISWC if available
6. Save the composition

## Bulk Import

For larger catalogs, use our CSV import feature:

1. Download our template from Catalog > Import
2. Fill in your catalog data following the template format
3. Upload the completed CSV file
4. Review the import preview
5. Confirm and process the import

## Required Information

At minimum, each composition needs:
- Work title
- At least one songwriter
- Ownership percentage(s)

## Optional but Recommended

- ISWC (International Standard Musical Work Code)
- Alternate titles
- PRO registration numbers
- Territory restrictions`
  },
  "invite-team-members": {
    slug: "invite-team-members",
    title: "Inviting Team Members",
    category: "getting-started",
    updatedAt: "2025-01-03",
    relatedArticles: ["user-roles", "permission-levels", "remove-team-member"],
    content: `Collaborate with your team by inviting them to your Tribes organization.

## Sending Invitations

1. Navigate to Settings > Team
2. Click "Invite Member"
3. Enter their email address
4. Select their role (Admin, Manager, or Viewer)
5. Optionally add them to specific projects
6. Send the invitation

## Role Types

### Admin
Full access to all features, billing, and settings.

### Manager
Can manage catalog, contracts, and team members but cannot access billing.

### Viewer
Read-only access to assigned projects and reports.

## Pending Invitations

You can view and manage pending invitations from the Team page. Invitations expire after 7 days and can be resent if needed.`
  },
  "setup-payment-methods": {
    slug: "setup-payment-methods",
    title: "Setting Up Payment Methods",
    category: "getting-started",
    updatedAt: "2024-12-28",
    relatedArticles: ["payment-methods", "payment-schedules", "international-payments"],
    content: `Configure how you receive royalty payments from Tribes.

## Adding a Payment Method

1. Go to Settings > Payments
2. Click "Add Payment Method"
3. Choose your preferred method:
   - ACH (US bank accounts)
   - Wire transfer (International)
   - PayPal
4. Enter the required information
5. Verify your account (if required)

## Payment Thresholds

Set minimum payment thresholds to control when payments are issued:
- Default threshold: $100
- Minimum allowed: $25
- You can request manual payout at any time for amounts over $25

## Tax Information

Before receiving payments, you must complete tax documentation:
- US persons: W-9 form
- Non-US persons: W-8BEN or W-8BEN-E form

Tax forms can be completed electronically in Settings > Tax Documents.`
  },
  "account-verification": {
    slug: "account-verification",
    title: "Account Verification Process",
    category: "account-setup",
    updatedAt: "2025-01-12",
    relatedArticles: ["organization-settings", "two-factor-auth"],
    content: `Complete account verification to unlock all Tribes features.

## Why Verify?

Verification is required to:
- Receive royalty payments
- Sign contracts electronically
- Access premium features
- Invite team members

## Verification Steps

### Individual Accounts
1. Provide government-issued ID
2. Confirm your address
3. Complete a brief video verification

### Organization Accounts
1. Provide business registration documents
2. Verify authorized representatives
3. Confirm business address
4. Complete beneficial owner documentation (if applicable)

## Processing Time

Most verifications are completed within 1-2 business days. Complex cases may take up to 5 business days.`
  },
  "organization-settings": {
    slug: "organization-settings",
    title: "Organization Settings",
    category: "account-setup",
    updatedAt: "2025-01-10",
    relatedArticles: ["account-verification", "notification-preferences"],
    content: `Configure your organization's profile and preferences.

## Basic Information

Update your organization details:
- Legal business name
- DBA / Trading name
- Business address
- Phone number
- Website

## Branding

Customize your organization's appearance:
- Upload company logo
- Set brand colors
- Configure email templates

## Defaults

Set organization-wide defaults:
- Default currency
- Timezone
- Fiscal year start
- Report preferences`
  },
  "two-factor-auth": {
    slug: "two-factor-auth",
    title: "Setting Up Two-Factor Authentication",
    category: "account-setup",
    updatedAt: "2025-01-08",
    relatedArticles: ["account-verification", "notification-preferences"],
    content: `Add an extra layer of security to your Tribes account.

## Enabling 2FA

1. Go to Settings > Security
2. Click "Enable Two-Factor Authentication"
3. Choose your preferred method:
   - Authenticator app (recommended)
   - SMS verification
4. Follow the setup instructions
5. Save your backup codes

## Authenticator Apps

We recommend these authenticator apps:
- Google Authenticator
- Authy
- 1Password
- Microsoft Authenticator

## Backup Codes

Store your backup codes securely. These are the only way to access your account if you lose your authentication device.`
  },
  "notification-preferences": {
    slug: "notification-preferences",
    title: "Notification Preferences",
    category: "account-setup",
    updatedAt: "2025-01-05",
    relatedArticles: ["organization-settings", "two-factor-auth"],
    content: `Control how and when Tribes notifies you.

## Email Notifications

Configure email alerts for:
- New royalty statements
- Payment confirmations
- Contract updates
- Team activity
- System announcements

## In-App Notifications

Manage which activities appear in your notification center.

## Digest Options

Choose notification frequency:
- Instant (as they happen)
- Daily digest
- Weekly summary
- Important only`
  },
  "register-compositions": {
    slug: "register-compositions",
    title: "Registering New Compositions",
    category: "catalog-management",
    updatedAt: "2025-01-14",
    relatedArticles: ["bulk-import-csv", "iswc-work-ids", "catalog-metadata"],
    content: `Register your musical works with Tribes for comprehensive rights management.

## Adding a New Composition

Navigate to Catalog > Add Composition and enter:

### Basic Information
- Work title (original)
- Alternate titles (translations, versions)
- Language of lyrics
- Duration

### Songwriters
- Add all contributing songwriters
- Specify their roles (Composer, Lyricist, Arranger)
- Enter ownership percentages

### Publishers
- Add publisher information
- Specify controlled percentages
- Note any sub-publishing arrangements

## After Registration

Once registered, you can:
- Generate CWR files for society registration
- Track royalty statements
- Manage licensing requests
- View performance analytics`
  },
  "bulk-import-csv": {
    slug: "bulk-import-csv",
    title: "Bulk Import via CSV",
    category: "catalog-management",
    updatedAt: "2025-01-12",
    relatedArticles: ["register-compositions", "catalog-metadata"],
    content: `Import multiple compositions at once using our CSV template.

## Download Template

1. Go to Catalog > Import
2. Click "Download Template"
3. Open the file in Excel or Google Sheets

## Template Columns

Required columns:
- work_title
- songwriter_name
- songwriter_ipi
- ownership_percentage

Optional columns:
- alternate_titles
- iswc
- publisher_name
- publisher_ipi
- territory_restrictions

## Upload Process

1. Fill in your data following the template format
2. Save as CSV (UTF-8 encoding recommended)
3. Return to Catalog > Import
4. Upload your file
5. Review the validation results
6. Fix any errors flagged
7. Confirm the import

## Validation

The system will check for:
- Required field completeness
- Percentage totals (must equal 100%)
- IPI number format
- Duplicate detection`
  },
  "manage-songwriter-splits": {
    slug: "manage-songwriter-splits",
    title: "Managing Songwriter Splits",
    category: "catalog-management",
    updatedAt: "2025-01-10",
    relatedArticles: ["split-sheets", "create-contracts"],
    content: `Configure and update ownership splits for your compositions.

## Viewing Current Splits

1. Navigate to a composition's detail page
2. Click the "Splits" tab
3. View current ownership distribution

## Updating Splits

To modify splits:
1. Click "Edit Splits"
2. Adjust percentages as needed
3. Add or remove parties
4. Provide effective date
5. Add notes explaining the change
6. Submit for approval (if required)

## Split History

All split changes are logged with:
- Date of change
- Previous values
- New values
- User who made the change
- Reason for change`
  },
  "iswc-work-ids": {
    slug: "iswc-work-ids",
    title: "Understanding ISWC and Work IDs",
    category: "catalog-management",
    updatedAt: "2025-01-08",
    relatedArticles: ["register-compositions", "catalog-metadata"],
    content: `Learn about work identifiers used in music rights management.

## ISWC (International Standard Musical Work Code)

The ISWC is a unique identifier for musical works:
- Format: T-123.456.789-C
- Assigned by authorized agencies
- Used for international royalty tracking

## Other Identifiers

### IPI (Interested Party Information)
Unique number for songwriters and publishers.

### ISRC (International Standard Recording Code)
Identifies specific recordings (not compositions).

### CAE/IPI Name Number
Identifies rights holders in CISAC databases.

## Managing IDs in Tribes

- Enter known IDs during composition registration
- Request ISWC assignment through the platform
- Link ISRCs to associated compositions`
  },
  "catalog-metadata": {
    slug: "catalog-metadata",
    title: "Catalog Metadata Best Practices",
    category: "catalog-management",
    updatedAt: "2025-01-05",
    relatedArticles: ["register-compositions", "bulk-import-csv"],
    content: `Optimize your catalog data for accurate royalty collection.

## Essential Metadata

Ensure every composition has:
- Accurate work title
- All songwriter names spelled correctly
- Valid IPI numbers
- Correct ownership percentages

## Title Formatting

Best practices:
- Use title case (capitalize major words)
- Include featured artist in parentheses if applicable
- List alternate titles for remixes and versions
- Avoid special characters when possible

## Songwriter Information

For each songwriter:
- Full legal name (as registered with PRO)
- Valid IPI number
- PRO affiliation
- Role (Composer, Lyricist, Arranger)

## Regular Audits

We recommend quarterly catalog audits to:
- Verify ownership percentages
- Update contact information
- Add missing identifiers
- Remove duplicate entries`
  },
  "territory-rights": {
    slug: "territory-rights",
    title: "Territory Rights Configuration",
    category: "catalog-management",
    updatedAt: "2025-01-03",
    relatedArticles: ["register-compositions", "create-contracts"],
    content: `Manage territorial restrictions for your compositions.

## Default Territory Settings

By default, compositions are registered for worldwide rights. You can restrict territories if:
- Rights vary by region
- Sub-publishing deals exist
- Certain territories are excluded

## Configuring Territories

1. Open the composition detail page
2. Go to Settings > Territories
3. Choose territory mode:
   - Worldwide (default)
   - Include specific territories
   - Exclude specific territories
4. Select relevant countries/regions
5. Save changes

## Territory Groups

Common groupings available:
- North America
- European Union
- Asia Pacific
- Latin America
- CISAC member countries`
  },
  "royalty-statements": {
    slug: "royalty-statements",
    title: "Understanding Royalty Statements",
    category: "royalties-payments",
    updatedAt: "2025-01-15",
    relatedArticles: ["payment-schedules", "earnings-reports"],
    content: `Learn how to read and interpret your royalty statements.

## Statement Overview

Each statement includes:
- Statement period (quarter/month)
- Total earnings
- Breakdown by income type
- Detailed line items
- Currency and exchange rates

## Income Types

### Performance Royalties
Earnings from public performances, broadcasts, and streaming.

### Mechanical Royalties
Earnings from reproductions (physical sales, downloads, streaming).

### Sync Royalties
Earnings from synchronization licenses (film, TV, ads).

## Viewing Statements

1. Go to Royalties > Statements
2. Select the statement period
3. View summary or detailed breakdown
4. Download PDF or Excel format`
  },
  "payment-schedules": {
    slug: "payment-schedules",
    title: "Payment Schedules and Thresholds",
    category: "royalties-payments",
    updatedAt: "2025-01-12",
    relatedArticles: ["royalty-statements", "payment-methods"],
    content: `Understand when and how payments are processed.

## Payment Schedule

Tribes processes payments:
- Monthly (for balances over threshold)
- 45 days after statement period ends
- Minimum threshold: $25

## Threshold Settings

Configure your payment threshold:
1. Go to Settings > Payments
2. Set your minimum payout amount
3. Choose automatic or manual payouts

## Payment Timeline

1. **Statement period ends** - Last day of quarter
2. **Processing** - 15 days to process statements
3. **Payment initiation** - Day 45
4. **Funds received** - 3-7 business days depending on method`
  },
  "tax-documentation": {
    slug: "tax-documentation",
    title: "Tax Documentation (W-9, W-8BEN)",
    category: "royalties-payments",
    updatedAt: "2025-01-10",
    relatedArticles: ["payment-methods", "international-payments"],
    content: `Complete required tax documentation to receive payments.

## US Persons

If you're a US citizen or resident:
- Complete form W-9
- Provide SSN or EIN
- Submit electronically through Settings

## Non-US Persons

If you're not a US person:
- Complete form W-8BEN (individuals)
- Complete form W-8BEN-E (entities)
- Claim treaty benefits if applicable

## Completing Forms

1. Go to Settings > Tax Documents
2. Select the appropriate form
3. Fill in required fields
4. Sign electronically
5. Submit for processing

## Annual Updates

Tax forms may need to be updated:
- Every 3 years (W-8 forms expire)
- When personal information changes
- When tax status changes`
  },
  "international-payments": {
    slug: "international-payments",
    title: "International Payments and Currency",
    category: "royalties-payments",
    updatedAt: "2025-01-08",
    relatedArticles: ["payment-methods", "tax-documentation"],
    content: `Receive payments in your local currency from anywhere in the world.

## Supported Currencies

Tribes supports payments in:
- USD (United States Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- And 20+ more

## Exchange Rates

- Rates are set at time of payment
- We use mid-market rates
- No hidden currency conversion fees

## International Wire Transfers

For wire transfers:
- Provide SWIFT/BIC code
- Include IBAN (where applicable)
- Allow 5-7 business days for receipt
- Bank fees may apply at your bank`
  },
  "payment-methods": {
    slug: "payment-methods",
    title: "Supported Payment Methods",
    category: "royalties-payments",
    updatedAt: "2025-01-05",
    relatedArticles: ["setup-payment-methods", "international-payments"],
    content: `Choose how you receive your royalty payments.

## Available Methods

### ACH Transfer (US Only)
- Free transfers
- 3-5 business day processing
- Requires US bank account

### Wire Transfer
- Available worldwide
- 5-7 business day processing
- May incur bank fees

### PayPal
- Available in supported countries
- Near-instant receipt
- Small percentage fee may apply

## Adding a Method

1. Go to Settings > Payment Methods
2. Click "Add New"
3. Select method type
4. Enter account details
5. Verify if required`
  },
  "royalty-disputes": {
    slug: "royalty-disputes",
    title: "Handling Royalty Disputes",
    category: "royalties-payments",
    updatedAt: "2025-01-03",
    relatedArticles: ["royalty-statements", "split-sheets"],
    content: `Resolve discrepancies in royalty calculations or payments.

## Common Dispute Types

- Missing royalties from specific sources
- Incorrect ownership percentages applied
- Currency conversion discrepancies
- Duplicate payments or deductions

## Filing a Dispute

1. Go to Royalties > Disputes
2. Click "New Dispute"
3. Select the affected statement(s)
4. Describe the issue in detail
5. Attach supporting documentation
6. Submit for review

## Resolution Process

1. **Initial Review** - 2-3 business days
2. **Investigation** - Up to 30 days
3. **Resolution** - Adjustment applied or explanation provided
4. **Appeal** - If unsatisfied, request escalation`
  },
  "create-contracts": {
    slug: "create-contracts",
    title: "Creating Contracts",
    category: "contracts-splits",
    updatedAt: "2025-01-14",
    relatedArticles: ["split-sheets", "amending-agreements"],
    content: `Create and manage publishing agreements within Tribes.

## Contract Types

- Single-song agreements
- Exclusive songwriter agreements
- Co-publishing deals
- Administration agreements
- Sub-publishing agreements

## Creating a Contract

1. Go to Contracts > New Contract
2. Select contract type
3. Choose a template or start blank
4. Fill in party information
5. Define terms and territories
6. Add compositions (if applicable)
7. Set up payment terms
8. Review and finalize

## Electronic Signatures

Contracts can be signed electronically:
- All parties receive email invitations
- Sign from any device
- Legally binding in most jurisdictions
- Audit trail for compliance`
  },
  "split-sheets": {
    slug: "split-sheets",
    title: "Understanding Split Sheets",
    category: "contracts-splits",
    updatedAt: "2025-01-12",
    relatedArticles: ["manage-songwriter-splits", "create-contracts"],
    content: `Learn about split sheets and their importance in music publishing.

## What is a Split Sheet?

A split sheet documents:
- All contributors to a composition
- Their ownership percentages
- Their roles (writer, composer, etc.)
- PRO affiliations
- Publisher information

## Why They Matter

Split sheets are essential for:
- Accurate royalty distribution
- PRO registrations
- Copyright documentation
- Dispute prevention

## Creating Split Sheets in Tribes

1. Navigate to a composition
2. Click "Generate Split Sheet"
3. Verify all contributor information
4. Download PDF for signatures
5. Upload signed version for records

## Best Practices

- Create before leaving the studio
- Get all signatures immediately
- Keep copies in multiple locations
- Update if ownership changes`
  },
  "amending-agreements": {
    slug: "amending-agreements",
    title: "Amending Existing Agreements",
    category: "contracts-splits",
    updatedAt: "2025-01-10",
    relatedArticles: ["create-contracts", "split-sheets"],
    content: `Modify existing contracts when terms need to change.

## When to Amend

Consider amendments for:
- Ownership percentage changes
- Territory modifications
- Term extensions
- Adding new compositions
- Correcting errors

## Amendment Process

1. Open the original contract
2. Click "Create Amendment"
3. Specify changes needed
4. Reference original agreement
5. All parties must sign

## Amendment Types

### Addendum
Adds new terms without changing existing ones.

### Modification
Changes specific existing terms.

### Assignment
Transfers rights to a new party.`
  },
  "controlled-compositions": {
    slug: "controlled-compositions",
    title: "Controlled Composition Clauses",
    category: "contracts-splits",
    updatedAt: "2025-01-08",
    relatedArticles: ["create-contracts", "co-publishing"],
    content: `Understand controlled composition clauses in recording contracts.

## What Are They?

Controlled composition clauses limit mechanical royalties paid for songs written or controlled by the recording artist.

## Common Terms

- 75% of statutory rate
- 10-song cap per album
- Free goods provisions
- Sample clearance offsets

## Impact on Writers

These clauses can significantly reduce income from:
- Album sales
- Digital downloads
- Streams (in some cases)

## Tracking in Tribes

- Flag affected compositions
- Track reduced-rate payments
- Compare to full statutory rate
- Report on controlled composition impact`
  },
  "co-publishing": {
    slug: "co-publishing",
    title: "Co-Publishing Agreements",
    category: "contracts-splits",
    updatedAt: "2025-01-05",
    relatedArticles: ["create-contracts", "controlled-compositions"],
    content: `Learn about co-publishing deals and how they work.

## Structure

In a typical co-pub deal:
- Publisher acquires 50% of the writer's publisher share
- Writer retains 100% of writer's share
- Writer retains 50% of publisher's share
- Net to writer: 75% of total royalties

## Benefits

For writers:
- Higher income percentage
- Publishing expertise and pitching
- Administration handled
- Advance payments

For publishers:
- Lower acquisition cost
- Writer incentive alignment
- Shared risk

## Setting Up in Tribes

1. Create co-publishing contract
2. Define ownership split
3. Assign affected compositions
4. Configure royalty distribution
5. Track co-pub income separately`
  },
  "dashboard-overview": {
    slug: "dashboard-overview",
    title: "Dashboard Overview",
    category: "analytics-reports",
    updatedAt: "2025-01-15",
    relatedArticles: ["understanding-dashboard", "earnings-reports"],
    content: `Get the most from your Tribes analytics dashboard.

## Dashboard Sections

### Revenue Overview
- Total earnings (current period)
- Comparison to previous periods
- Growth percentage
- Top performing works

### Activity Feed
- Recent royalty statements
- Contract updates
- Team actions
- System notifications

### Quick Stats
- Total compositions
- Active contracts
- Pending payments
- Team members

## Filtering Options

Customize your view:
- Date range selection
- Filter by income type
- Filter by territory
- Filter by composition/project`
  },
  "earnings-reports": {
    slug: "earnings-reports",
    title: "Generating Earnings Reports",
    category: "analytics-reports",
    updatedAt: "2025-01-12",
    relatedArticles: ["dashboard-overview", "custom-reports"],
    content: `Create detailed reports on your royalty earnings.

## Report Types

### Summary Report
High-level overview of earnings by period.

### Detailed Report
Line-by-line breakdown of all earnings.

### Comparative Report
Period-over-period comparison.

### Source Report
Breakdown by income source (DSP, PRO, etc.).

## Generating a Report

1. Go to Analytics > Reports
2. Select report type
3. Choose date range
4. Apply filters (optional)
5. Click "Generate"
6. Download as PDF, Excel, or CSV`
  },
  "performance-analytics": {
    slug: "performance-analytics",
    title: "Streaming Performance Analytics",
    category: "analytics-reports",
    updatedAt: "2025-01-10",
    relatedArticles: ["dashboard-overview", "dsp-connections"],
    content: `Track your streaming performance across platforms.

## Available Metrics

- Total streams by platform
- Stream counts by territory
- Revenue per stream
- Growth trends
- Playlist placements

## Connected Platforms

View data from:
- Spotify
- Apple Music
- Amazon Music
- YouTube Music
- And more

## Insights

The analytics system provides:
- Top performing tracks
- Emerging markets
- Seasonal patterns
- Comparison to catalog averages`
  },
  "export-data": {
    slug: "export-data",
    title: "Exporting Data",
    category: "analytics-reports",
    updatedAt: "2025-01-08",
    relatedArticles: ["earnings-reports", "custom-reports"],
    content: `Export your Tribes data for external use.

## Export Options

### Catalog Export
Full catalog data in CSV or Excel format.

### Financial Export
Royalty and payment data for accounting.

### Contract Export
Contract terms and party information.

### Audit Export
Complete activity logs for compliance.

## How to Export

1. Navigate to the relevant section
2. Click the Export button
3. Select format and options
4. Download the file

## Scheduled Exports

Set up automatic exports:
- Daily, weekly, or monthly
- Delivered via email or SFTP
- Custom field selection`
  },
  "custom-reports": {
    slug: "custom-reports",
    title: "Creating Custom Reports",
    category: "analytics-reports",
    updatedAt: "2025-01-05",
    relatedArticles: ["earnings-reports", "export-data"],
    content: `Build reports tailored to your specific needs.

## Report Builder

1. Go to Analytics > Custom Reports
2. Click "New Report"
3. Select data sources
4. Choose columns/metrics
5. Apply filters
6. Set grouping options
7. Save the report

## Saved Reports

- Access from your report library
- Share with team members
- Schedule for automatic generation
- Set up email delivery

## Report Templates

Start from pre-built templates:
- Quarterly earnings summary
- Songwriter royalty breakdown
- Territory performance
- Year-end analysis`
  },
  "invite-users": {
    slug: "invite-users",
    title: "Inviting Team Members",
    category: "team-permissions",
    updatedAt: "2025-01-14",
    relatedArticles: ["user-roles", "permission-levels"],
    content: `Add collaborators to your Tribes organization.

## Invitation Process

1. Go to Settings > Team
2. Click "Invite Member"
3. Enter email address
4. Select role
5. Choose projects to grant access
6. Send invitation

## Invitation Status

Track invitations:
- Pending (sent, not accepted)
- Accepted (account created)
- Expired (7+ days, can resend)
- Declined (user rejected)

## Bulk Invitations

For multiple users:
1. Click "Bulk Invite"
2. Upload CSV with emails and roles
3. Review and confirm
4. Send all invitations`
  },
  "user-roles": {
    slug: "user-roles",
    title: "Understanding User Roles",
    category: "team-permissions",
    updatedAt: "2025-01-12",
    relatedArticles: ["invite-users", "permission-levels"],
    content: `Learn about the different roles available in Tribes.

## Role Hierarchy

### Owner
- Full control of organization
- Billing and subscription management
- Can transfer ownership
- Cannot be removed

### Admin
- Full access to features
- Team management
- Cannot access billing
- Cannot delete organization

### Manager
- Catalog and contract management
- View financials
- Limited team management
- Cannot change org settings

### Viewer
- Read-only access
- Assigned projects only
- No editing capabilities
- Can download reports

## Changing Roles

1. Go to Settings > Team
2. Find the team member
3. Click their current role
4. Select new role
5. Confirm the change`
  },
  "permission-levels": {
    slug: "permission-levels",
    title: "Permission Levels Explained",
    category: "team-permissions",
    updatedAt: "2025-01-10",
    relatedArticles: ["user-roles", "remove-team-member"],
    content: `Understand granular permissions within each role.

## Permission Categories

### Catalog
- View compositions
- Edit compositions
- Delete compositions
- Import/export

### Contracts
- View contracts
- Create/edit contracts
- Sign contracts
- Delete contracts

### Financials
- View statements
- Download reports
- Manage payments
- Access analytics

### Team
- View team members
- Invite members
- Change roles
- Remove members

## Custom Permissions

Enterprise plans can customize permissions beyond standard roles.`
  },
  "remove-team-member": {
    slug: "remove-team-member",
    title: "Removing Team Members",
    category: "team-permissions",
    updatedAt: "2025-01-08",
    relatedArticles: ["invite-users", "activity-logs"],
    content: `Safely remove users from your organization.

## Removal Process

1. Go to Settings > Team
2. Find the team member
3. Click "Remove"
4. Confirm the action

## What Happens

When a user is removed:
- Immediate access revocation
- Session terminated
- Owned items reassigned (optional)
- Activity history retained

## Considerations

Before removing:
- Reassign owned items if needed
- Export any personal reports
- Notify the user externally
- Document the reason

## Reactivation

Former members can be re-invited. Their history will be preserved.`
  },
  "activity-logs": {
    slug: "activity-logs",
    title: "Viewing Activity Logs",
    category: "team-permissions",
    updatedAt: "2025-01-05",
    relatedArticles: ["user-roles", "remove-team-member"],
    content: `Monitor all actions taken within your organization.

## Log Contents

Activity logs record:
- User actions (who did what)
- Timestamp (when it happened)
- Details (specifics of the action)
- IP address (where from)

## Viewing Logs

1. Go to Settings > Activity
2. Filter by user, action type, or date
3. Click entries for details
4. Export for external review

## Retention

- Standard: 90 days
- Professional: 1 year
- Enterprise: 3 years + custom

## Security Alerts

Get notified for:
- Failed login attempts
- Permission changes
- Unusual access patterns`
  },
  "dsp-connections": {
    slug: "dsp-connections",
    title: "DSP Connections (Spotify, Apple Music)",
    category: "integrations",
    updatedAt: "2025-01-14",
    relatedArticles: ["performance-analytics", "accounting-integrations"],
    content: `Connect your streaming platforms for enhanced analytics.

## Supported Platforms

- Spotify for Artists
- Apple Music for Artists
- Amazon Music for Artists
- YouTube Studio
- Deezer for Creators

## Connection Process

1. Go to Settings > Integrations
2. Click the platform to connect
3. Authorize Tribes access
4. Select data to sync
5. Confirm connection

## Synced Data

From DSP connections:
- Stream counts
- Listener demographics
- Playlist placements
- Territory breakdown
- Historical trends`
  },
  "accounting-integrations": {
    slug: "accounting-integrations",
    title: "Accounting Software Integrations",
    category: "integrations",
    updatedAt: "2025-01-12",
    relatedArticles: ["dsp-connections", "export-data"],
    content: `Sync financial data with your accounting software.

## Supported Software

- QuickBooks Online
- Xero
- FreshBooks
- Sage Intacct
- NetSuite

## Setup

1. Go to Settings > Integrations
2. Select your accounting software
3. Authorize the connection
4. Map chart of accounts
5. Choose sync frequency

## Synced Data

Automatically sync:
- Royalty income
- Payment records
- Invoices
- Expense categories`
  },
  "pro-society-links": {
    slug: "pro-society-links",
    title: "PRO/Society Linking",
    category: "integrations",
    updatedAt: "2025-01-10",
    relatedArticles: ["iswc-work-ids", "register-compositions"],
    content: `Connect your PRO and collection society accounts.

## Supported Societies

- ASCAP
- BMI
- SESAC
- PRS for Music
- SOCAN
- GEMA
- And 50+ more

## Linking Benefits

- Automatic work registration
- Statement reconciliation
- Faster royalty matching
- Reduced manual entry

## How to Link

1. Go to Settings > Societies
2. Select your society
3. Enter your member ID
4. Verify ownership
5. Enable sync features`
  },
  "webhook-setup": {
    slug: "webhook-setup",
    title: "Setting Up Webhooks",
    category: "integrations",
    updatedAt: "2025-01-08",
    relatedArticles: ["webhooks-api", "api-getting-started"],
    content: `Receive real-time notifications for events in Tribes.

## What Are Webhooks?

Webhooks send HTTP POST requests to your server when events occur in Tribes.

## Available Events

- statement.received
- payment.sent
- contract.signed
- composition.created
- team.member_added

## Setting Up

1. Go to Settings > Webhooks
2. Click "Add Endpoint"
3. Enter your URL
4. Select events to receive
5. Save and test

## Security

- Verify webhook signatures
- Use HTTPS endpoints
- Implement retry logic
- Monitor for failures`
  },
  "api-getting-started": {
    slug: "api-getting-started",
    title: "API Getting Started",
    category: "api-reference",
    updatedAt: "2025-01-14",
    relatedArticles: ["authentication", "rate-limits"],
    content: `Start integrating with the Tribes API.

## Overview

The Tribes API allows programmatic access to:
- Catalog management
- Royalty data
- Contract information
- Analytics

## Base URL

\`\`\`
https://api.tribesrightsmanagement.com/v1
\`\`\`

## Getting Started

1. Generate API key in Settings > API
2. Include in Authorization header
3. Make your first request
4. Handle responses

## Response Format

All responses are JSON:
\`\`\`json
{
  "data": { ... },
  "meta": { ... }
}
\`\`\``
  },
  "authentication": {
    slug: "authentication",
    title: "Authentication",
    category: "api-reference",
    updatedAt: "2025-01-12",
    relatedArticles: ["api-getting-started", "rate-limits"],
    content: `Authenticate your API requests.

## API Keys

Generate keys in Settings > API:
- Name your key
- Set permissions
- Copy and store securely

## Usage

Include in headers:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Key Types

### Read-Only
Access data without modification.

### Read-Write
Full access to allowed resources.

## Security

- Rotate keys regularly
- Use environment variables
- Never commit keys to code
- Monitor key usage`
  },
  "rate-limits": {
    slug: "rate-limits",
    title: "Rate Limits",
    category: "api-reference",
    updatedAt: "2025-01-10",
    relatedArticles: ["api-getting-started", "authentication"],
    content: `Understand API rate limits and quotas.

## Limits by Plan

- Starter: 100 requests/minute
- Professional: 500 requests/minute
- Enterprise: 2000 requests/minute

## Headers

Responses include:
\`\`\`
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 499
X-RateLimit-Reset: 1640000000
\`\`\`

## Handling Limits

When exceeded:
- 429 Too Many Requests response
- Wait until reset time
- Implement exponential backoff

## Best Practices

- Cache responses when possible
- Batch requests where supported
- Use webhooks instead of polling`
  },
  "catalog-endpoints": {
    slug: "catalog-endpoints",
    title: "Catalog Endpoints",
    category: "api-reference",
    updatedAt: "2025-01-08",
    relatedArticles: ["api-getting-started", "royalty-endpoints"],
    content: `API endpoints for catalog management.

## Endpoints

### List Compositions
\`\`\`
GET /v1/compositions
\`\`\`

### Get Composition
\`\`\`
GET /v1/compositions/{id}
\`\`\`

### Create Composition
\`\`\`
POST /v1/compositions
\`\`\`

### Update Composition
\`\`\`
PUT /v1/compositions/{id}
\`\`\`

### Delete Composition
\`\`\`
DELETE /v1/compositions/{id}
\`\`\`

## Query Parameters

- \`page\` - Page number
- \`per_page\` - Items per page (max 100)
- \`search\` - Search by title
- \`sort\` - Sort field and direction`
  },
  "royalty-endpoints": {
    slug: "royalty-endpoints",
    title: "Royalty Endpoints",
    category: "api-reference",
    updatedAt: "2025-01-05",
    relatedArticles: ["catalog-endpoints", "webhooks-api"],
    content: `API endpoints for royalty data access.

## Endpoints

### List Statements
\`\`\`
GET /v1/statements
\`\`\`

### Get Statement
\`\`\`
GET /v1/statements/{id}
\`\`\`

### Get Statement Lines
\`\`\`
GET /v1/statements/{id}/lines
\`\`\`

### Get Earnings Summary
\`\`\`
GET /v1/earnings/summary
\`\`\`

## Filtering

- \`period\` - Statement period (YYYY-QQ)
- \`source\` - Income source
- \`territory\` - Territory code
- \`composition_id\` - Specific work`
  },
  "webhooks-api": {
    slug: "webhooks-api",
    title: "Webhooks API",
    category: "api-reference",
    updatedAt: "2025-01-03",
    relatedArticles: ["webhook-setup", "api-getting-started"],
    content: `Programmatically manage webhook subscriptions.

## Endpoints

### List Webhooks
\`\`\`
GET /v1/webhooks
\`\`\`

### Create Webhook
\`\`\`
POST /v1/webhooks
\`\`\`

### Update Webhook
\`\`\`
PUT /v1/webhooks/{id}
\`\`\`

### Delete Webhook
\`\`\`
DELETE /v1/webhooks/{id}
\`\`\`

## Payload Example

\`\`\`json
{
  "id": "evt_123",
  "type": "statement.received",
  "data": { ... },
  "created_at": "2025-01-01T00:00:00Z"
}
\`\`\`

## Signature Verification

Verify using the signature header:
\`\`\`
X-Tribes-Signature: sha256=...
\`\`\``
  }
};

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles[slug];
}

export function getArticlesByCategoryId(categoryId: string): HelpArticle[] {
  return Object.values(helpArticles).filter(article => article.category === categoryId);
}

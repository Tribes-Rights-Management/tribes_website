import type { HelpCategory } from "@/types/helpCenter";

export const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: "CheckCircle",
    description: "Learn the basics of Tribes Rights Management",
    articles: [
      { slug: "welcome-to-tribes", title: "Welcome to Tribes Rights Management" },
      { slug: "create-first-project", title: "How to Create Your First Project" },
      { slug: "understanding-dashboard", title: "Understanding Your Dashboard" },
      { slug: "add-first-catalog", title: "Adding Your First Catalog" },
      { slug: "invite-team-members", title: "Inviting Team Members" },
      { slug: "setup-payment-methods", title: "Setting Up Payment Methods" }
    ]
  },
  {
    id: "account-setup",
    name: "Account Setup",
    icon: "UserPlus",
    description: "Configure your account and organization settings",
    articles: [
      { slug: "account-verification", title: "Account Verification Process" },
      { slug: "organization-settings", title: "Organization Settings" },
      { slug: "two-factor-auth", title: "Setting Up Two-Factor Authentication" },
      { slug: "notification-preferences", title: "Notification Preferences" }
    ]
  },
  {
    id: "catalog-management",
    name: "Catalog Management",
    icon: "Music",
    description: "Manage your music catalog and compositions",
    articles: [
      { slug: "register-compositions", title: "Registering New Compositions" },
      { slug: "bulk-import-csv", title: "Bulk Import via CSV" },
      { slug: "manage-songwriter-splits", title: "Managing Songwriter Splits" },
      { slug: "iswc-work-ids", title: "Understanding ISWC and Work IDs" },
      { slug: "catalog-metadata", title: "Catalog Metadata Best Practices" },
      { slug: "territory-rights", title: "Territory Rights Configuration" }
    ]
  },
  {
    id: "royalties-payments",
    name: "Royalties & Payments",
    icon: "CreditCard",
    description: "Understand royalty collection and payment processes",
    articles: [
      { slug: "royalty-statements", title: "Understanding Royalty Statements" },
      { slug: "payment-schedules", title: "Payment Schedules and Thresholds" },
      { slug: "tax-documentation", title: "Tax Documentation (W-9, W-8BEN)" },
      { slug: "international-payments", title: "International Payments and Currency" },
      { slug: "payment-methods", title: "Supported Payment Methods" },
      { slug: "royalty-disputes", title: "Handling Royalty Disputes" }
    ]
  },
  {
    id: "contracts-splits",
    name: "Contracts & Splits",
    icon: "FileText",
    description: "Manage agreements and ownership splits",
    articles: [
      { slug: "create-contracts", title: "Creating Contracts" },
      { slug: "split-sheets", title: "Understanding Split Sheets" },
      { slug: "amending-agreements", title: "Amending Existing Agreements" },
      { slug: "controlled-compositions", title: "Controlled Composition Clauses" },
      { slug: "co-publishing", title: "Co-Publishing Agreements" }
    ]
  },
  {
    id: "analytics-reports",
    name: "Analytics & Reports",
    icon: "BarChart3",
    description: "Track performance and generate reports",
    articles: [
      { slug: "dashboard-overview", title: "Dashboard Overview" },
      { slug: "earnings-reports", title: "Generating Earnings Reports" },
      { slug: "performance-analytics", title: "Streaming Performance Analytics" },
      { slug: "export-data", title: "Exporting Data" },
      { slug: "custom-reports", title: "Creating Custom Reports" }
    ]
  },
  {
    id: "team-permissions",
    name: "Team & Permissions",
    icon: "Users",
    description: "Manage team members and access controls",
    articles: [
      { slug: "invite-users", title: "Inviting Team Members" },
      { slug: "user-roles", title: "Understanding User Roles" },
      { slug: "permission-levels", title: "Permission Levels Explained" },
      { slug: "remove-team-member", title: "Removing Team Members" },
      { slug: "activity-logs", title: "Viewing Activity Logs" }
    ]
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: "Settings",
    description: "Connect with third-party services",
    articles: [
      { slug: "dsp-connections", title: "DSP Connections (Spotify, Apple Music)" },
      { slug: "accounting-integrations", title: "Accounting Software Integrations" },
      { slug: "pro-society-links", title: "PRO/Society Linking" },
      { slug: "webhook-setup", title: "Setting Up Webhooks" }
    ]
  },
  {
    id: "api-reference",
    name: "API Reference",
    icon: "Code",
    description: "Developer documentation and API guides",
    articles: [
      { slug: "api-getting-started", title: "API Getting Started" },
      { slug: "authentication", title: "Authentication" },
      { slug: "rate-limits", title: "Rate Limits" },
      { slug: "catalog-endpoints", title: "Catalog Endpoints" },
      { slug: "royalty-endpoints", title: "Royalty Endpoints" },
      { slug: "webhooks-api", title: "Webhooks API" }
    ]
  }
];

export function getCategoryById(id: string): HelpCategory | undefined {
  return helpCategories.find(cat => cat.id === id);
}

export function getAllArticles() {
  return helpCategories.flatMap(cat =>
    cat.articles.map(article => ({
      ...article,
      categoryId: cat.id,
      categoryName: cat.name
    }))
  );
}

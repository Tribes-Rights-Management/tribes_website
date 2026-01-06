import { DashboardLayout } from "@/components/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>

        <div className="py-16">
          <p className="text-sm text-muted-foreground">
            No settings available yet.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

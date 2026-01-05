import { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="container py-6 md:py-8 flex-1">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

import { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";

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
      <Footer variant="app" />
    </div>
  );
}

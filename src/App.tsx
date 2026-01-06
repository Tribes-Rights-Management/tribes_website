import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import PortalDashboard from "./pages/PortalDashboard";
import RequestFormPage from "./pages/RequestFormPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import AgreementHandoffPage from "./pages/AgreementHandoffPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRequestDetailPage from "./pages/AdminRequestDetailPage";
import AdminAccessRequestsPage from "./pages/AdminAccessRequestsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, isLoading, isAnyAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to={isAnyAdmin ? "/admin" : "/portal"} replace /> : <AuthPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Root redirect based on role */}
      <Route path="/" element={
        user 
          ? <Navigate to={isAnyAdmin ? "/admin" : "/portal"} replace />
          : <Navigate to="/auth" replace />
      } />
      
      {/* User Portal Routes */}
      <Route path="/portal" element={<ProtectedRoute><PortalDashboard /></ProtectedRoute>} />
      <Route path="/portal/request/new" element={<ProtectedRoute><RequestFormPage /></ProtectedRoute>} />
      <Route path="/portal/request/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
      <Route path="/portal/request/:id/sign" element={<ProtectedRoute><AgreementHandoffPage /></ProtectedRoute>} />
      <Route path="/portal/request/:id/edit" element={<ProtectedRoute><RequestFormPage /></ProtectedRoute>} />
      
      {/* Legacy routes - redirect to portal */}
      <Route path="/request/new" element={<Navigate to="/portal/request/new" replace />} />
      <Route path="/request/:id" element={<Navigate to="/portal/request/:id" replace />} />
      <Route path="/request/:id/edit" element={<Navigate to="/portal/request/:id/edit" replace />} />
      
      {/* Admin Console Routes */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/access-requests" element={<ProtectedRoute requireAdmin><AdminAccessRequestsPage /></ProtectedRoute>} />
      <Route path="/admin/licenses/:id" element={<ProtectedRoute requireAdmin><AdminRequestDetailPage /></ProtectedRoute>} />
      
      {/* Legacy admin route redirect */}
      <Route path="/admin/request/:id" element={<Navigate to="/admin/licenses/:id" replace />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

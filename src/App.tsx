import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import PreLaunchPage from "./pages/PreLaunchPage";
import MarketingPage from "./pages/MarketingPage";
import ContactPage from "./pages/ContactPage";
import HowLicensingWorksPage from "./pages/HowLicensingWorksPage";
import HowPublishingAdminWorksPage from "./pages/HowPublishingAdminWorksPage";
import LicensingAccountPage from "./pages/LicensingAccountPage";
import OurApproachPage from "./pages/OurApproachPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceInquiryPage from "./pages/ServiceInquiryPage";
import NotFound from "./pages/NotFound";


// Admin pages (protected)
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLicensesPage from "./pages/AdminLicensesPage";
import AdminRequestDetailPage from "./pages/AdminRequestDetailPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminAccessRequestsPage from "./pages/AdminAccessRequestsPage";
import AdminAccessRequestDetailPage from "./pages/AdminAccessRequestDetailPage";
import AdminContactSubmissionsPage from "./pages/AdminContactSubmissionsPage";
import AdminGuidelinesPage from "./pages/AdminGuidelinesPage";
import AdminConductPolicyPage from "./pages/AdminConductPolicyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PreLaunchPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/how-licensing-works" element={<HowLicensingWorksPage />} />
            <Route path="/how-publishing-admin-works" element={<HowPublishingAdminWorksPage />} />
            <Route path="/licensing-account" element={<LicensingAccountPage />} />
            <Route path="/our-approach" element={<OurApproachPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/inquiry" element={<ServiceInquiryPage />} />


            {/* Admin routes (protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/licenses" element={<ProtectedRoute><AdminLicensesPage /></ProtectedRoute>} />
            <Route path="/admin/licenses/:id" element={<ProtectedRoute><AdminRequestDetailPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/access-requests" element={<ProtectedRoute><AdminAccessRequestsPage /></ProtectedRoute>} />
            <Route path="/admin/access-requests/:id" element={<ProtectedRoute><AdminAccessRequestDetailPage /></ProtectedRoute>} />
            <Route path="/admin/contact-submissions" element={<ProtectedRoute><AdminContactSubmissionsPage /></ProtectedRoute>} />
            <Route path="/admin/guidelines" element={<ProtectedRoute><AdminGuidelinesPage /></ProtectedRoute>} />
            <Route path="/admin/conduct-policy" element={<ProtectedRoute><AdminConductPolicyPage /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

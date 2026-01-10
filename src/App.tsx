import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

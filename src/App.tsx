import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import PackagesListPage from "./pages/PackagesListPage";
import PackageDetailPage from "./pages/PackageDetailPage";
import ToursListPage from "./pages/ToursListPage";
import TourDetailPage from "./pages/TourDetailPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import LeadsPage from "./pages/dashboard/LeadsPage";
import CustomersPage from "./pages/dashboard/CustomersPage";
import AgentsPage from "./pages/dashboard/AgentsPage";
import BookingsPage from "./pages/dashboard/BookingsPage";
import ToursPage from "./pages/dashboard/ToursPage";
import DeparturesPage from "./pages/dashboard/DeparturesPage";
import PackagesPage from "./pages/dashboard/PackagesPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CruisesListPage from "./pages/CruisesListPage";
import ContactPage from "./pages/ContactPage";
import FixedDeparturesPage from "./pages/FixedDeparturesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/packages" element={<PackagesListPage />} />
            <Route path="/packages/:slug" element={<PackageDetailPage />} />
            <Route path="/tours" element={<ToursListPage />} />
            <Route path="/tours/:slug" element={<TourDetailPage />} />
            <Route path="/cruises" element={<CruisesListPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/departures" element={<FixedDeparturesPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="agents" element={<AgentsPage />} />
              <Route path="tours" element={<ToursPage />} />
              <Route path="departures" element={<DeparturesPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

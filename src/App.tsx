import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import MyDashboard from "./pages/MyDashboard";
import Impact from "./pages/Impact";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import MaintenanceHealthOverview from "./pages/dashboards/MaintenanceHealthOverview";
import InventoryAndSparesVisibility from "./pages/dashboards/InventoryAndSparesVisibility";
import ComplianceAirworthiness from "./pages/dashboards/ComplianceAirworthiness";
import OpsDispatchReliability from "./pages/dashboards/OpsDispatchReliability";
import FuelEfficiency from "./pages/dashboards/FuelEfficiency";
import FinancialProcurement from "./pages/dashboards/FinancialProcurement";
import CrewDutySnapshot from "./pages/dashboards/CrewDutySnapshot";
import NotFound from "./pages/NotFound";
import KpiSelfTest from "./components/KpiSelfTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KpiSelfTest />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-dashboard" element={<MyDashboard />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboards/maintenance-health-overview" element={<MaintenanceHealthOverview />} />
            <Route path="/dashboards/inventory-spares-visibility" element={<InventoryAndSparesVisibility />} />
            <Route path="/dashboards/compliance-airworthiness" element={<ComplianceAirworthiness />} />
            <Route path="/dashboards/ops-dispatch-reliability" element={<OpsDispatchReliability />} />
            <Route path="/dashboards/fuel-efficiency" element={<FuelEfficiency />} />
            <Route path="/dashboards/financial-procurement" element={<FinancialProcurement />} />
            <Route path="/dashboards/crew-duty-snapshot" element={<CrewDutySnapshot />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

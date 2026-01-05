import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Dashboard from "./pages/Dashboard";
import LearningLibrary from "./pages/LearningLibrary";
import Subjects from "./pages/Subjects";
import Reports from "./pages/Reports";
import DownloadRequests from "./pages/DownloadRequests";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning-library" element={<LearningLibrary />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/download-requests" element={<DownloadRequests />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

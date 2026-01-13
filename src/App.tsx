import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Dashboard from "./pages/Dashboard";
import LearningLibrary from "./pages/LearningLibrary";
import Subjects from "./pages/Subjects";
import Reports from "./pages/Reports";
import DownloadRequests from "./pages/DownloadRequests";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Use HashRouter for Electron (file:// protocol) and BrowserRouter for web
// Always use HashRouter in Electron to avoid routing issues with file:// protocol
const isElectron = typeof window !== 'undefined' && (
  window.location.protocol === 'file:' || 
  navigator.userAgent.toLowerCase().includes('electron')
);
const Router = isElectron ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning-library" element={<LearningLibrary />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/download-requests" element={<DownloadRequests />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

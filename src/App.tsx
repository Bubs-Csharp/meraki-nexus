import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerFinancials from "./pages/owner/OwnerFinancials";
import OwnerDocuments from "./pages/owner/OwnerDocuments";
import OwnerCommunications from "./pages/owner/OwnerCommunications";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerClients from "./pages/manager/ManagerClients";
import ManagerOperations from "./pages/manager/ManagerOperations";
import RunnerDashboard from "./pages/runner/RunnerDashboard";
import RunnerInspections from "./pages/runner/RunnerInspections";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Smart router that redirects to role-specific dashboard
const SmartDashboardRouter = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on role
  switch (role) {
    case "property_owner":
      return <Navigate to="/owner/dashboard" replace />;
    case "property_manager":
      return <Navigate to="/manager/dashboard" replace />;
    case "property_runner":
      return <Navigate to="/runner/dashboard" replace />;
    case "super_admin":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Root route - smart redirect based on role */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SmartDashboardRouter />
              </ProtectedRoute>
            }
          />
          
          {/* Property Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["property_owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/properties"
            element={
              <ProtectedRoute allowedRoles={["property_owner"]}>
                <OwnerProperties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/financials"
            element={
              <ProtectedRoute allowedRoles={["property_owner"]}>
                <OwnerFinancials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/documents"
            element={
              <ProtectedRoute allowedRoles={["property_owner"]}>
                <OwnerDocuments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/communications"
            element={
              <ProtectedRoute allowedRoles={["property_owner"]}>
                <OwnerCommunications />
              </ProtectedRoute>
            }
          />
          
          {/* Property Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["property_manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/clients"
            element={
              <ProtectedRoute allowedRoles={["property_manager"]}>
                <ManagerClients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/operations"
            element={
              <ProtectedRoute allowedRoles={["property_manager"]}>
                <ManagerOperations />
              </ProtectedRoute>
            }
          />
          
          {/* Property Runner Routes */}
          <Route
            path="/runner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["property_runner"]}>
                <RunnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/runner/inspections"
            element={
              <ProtectedRoute allowedRoles={["property_runner"]}>
                <RunnerInspections />
              </ProtectedRoute>
            }
          />
          
          {/* Super Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Legacy Dashboard - redirect to role-specific */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

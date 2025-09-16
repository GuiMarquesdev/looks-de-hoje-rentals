import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "./contexts/AdminContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PiecesManagement from "./pages/admin/PiecesManagement";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import Settings from "./pages/admin/Settings";
import HeroManagement from "./pages/admin/HeroManagement";
import AdminLayout from "./components/admin/AdminLayout";
import { useAdmin } from "./contexts/AdminContext";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAdmin();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/pieces" 
              element={
                <ProtectedAdminRoute>
                  <PiecesManagement />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedAdminRoute>
                  <CategoriesManagement />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedAdminRoute>
                  <Settings />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin/hero" 
              element={
                <ProtectedAdminRoute>
                  <HeroManagement />
                </ProtectedAdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

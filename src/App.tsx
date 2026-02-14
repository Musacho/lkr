import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Marks from "./pages/Marks";
import Reports from "./pages/Reports";
import Subjects from "./pages/Subjects";
import Teachers from "./pages/Teachers";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
              <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
              <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

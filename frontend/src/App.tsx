import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Index } from "./pages/Index";
import { Network } from "./pages/Network";
import { Legal } from "./pages/Legal";
import { NotFound } from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
/* import { Dashboard } from "./pages/Dashboard";*/

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/network" element={<Network />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

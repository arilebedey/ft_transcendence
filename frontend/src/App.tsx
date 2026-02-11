/* import { Toaster } from "@/components/ui/toaster"; *//* 
import { Toaster as Sonner } from "@/components/ui/sonner"; */
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
/* import { LanguageProvider } from "@/contexts/LanguageContext" */;
import { Index } from "./pages/Index";
import { Network } from "./pages/Network";
/* import { Legal } from "./pages/Legal"; */
import { NotFound } from "./pages/NotFound";
import { BottomNav } from "./components/BottomNav";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
// A ajouter sur ce sprint
/* import { Welcome } from "./page/Welcome"; */
/* import { Dashboard } from "./pages/Dashboard";*/

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Modifier la route de base redirige vers le
            * login/signup sauf si le client est deja connecte*/}
            {/* <Route path="/" element={<Welcome />} /> */}
            {/* Legacy page d acceuil redirection une fois login */}
            <Route path="/" element={<Index />} />
            <Route path="/network" element={<Network />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

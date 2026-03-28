import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NotFound } from "@/pages/NotFound";
import { BottomNav } from "@/components/BottomNav";
import { Profile } from "@/pages/Profile";
import { GreetPage } from "@/pages/GreetPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Legal } from "@/pages/Legal";
import { Dashboard } from "@/pages/Dashboard";
import { Messages } from "@/pages/Messages";
import { PublicApi } from "@/pages/PublicApi";
import { Logout } from "./pages/Logout";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContentWithNav />
    </BrowserRouter>
  </QueryClientProvider>
);

function AppContentWithNav() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<GreetPage />} />
        <Route path="/logging-out" element={<Logout />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username?"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/public-api"
          element={
            <ProtectedRoute>
              <PublicApi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/legal"
          element={
            <ProtectedRoute>
              <Legal />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {location.pathname !== "/" && location.pathname !== "/logging-out" && (
        <BottomNav />
      )}
    </div>
  );
}

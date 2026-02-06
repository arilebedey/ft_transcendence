import { Home, Users, Bell, MessageCircle, User, Scale } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Profiler } from "react";

const navItems = [
  { icon: Home, labelKey: "nav.home", path: "/" },
  { icon: Users, labelKey: "nav.network", path: "/network" },
  // { icon: Profiler, labelKey: "nav.profile", path: "/profZile" },
  // { icon: Bell, labelKey: "nav.notifications", path: "/notifications" },
  { icon: MessageCircle, labelKey: "nav.messages", path: "/messages" },
  // { icon: Scale, labelKey: "page.legal", path: "/legal" },
];

export function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "animate-pulse-glow")} />
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

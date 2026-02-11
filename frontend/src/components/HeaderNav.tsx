import React from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
/* import { useLanguage } from "@/contexts/LanguageContext"; */

export function HeaderNav() {
/*   const { t } = useLanguage(); */

  const navItems = [
    { icon: Bell, labelKey: "nav.notifications", path: "/notifications" }, 
  ];

  return (
    <div className="flex items-center gap-1">
      {navItems.map((it, i) => {
        const Icon = it.icon;
        return (
          <Link key={i} to={it.path} className="p-2 rounded-md hover:bg-accent" /* aria-label={t ? t(it.labelKey) : it.labelKey} */>
            <Icon className="w-5 h-5" />
{/*             <span className="sr-only">{t ? t(it.labelKey) : it.labelKey}</span> */}
          </Link>
        );
      })}
    </div>
  );
}


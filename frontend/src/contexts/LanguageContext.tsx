import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "fr";

type Translations = {
  [key: string]: {
    en: string;
    fr: string;
  };
};

const translations: Translations = {
  // Navigation
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.network": { en: "Network", fr: "Réseau" },
  "nav.notifications": { en: "Notifications", fr: "Notifications" },
  "nav.messages": { en: "Messages", fr: "Messages" },
  "nav.profile": { en: "Profile", fr: "Profil" },
  
  // Header
  "search.placeholder": { en: "Search", fr: "Rechercher" },
  
  // Pages
  "page.home": { en: "Home", fr: "Accueil" },
  "page.network": { en: "Network", fr: "Réseau" },
  "page.legal": { en: "Legal", fr: "Mentions légales" },
  "page.notFound": { en: "Page not found", fr: "Page non trouvée" },
  "page.notFound.description": { en: "Sorry, we couldn't find the page you're looking for.", fr: "Désolé, nous n'avons pas trouvé la page que vous recherchez." },
  "page.notFound.goHome": { en: "Go back home", fr: "Retour à l'accueil" },
  
  // Network
  "network.trending": { en: "Trending Now", fr: "Tendances" },
  "network.friends": { en: "Friends", fr: "Amis" },
  "network.posts": { en: "posts", fr: "publications" },
  "network.online": { en: "online", fr: "en ligne" },
  "network.offline": { en: "offline", fr: "hors ligne" },
  
  // Legal
  "legal.terms": { en: "Terms of Service", fr: "Conditions d'utilisation" },
  "legal.privacy": { en: "Privacy Policy", fr: "Politique de confidentialité" },
  "legal.about": { en: "About", fr: "À propos" },
  "legal.copyright": { en: "© 2026 Transcendence. All rights reserved.", fr: "© 2026 Transcendence. Tous droits réservés." },
  "legal.termsContent": { 
    en: "By using Transcendence, you agree to our terms of service. We reserve the right to modify these terms at any time.", 
    fr: "En utilisant Transcendence, vous acceptez nos conditions d'utilisation. Nous nous réservons le droit de modifier ces conditions à tout moment." 
  },
  "legal.privacyContent": { 
    en: "We respect your privacy and are committed to protecting your personal data. We collect only the information necessary to provide our services.", 
    fr: "Nous respectons votre vie privée et nous engageons à protéger vos données personnelles. Nous ne collectons que les informations nécessaires à nos services." 
  },
  "legal.aboutContent": { 
    en: "Transcendence is a social network designed to connect people and share ideas in a modern, intuitive environment.", 
    fr: "Transcendence est un réseau social conçu pour connecter les gens et partager des idées dans un environnement moderne et intuitif." 
  },
  // Language toggle
  "language.french": { en: "French", fr: "Français" },
  "language.english": { en: "English", fr: "Anglais" },
  "language.switchToFrench": { en: "Switch to French", fr: "Passer en français" },
  "language.switchToEnglish": { en: "Switch to English", fr: "Passer en anglais" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as Language;
      if (stored) return stored;
      const browserLang = navigator.language.split("-")[0];
      return browserLang === "fr" ? "fr" : "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

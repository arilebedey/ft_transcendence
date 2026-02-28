/**
 * @component Layout
 * Wrapper principal pour les pages. Fournit structure standard:
 * - Header en haut (navigation, branding)
 * - Main content au centre
 * - Padding inférieur pour éviter overlap avec BottomNav (mobile)
 *
 * @props
 * - children: ReactNode - Contenu de la page
 * - showFooter?: boolean - (Non utilisé actuellement) Future: afficher footer
 */

import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showSearchBar?: boolean;
  showUserSessionButton?: boolean;
  showLanguageToggle?: boolean;
  showThemeToggle?: boolean;
  showPostCreationButton?: boolean;
  onPostCreationClick?: () => void;
}

export function Layout({
  children,
  showSearchBar,
  showUserSessionButton,
  showLanguageToggle,
  showThemeToggle,
  showPostCreationButton,
  onPostCreationClick, }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        showSearchBar={showSearchBar}
        showUserSessionButton={showUserSessionButton}
        showLanguageToggle={showLanguageToggle}
        showThemeToggle={showThemeToggle}
        showPostCreationButton={showPostCreationButton}
        onPostCreationClick={onPostCreationClick}
      />

      <main className="flex-1 pb-20">{children}</main>
    </div>
  );
}

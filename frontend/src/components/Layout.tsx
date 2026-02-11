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
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-20">
        {children}
      </main>
    </div>
  );
}

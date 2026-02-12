/**
 * @component ListCard
 * Composant wrapper générique pour afficher une liste dans une Card.
 * Utilisé par FriendsList, TrendingList, etc.
 * 
 * @props
 * - title: string - Titre de la card
 * - icon?: ReactNode - Icône à afficher avant le titre
 * - children: ReactNode - Contenu (généralement Liste d'items)
 * - className?: string - Classes CSS additionnelles
 */

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ListCard({ title, icon, children, className }: ListCardProps) {
  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {children}
      </CardContent>
    </Card>
  );
}

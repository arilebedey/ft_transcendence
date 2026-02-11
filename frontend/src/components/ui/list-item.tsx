/**
 * @component ListItem
 * Item générique pour une liste (amis, tendances, etc.)
 * Peut intégrer avatar, nom, sous-titre, action (bouton).
 * 
 * @props
 * - avatar?: ReactNode - Composant Avatar
 * - primary: string - Titre/nom principal
 * - secondary?: string - Sous-titre (optionnel)
 * - action?: ReactNode - Bouton d'action à droite (optionnel)
 * - badge?: ReactNode - Badge de statut (ex: online/offline)
 * - index?: number - Index pour animation staggered
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListItemProps {
  avatar?: ReactNode;
  primary: string;
  secondary?: string;
  action?: ReactNode;
  badge?: ReactNode;
  index?: number;
  className?: string;
}

export function ListItem({
  avatar,
  primary,
  secondary,
  action,
  badge,
  index = 0,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn("flex items-center gap-3 p-3 rounded-lg card-hover", className)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {avatar && <div className="relative">{avatar}</div>}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{primary}</p>
        {secondary && <p className="text-sm text-muted-foreground truncate">{secondary}</p>}
      </div>
      {badge}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

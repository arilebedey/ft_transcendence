/**
 * @component TrendingList
 * Affiche une liste des hashtags/tendances populaires.
 * 
 * @state
 * - trends: Array<Trend> - Données stub, à remplacer par une requête API
 * 
 * @todo
 * - Connecter à une API pour fetcher les vraies tendances
 * - Implémenter navigation vers recherche de hashtag
 * - Ajouter tri par popularité/nouveauté
 */

import { TrendingUp, Hash } from "lucide-react";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";

// TODO: Remplacer par une requête API réelle
interface Trend {
  tag: string;
  posts: number;
}

const STUB_TRENDS: Trend[] = [
  { tag: "AI", posts: 12500 },
  { tag: "Gaming", posts: 8200 },
  { tag: "Technology", posts: 6100 },
  { tag: "Music", posts: 4800 },
  { tag: "Sports", posts: 3200 },
];

export function TrendingList() {
  const formatPostCount = (count: number): string => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
  };

  const handleTrendClick = (tag: string) => {
    // TODO: Naviguer vers recherche du hashtag
    console.log("Trending clicked:", tag);
  };

  return (
    <ListCard
      title="Trending"
      icon={<TrendingUp className="h-5 w-5 text-primary" />}
    >
      {STUB_TRENDS.map((trend, index) => (
        <ListItem
          key={trend.tag}
          index={index}
          primary={trend.tag}
          secondary={`${formatPostCount(trend.posts)} posts`}
          action={
            <button
              onClick={() => handleTrendClick(trend.tag)}
              className="text-xs text-muted-foreground font-semibold hover:text-primary transition-colors"
            >
              #{index + 1}
            </button>
          }
        />
      ))}
    </ListCard>
  );
}

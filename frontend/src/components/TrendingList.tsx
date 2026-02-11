import { TrendingUp, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
/* import { useLanguage } from "@/contexts/LanguageContext"; */

const trends = [
  { tag: "AI", posts: 12500 },
  { tag: "Gaming", posts: 8200 },
  { tag: "Technology", posts: 6100 },
  { tag: "Music", posts: 4800 },
  { tag: "Sports", posts: 3200 },
];

export function TrendingList() {
/*   const { t } = useLanguage(); */
  
  const formatPosts = (count: number) => {
    const formatted = count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count.toString();
    //return `${formatted} ${t("network.posts")}`;
    return `${formatted}`;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
{/*           {t("network.trending")} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {trends.map((trend, index) => (
          <div
            key={trend.tag}
            className="flex items-center gap-3 p-3 rounded-lg card-hover"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{trend.tag}</p>
              <p className="text-sm text-muted-foreground">{formatPosts(trend.posts)}</p>
            </div>
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

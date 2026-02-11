import { UserPlus, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
/* import { useLanguage } from "@/contexts/LanguageContext"; */

// stubbed friends list for demonstration purposes -> we need to plug the public API to fetch user friends
const friends = [
  { id: 1, name: "Alex Chen", username: "@alexc", avatar: "", status: "online" },
  { id: 2, name: "Sarah Miller", username: "@sarahm", avatar: "", status: "online" },
  { id: 3, name: "Jordan Lee", username: "@jordanl", avatar: "", status: "offline" },
  { id: 4, name: "Emma Wilson", username: "@emmaw", avatar: "", status: "online" },
  { id: 5, name: "Mike Brown", username: "@mikeb", avatar: "", status: "offline" },
];

export function FriendsList() {
/*   const { t } = useLanguage(); */
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-primary" />
{/*           {t("network.friends")} */}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {friends.map((friend, index) => (
          <div
            key={friend.id}
            className="flex items-center gap-3 p-3 rounded-lg card-hover"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {friend.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                  friend.status === "online" ? "bg-success" : "bg-muted"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{friend.name}</p>
              <p className="text-sm text-muted-foreground truncate">{friend.username}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

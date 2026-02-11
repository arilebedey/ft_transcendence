/**
 * @component FriendsList
 * Affiche une liste de friends avec statut online/offline et action message.
 * 
 * @state
 * - friends: Array<Friend> - Données stub, à remplacer par une requête API
 * 
 * @todo
 * - Connecter à une API pour fetcher les vrais friends de l'utilisateur
 * - Ajouter capacité de recherche/filtre
 * - Implémenter la navigation vers chat pour un ami
 */

import { UserPlus, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/ui/list-card";
import { ListItem } from "@/components/ui/list-item";

// TODO: Remplacer par une requête API réelle
interface Friend {
  id: number;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "offline";
}

const STUB_FRIENDS: Friend[] = [
  { id: 1, name: "Alex Chen", username: "@alexc", avatar: "", status: "online" },
  { id: 2, name: "Sarah Miller", username: "@sarahm", avatar: "", status: "online" },
  { id: 3, name: "Jordan Lee", username: "@jordanl", avatar: "", status: "offline" },
  { id: 4, name: "Emma Wilson", username: "@emmaw", avatar: "", status: "online" },
  { id: 5, name: "Mike Brown", username: "@mikeb", avatar: "", status: "offline" },
];

export function FriendsList() {
  const handleMessageClick = (friendId: number) => {
    // TODO: Naviguer vers chat ou ouvrir modal de conversation
    console.log("Message friend:", friendId);
  };

  return (
    <ListCard
      title="Friends"
      icon={<UserPlus className="h-5 w-5 text-primary" />}
    >
      {STUB_FRIENDS.map((friend, index) => (
        <ListItem
          key={friend.id}
          index={index}
          avatar={
            <Avatar className="h-10 w-10">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {friend.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          }
          primary={friend.name}
          secondary={friend.username}
          badge={
            <span
              className={`w-3 h-3 rounded-full border-2 border-card ${
                friend.status === "online" ? "bg-success" : "bg-muted"
              }`}
            />
          }
          action={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleMessageClick(friend.id)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          }
        />
      ))}
    </ListCard>
  );
}

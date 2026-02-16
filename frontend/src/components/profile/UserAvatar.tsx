import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
}

export function UserAvatar({ name }: UserAvatarProps) {
  return (
    <Avatar className="h-30 w-30">
      <AvatarFallback className="bg-secondary">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}

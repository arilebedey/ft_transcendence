import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  return (
    <Avatar className={className ?? "h-30 w-30"}>
      {avatarUrl && (
        <AvatarImage
          src={`/storage/${avatarUrl}`}
          alt={name}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-secondary">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}

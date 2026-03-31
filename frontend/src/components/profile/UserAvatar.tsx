import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DEFAULT_AVATAR_SRC = "/default-avatar.png";

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  const avatarSrc = avatarUrl ? `/storage/${avatarUrl}` : DEFAULT_AVATAR_SRC;

  return (
    <Avatar className={className ?? "h-30 w-30"}>
      <AvatarImage src={avatarSrc} alt={name} className="object-cover" />
      <AvatarFallback className="bg-secondary">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}

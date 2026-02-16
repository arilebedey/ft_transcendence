interface UserInfoProps {
  name: string;
  bio: string;
}

export function UserInfo({ name, bio }: UserInfoProps) {
  return (
    <div>
      <p className="font-semibold text-xl">{name || "User"}</p>
      <p className="text-sm text-muted-foreground italic">{bio}</p>
    </div>
  );
}

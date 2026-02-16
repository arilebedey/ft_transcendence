interface UserStatsProps {
  followers: number;
  following: number;
}

export function UserStats({ followers, following }: UserStatsProps) {
  return (
    <div className="grid grid-cols-4 w-full pt-4">
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-lg">{followers}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-lg">{following}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </div>
    </div>
  );
}

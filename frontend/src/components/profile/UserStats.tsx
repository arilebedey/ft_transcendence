import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UserStatsProps {
  followers: number;
  following: number;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
}

export function UserStats({
  followers,
  following,
  onOpenFollowers,
  onOpenFollowing,
}: UserStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 w-full pt-4">
      <div className="col-span-2 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-w-28 flex-col gap-1 rounded-xl px-4 py-3"
          onClick={onOpenFollowers}
        >
          <p className="font-semibold text-lg">{followers}</p>
          <p className="text-sm text-muted-foreground">{t("followers")}</p>
        </Button>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-w-28 flex-col gap-1 rounded-xl px-4 py-3"
          onClick={onOpenFollowing}
        >
          <p className="font-semibold text-lg">{following}</p>
          <p className="text-sm text-muted-foreground">{t("following")}</p>
        </Button>
      </div>
    </div>
  );
}

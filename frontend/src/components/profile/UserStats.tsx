import { useTranslation } from "react-i18next";

interface UserStatsProps {
  followers: number;
  following: number;
}

export function UserStats({ followers, following }: UserStatsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 w-full pt-4">
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-lg">{followers}</p>
          <p className="text-sm text-muted-foreground">{t("followers")}</p>
        </div>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold text-lg">{following}</p>
          <p className="text-sm text-muted-foreground">{t("following")}</p>
        </div>
      </div>
    </div>
  );
}

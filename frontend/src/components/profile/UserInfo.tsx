import { useTranslation } from "react-i18next";

interface UserInfoProps {
  name: string;
  bio: string;
}

export function UserInfo({ name, bio }: UserInfoProps) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-semibold text-xl">{name || t("User")}</p>
      <p className="text-sm text-muted-foreground italic">
        {bio || t("noBio")}
      </p>
    </div>
  );
}

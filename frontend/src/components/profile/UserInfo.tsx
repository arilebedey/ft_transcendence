import { useTranslation } from "react-i18next";
import { PresenceDot } from "@/components/PresenceDot";

interface UserInfoProps {
  name: string;
  bio: string;
  online?: boolean;
}

export function UserInfo({ name, bio, online }: UserInfoProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-xl">{name || t("User")}</p>
        <PresenceDot online={online} />
      </div>
      <p className="text-sm text-muted-foreground italic">
        {bio || t("noBio")}
      </p>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserActionButtonProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onEdit: () => void;
  onEditPreferences: () => void;
  onToggleFollow: () => void;
}

export function UserActionButton({
  isOwnProfile,
  isFollowing,
  onEdit,
  onEditPreferences,
  onToggleFollow,
}: UserActionButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0">
      {isOwnProfile ? (
        <div className="flex gap-2 h-10">
          <Button className="px-5 text-lg" onClick={onEdit}>
            {t("editProfile")}
          </Button>
          <Button className="h-10 w-10 p-2" onClick={onEditPreferences}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={onToggleFollow}
          className="h-12 px-6 text-lg"
          variant={isFollowing ? "outline" : "default"}
        >
          {isFollowing ? t("unfollow") : t("follow")}
        </Button>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface UserActionButtonProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onEdit: () => void;
  onToggleFollow: () => void;
}

export function UserActionButton({
  isOwnProfile,
  isFollowing,
  onEdit,
  onToggleFollow,
}: UserActionButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="shrink-0">
      {isOwnProfile ? (
        <Button className="h-12 px-6 text-lg" onClick={onEdit}>
          {t("editProfile")}
        </Button>
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

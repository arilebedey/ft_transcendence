import { Button } from "@/components/ui/button";
import { Settings, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="w-full shrink-0 sm:w-auto">
      {isOwnProfile ? (
        <div className="flex w-full gap-2 sm:w-auto">
          <Button className="min-w-0 flex-1 px-5 text-base sm:text-lg" onClick={onEdit}>
            {t("editProfile")}
          </Button>
          <Button
            className="h-10 w-10 shrink-0 p-2"
            onClick={() => navigate("/dashboard")}
            title={t("dashboard.title")}
          >
            <BarChart3 className="h-5 w-5" />
          </Button>
          <Button
            onClick={onEditPreferences}
            className="h-10 w-10 shrink-0 p-2"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={onToggleFollow}
          className="h-12 w-full px-6 text-lg sm:w-auto"
          variant={isFollowing ? "outline" : "default"}
        >
          {isFollowing ? t("unfollow") : t("follow")}
        </Button>
      )}
    </div>
  );
}

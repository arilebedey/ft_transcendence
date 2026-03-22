import { Button } from "@/components/ui/button";
import { Settings, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface UserActionButtonProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onEdit: () => void;
  onEditPreferences: () => void;
  onOpenApiDocs: () => void;
  onToggleFollow: () => void;
}

export function UserActionButton({
  isOwnProfile,
  isFollowing,
  onEdit,
  onEditPreferences,
  onOpenApiDocs,
  onToggleFollow,
}: UserActionButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="shrink-0">
      {isOwnProfile ? (
        <div className="flex gap-2 h-10">
          <Button className="px-5 text-lg" onClick={onEdit}>
            {t("editProfile")}
          </Button>
          <Button
            className="px-5 text-lg"
            variant="outline"
            onClick={onOpenApiDocs}
          >
            {t("publicApi.sidebar.title")}
          </Button>
          <Button
            className="h-10 w-10 p-2"
            onClick={() => navigate("/dashboard")}
            title={t("dashboard.title")}
          >
            <BarChart3 className="h-5 w-5" />
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

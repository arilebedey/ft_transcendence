import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MobileModal } from "@/components/ui/MobileModal";
import { DesktopModal } from "@/components/ui/DesktopModal";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import { cn } from "@/lib/utils";
import {
  getFollowers,
  getFollowing,
  type FollowListUser,
} from "@/lib/profile-api";

type FollowListType = "followers" | "following";

interface FollowListModalProps {
  userId: string;
  type: FollowListType;
  onClose: () => void;
}

function FollowListRow({
  user,
  onClick,
}: {
  user: FollowListUser;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={cn("w-full rounded-xl text-left")}>
      <Card className="border-border/70 bg-background/80 transition hover:border-primary/40">
        <CardContent className="flex items-center gap-3 p-4">
          <UserAvatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            className="h-12 w-12"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {user.bio?.trim() || " "}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function FollowListContent({
  type,
  users,
  isPending,
  errorMessage,
  onSelectUser,
}: {
  type: FollowListType;
  users: FollowListUser[] | undefined;
  isPending: boolean;
  errorMessage: string | null;
  onSelectUser: (username: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="space-y-3">
        {isPending ? (
          <p className="text-sm text-muted-foreground">{t("loadingProfile")}</p>
        ) : errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : users && users.length > 0 ? (
          users.map((user) => (
            <FollowListRow
              key={user.id}
              user={user}
              onClick={() => onSelectUser(user.name)}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            {t(
              type === "followers"
                ? "listEmptyFollowers"
                : "listEmptyFollowing",
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export function FollowListModal({
  userId,
  type,
  onClose,
}: FollowListModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobileViewport = useIsMobileViewport(767);

  const { data, isPending, error } = useQuery({
    queryKey: ["profile", userId, type],
    queryFn: () =>
      type === "followers" ? getFollowers(userId) : getFollowing(userId),
  });

  const title = t(type);
  const errorMessage = error instanceof Error ? error.message : null;
  const handleSelectUser = (username: string) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  const body = (
    <FollowListContent
      type={type}
      users={data}
      isPending={isPending}
      errorMessage={errorMessage}
      onSelectUser={handleSelectUser}
    />
  );

  if (isMobileViewport) {
    return <MobileModal onClose={onClose} title={title} body={body} />;
  }

  return (
    <DesktopModal
      onClose={onClose}
      panelClassName="w-[34rem]"
      body={
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          {body}
        </div>
      }
    />
  );
}

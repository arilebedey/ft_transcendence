/**
 * @component PostCard
 * Composant pour afficher un post social (utilisé par HomePage).
 * Affiche auteur, contenu, actions (like, comment, share).
 *
 * @props
 * - author: string - Nom de l'auteur
 * - username: string - @username de l'auteur
 * - avatar?: ReactNode - Avatar de l'auteur (Avatar composant)
 * - content: string - Contenu du post
 * - likes: number - Nombre de likes
 * - comments: number - Nombre de commentaires
 * - time: string - Temps relatif (ex: "2h")
 * - onLike?: () => void - Callback quand like est cliqué
 * - onComment?: () => void - Callback quand comment est cliqué
 * - onShare?: () => void - Callback quand share est cliqué
 * - index?: number - Index pour animation staggered
 */

import { Card, CardContent } from "@/components/ui/card";
import { LikeToggle } from "@/components/LikeToggle";
import { DropDownList } from "@/components/dropdown-list";
import { getProfileById, profileByIdQueryKey } from "@/lib/profile-api";
import { type PublicProfileData } from "@/lib/profile-api";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface Post {
  id: number;
  link: string;
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  author: {
    id: string;
    name: string;
  };
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onDelete?: (postId: number) => void;
  index?: number;
  className?: string;
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onDelete,
  index = 0,
  className,
}: PostCardProps) {
  const formattedTime = new Date(post.createdAt).toLocaleString();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: authorProfile } = useQuery<PublicProfileData>({
    queryKey: profileByIdQueryKey(post.author.id),
    queryFn: () => getProfileById(post.author.id),
  });
  const userName = authorProfile?.name || post.author.name;
  const userAvatar = authorProfile?.avatarUrl;

  return (
    <Card
      className={cn(
        "animate-fade-in card-hover w-full max-w-full min-w-0 overflow-hidden cursor-default",
        className,
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="px-4 pb-3 pt-4 sm:px-6">
        <div className="flex min-w-0 gap-3">
          <div
            className="shrink-0 self-start cursor-pointer"
            onClick={() => navigate(`/profile/${userName}`)}
          >
            <UserAvatar
              name={userName}
              avatarUrl={userAvatar}
              className="w-8 h-8"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className="min-w-0 max-w-full break-words font-semibold cursor-pointer"
                onClick={() => navigate(`/profile/${userName}`)}
              >
                {userName}
              </span>
              <span className="break-words text-sm text-muted-foreground">
                • {formattedTime}
              </span>

              <DropDownList
                currentUserId={currentUserId}
                authorId={post.author.id}
                onDelete={() => onDelete?.(post.id)}
              />
            </div>

            <p className="mt-2 text-foreground leading-relaxed break-words">
              {post.content}
            </p>

            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block max-w-full break-all text-sm text-primary cursor-pointer"
              >
                {post.link}
              </a>
            )}

            <div className="mt-4 flex min-w-0 items-center gap-6">
              <LikeToggle
                likes={post.likes}
                liked={post.liked}
                onToggle={() => onLike && onLike()}
                className="-ml-2 px-2 py-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

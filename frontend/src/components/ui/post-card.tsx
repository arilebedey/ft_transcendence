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
import { Button } from "@/components/ui/button";
import { LikeToggle } from "@/components/LikeToggle";
import { DropDownList } from "@/components/dropdown-list";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Post {
  id: number;
  link: string;
  content: string;
  createdAt: string;
  likes: number;
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
  onComment,
  onShare,
  onDelete,
  index = 0,
  className,
}: PostCardProps) {
  const formattedTime = new Date(post.createdAt).toLocaleString();
  const { t } = useTranslation();

  return (
    <Card
      className={cn("animate-fade-in card-hover", className)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="pt-4">
        <div className="flex gap-3">

          <div className="shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary">
                {post.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{post.author.name}</span>
              <span className="text-muted-foreground text-sm">
                • {formattedTime}
              </span>

              <DropDownList
                currentUserId={currentUserId}
                authorId={post.author.id}
                onDelete={() => onDelete?.(post.id)}
              >
                <button
                  onClick={() => {
                  navigator.clipboard.writeText(post.link);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                {t("CopyLink")}
                </button>
              </DropDownList>
            </div>

            <p className="mt-2 text-foreground leading-relaxed">
              {post.content}
            </p>

            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm mt-2 block"
              >
                {post.link}
              </a>
            )}

            <div className="flex items-center gap-6 mt-4">
              <LikeToggle
                likes={post.likes}
                onToggle={() => onLike && onLike()}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={onComment}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  author: string;
  username: string;
  avatar?: ReactNode;
  content: string;
  likes: number;
  comments: number;
  time: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  index?: number;
  className?: string;
}

export function PostCard({
  author,
  username,
  avatar,
  content,
  likes,
  comments,
  time,
  onLike,
  onComment,
  onShare,
  index = 0,
  className,
}: PostCardProps) {
  return (
    <Card
      className={cn("animate-fade-in card-hover", className)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="pt-4">
        <div className="flex gap-3">
          {avatar && <div className="shrink-0">{avatar}</div>}

          <div className="flex-1 min-w-0">
            {/* Header: author, username, time, menu */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{author}</span>
              <span className="text-muted-foreground text-sm">{username}</span>
              <span className="text-muted-foreground text-sm">• {time}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="mt-2 text-foreground leading-relaxed">{content}</p>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={onLike}
              >
                <Heart className="h-4 w-4" />
                <span>{likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={onComment}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{comments}</span>
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

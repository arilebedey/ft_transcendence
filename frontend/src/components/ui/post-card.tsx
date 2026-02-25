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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  index?: number;
  className?: string;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  index = 0,
  className,
}: PostCardProps) {
  const formattedTime = new Date(post.createdAt).toLocaleString();

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
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{post.author.name}</span>
              <span className="text-muted-foreground text-sm">
                • {formattedTime}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-auto rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="mt-2 text-foreground leading-relaxed">
              {post.content}
            </p>

            {/* Optional link */}
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

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={onLike}
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>

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

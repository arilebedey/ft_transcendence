/**
 * @page Home
 * Page d'accueil affichant un feed de posts sociaux.
 *
 * @state
 * - posts: Array<Post> - Données stub, à remplacer par une requête API paginée
 *
 * @todo
 * - Connecter à une API pour fetcher les posts du feed utilisateur
 * - Implémenter pagination/infinite scroll
 * - Ajouter actions like/comment/share fonctionnelles
 * - Filtrer les posts en fonction du suivi de l'utilisateur
 */

import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PostCard } from "@/components/ui/post-card";
import { useEffect, useState } from "react";

// Small helper to format relative time from ISO timestamp
function timeAgo(iso?: string) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return `${Math.floor(diff / 1000)}s`;
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  return `${Math.floor(diff / day)}d`;
}

interface Post {
  id: number;
  content: string;
  likes: number;
  createdAt?: string;
  userId?: string;
}

const initialPosts: Post[] = [];

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data: Post[]) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleComment = (postId: number) => {
    console.log('Comment post:', postId);
  };

  const handleShare = (postId: number) => {
    console.log('Share post:', postId);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {loading && <div className="text-center text-sm text-muted-foreground">Loading...</div>}
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            index={index}
            author={post.userId ?? 'User'}
            username={`@${(post.userId ?? 'user').slice(0, 8)}`}
            avatar={
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary">
                  {(post.userId ?? 'U')
                    .split('')
                    .slice(0, 2)
                    .join('')}
                </AvatarFallback>
              </Avatar>
            }
            content={post.content}
            likes={post.likes}
            comments={0}
            time={timeAgo(post.createdAt)}
            
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

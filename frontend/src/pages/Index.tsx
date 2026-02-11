/**
 * @page Index (Home)
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

// TODO: Remplacer par une requête API réelle
interface Post {
  id: number;
  author: string;
  username: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
}

const STUB_POSTS: Post[] = [
  {
    id: 1,
    author: "Alex Chen",
    username: "@alexc",
    content:
      "Just shipped a new feature! The team worked incredibly hard on this. Can't wait to see what you all think!",
    likes: 42,
    comments: 8,
    time: "2h",
  },
  {
    id: 2,
    author: "Sarah Miller",
    username: "@sarahm",
    content:
      "Beautiful sunset from the office today. Sometimes you need to stop and appreciate the little things.",
    likes: 128,
    comments: 23,
    time: "4h",
  },
  {
    id: 3,
    author: "Jordan Lee",
    username: "@jordanl",
    content:
      "Reading through some great discussions on AI ethics. The future is going to be interesting. What are your thoughts?",
    likes: 67,
    comments: 31,
    time: "6h",
  },
];

export const Index = () => {
  const handleLike = (postId: number) => {
    // TODO: Implémenter logique de like (optimistic update + API call)
    console.log("Like post:", postId);
  };

  const handleComment = (postId: number) => {
    // TODO: Naviguer vers modal de commentaire ou page détail post
    console.log("Comment post:", postId);
  };

  const handleShare = (postId: number) => {
    // TODO: Implémenter partage (copy link, social share, etc.)
    console.log("Share post:", postId);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {STUB_POSTS.map((post, index) => (
          <PostCard
            key={post.id}
            index={index}
            author={post.author}
            username={post.username}
            avatar={
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            }
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            time={post.time}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

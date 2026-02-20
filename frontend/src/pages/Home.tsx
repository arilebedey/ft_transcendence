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

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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

export const Home = () => {
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const { t } = useTranslation();

  const handleToggleForm = () => setPostFormOpen((prev) => !prev);

  const handleConfirmPost = () => {
    if (!newPostContent) return alert("Le contenu est vide");
    console.log("Post créé :", newPostContent);
    setNewPostContent("");
    setPostFormOpen(false);
  };

  const handleLike = (postId: number) => {
    console.log("Like post:", postId);
  };

  const handleComment = (postId: number) => {
    console.log("Comment post:", postId);
  };

  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
  };

  return (
    <Layout
      showPostCreationButton={true}
      showThemeToggle={false}
      showLanguageToggle={false}
      onPostCreationClick={() => setPostFormOpen(prev => !prev)}
    >
      {postFormOpen && (
        <div className="transition-all duration-300 ease-in-out max-w-2xl mx-auto mt-4">
          <Card>
            <CardHeader></CardHeader>

            <CardContent className="pt-0">
              <textarea
                rows={3}
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 bg-transparent"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </CardContent>

            <CardFooter className="pt-0 justify-end gap-2">
              <Button variant="outline" onClick={() => setPostFormOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleConfirmPost}>{t("Confirm")}</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div
        className={`max-w-2xl mx-auto px-4 py-6 space-y-4 transition-all duration-300 ease-in-out ${
          postFormOpen ? "mt-4" : "mt-0"
        }`}
      >
        {STUB_POSTS.map((post, index) => (
          <PostCard
            key={post.id}
            index={index}
            author={post.author}
            username={post.username}
            avatar={
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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

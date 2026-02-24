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
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PostCard } from "@/components/ui/post-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Post {
  id: number;
  link: string;
  content: string;
  createdAt: string;
  userId: string;
  likes: number;
}

export const Home = () => {
  const MAX_POST_LENGTH = 300;
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/posts");
      if (!res.ok) {
        console.error("Erreur fetch posts");
        return;
      }
  
      const data = await res.json();
      setPosts(data);
    };
  
    fetchPosts();
  }, []);

  const handleToggleForm = () => setPostFormOpen((prev) => !prev);

  const handleConfirmPost = async () => {
    if (!newPostContent) {
      alert("Le contenu est vide");
      return;
    }
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Non authentifié");
      return;
    }
  
    const response = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        link: "https://example.com",
        content: newPostContent,
      }),
    });
  
    if (!response.ok) {
      alert("Erreur création post");
      return;
    }
  
    const createdPost = await response.json();
  
    setPosts((prev) => [createdPost, ...prev]);
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
                maxLength={MAX_POST_LENGTH}
                className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 bg-transparent"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="text-right text-sm text-muted-foreground mt-1">
                {newPostContent.length} / {MAX_POST_LENGTH}
              </div>
            </CardContent>

            <CardFooter className="pt-0 justify-end gap-2">
              <Button variant="outline" onClick={() => setPostFormOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button onClick={handleConfirmPost}>
                {t("Confirm")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div
        className={`max-w-2xl mx-auto px-4 py-6 space-y-4 transition-all duration-300 ease-in-out ${
          postFormOpen ? "mt-4" : "mt-0"
        }`}
      >
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

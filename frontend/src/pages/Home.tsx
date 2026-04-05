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
import { NewPostModal } from "@/components/NewPostModal";
import { PostCard } from "@/components/PostCard";
import { authClient } from "@/lib/auth-client";
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

  export const Home = () => {
    const [postFormOpen, setPostFormOpen] = useState(false);
    const [filter, setFilter] = useState<'recent' | 'oldest' | 'most_liked'>('recent');
    const { t } = useTranslation();
    const sessionResult = authClient.useSession();
    const session = sessionResult?.data;
    const currentUserId = session?.user?.id;
    const [searchQuery, setSearchQuery] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const params = new URLSearchParams();
          params.set("filter", filter);
          if (searchQuery.trim()) params.set("q", searchQuery.trim());
    
          const res = await fetch(`/api/posts/search?${params.toString()}`);
    
          if (!res.ok) {
            console.error("Erreur fetch posts:", res.statusText);
            return;
          }
    
          const data = await res.json();
          setPosts(data);
        } catch (err) {
          console.error("Erreur fetch posts (exception):", err);
        }
      };
    
      fetchPosts();
    }, [searchQuery, filter]);

    const handleLike = async (postId: number) => {
      try {
        const res = await fetch(`/api/likes/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        });

        if (!res.ok) {
          console.error("Toggle like failed:", res.statusText);
          return;
        }
    
        const data = await res.json();

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: data.likes, liked: data.liked }
              : post
          )
        );
      } catch (err) {
        console.error("Error toggling like:", err);
      }
    };

    async function handleDelete(postId: number) {
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });
    
        if (res.status === 403) {
          console.error("Vous ne pouvez pas supprimer ce post (Forbidden)");
          return;
        }
    
        if (!res.ok) {
          console.error("Erreur lors de la suppression du post", res.statusText);
          return;
        }

        setPosts(prev => prev.filter(post => post.id !== postId));
    
      } catch (err) {
        console.error("Erreur lors de la suppression du post", err);
      }
    }

    return (
      <Layout
        onSearch={setSearchQuery}
        onFilterChange={setFilter}
        showPostCreationButton={true}
        showThemeToggle={false}
        showLanguageToggle={false}
        onPostCreationClick={() => setPostFormOpen(true)}
      >
        {postFormOpen ? (
          <NewPostModal
            onClose={() => setPostFormOpen(false)}
            onCreated={(createdPost) => setPosts((prev) => [createdPost, ...prev])}
          />
        ) : null}

        <div className="flex justify-center px-4 py-4 sm:px-6 sm:py-6">
          <div className="w-full max-w-5xl space-y-4">
            <div className="w-full space-y-4 transition-all duration-300 ease-in-out">
              {posts.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  {searchQuery ? t("NoResult") : t("homeDefault")}
                </div>
              ) : (
                posts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    currentUserId={currentUserId}
                    onLike={() => handleLike(post.id)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  };

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
import { ApiError, api } from "@/lib/api";
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
    const [errorMessage, setErrorMessage] = useState("");
    const hasActiveSearch = searchQuery.trim().length > 0;
    const showSortButton = hasActiveSearch && posts.length > 0;

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const params = new URLSearchParams();
          params.set("filter", filter);
          if (searchQuery.trim()) params.set("q", searchQuery.trim());

          const data = await api.get<Post[]>(`/posts/search?${params.toString()}`);
          setPosts(data);
          setErrorMessage("");
        } catch {
          setPosts([]);
          setErrorMessage(t("FetchUserPostsError"));
        }
      };
    
      void fetchPosts();
    }, [searchQuery, filter, t]);

    const handleLike = async (postId: number) => {
      try {
        const data = await api.post<{ likes: number; liked: boolean }>(
          "/likes/toggle",
          { postId },
        );

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: data.likes, liked: data.liked }
              : post
          )
        );
        setErrorMessage("");
      } catch {
        setErrorMessage(t("ToggleLikeError"));
      }
    };

    async function handleDelete(postId: number) {
      try {
        await api.delete(`/posts/${postId}`);

        setPosts(prev => prev.filter(post => post.id !== postId));
        setErrorMessage("");
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          setErrorMessage(t("DeletePostForbidden"));
          return;
        }

        setErrorMessage(t("DeletePostError"));
      }
    }

    return (
      <Layout
        onSearch={setSearchQuery}
        onFilterChange={setFilter}
        showSortButton={showSortButton}
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
              {errorMessage ? (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}
              {posts.length === 0 && !errorMessage ? (
                <div className="py-6 text-center text-muted-foreground">
                  {hasActiveSearch ? t("NoResult") : t("homeDefault")}
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

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
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
  import { PostCard } from "@/components/ui/post-card";
  import { Button } from "@/components/ui/button";
  import { useTranslation } from "react-i18next";
  import { authClient } from "@/lib/auth-client";

  interface Post {
    id: number;
    link: string;
    content: string;
    createdAt: string;
    likes: number;
    likedByUser?: boolean;
    author: {
      id: string;
      name: string;
    };
  }

  export const Home = () => {
    const MAX_POST_LENGTH = 300;
    const [submitError, setSubmitError] = useState("");
    const [postFormOpen, setPostFormOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const sessionResult = authClient.useSession();
    const session = sessionResult?.data;
    const currentUserId = session?.user?.id;
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
      const fetchPosts = async () => {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          console.error("Erreur fetch posts");
          return;
        }
    
        const data = await res.json();
        setPosts(data);
      };
    
      fetchPosts();
    }, []);

    function extractLink(text: string): { url?: string; contentWithoutLink: string } {
      const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    
      const match = urlRegex.exec(text);
    
      if (!match) {
        return { contentWithoutLink: text.trim() };
      }
    
      const rawUrl = match[0];

      const contentWithoutLink = text.replace(rawUrl, "").trim();

      let normalizedUrl = rawUrl;
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = "https://" + normalizedUrl;
      }
    
      return {
        url: normalizedUrl,
        contentWithoutLink,
      };
    }

    const handleConfirmPost = async () => {
      if (!newPostContent) {
        setSubmitError(t("EmptyContent"));
        return;
      }
  
      const { url, contentWithoutLink } = extractLink(newPostContent);
      if (!url) {
        setSubmitError(t("LinkInclusion"));
        return;
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: contentWithoutLink,
          link: url,
        }),
      });

      if (!response.ok) {
        setSubmitError(t("PostCreationError"));
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
                  onChange={(e) =>{
                    setNewPostContent(e.target.value);
                    setSubmitError("");
                  }}
                />
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {newPostContent.length} / {MAX_POST_LENGTH}
                </div>
                {submitError && (
                  <div className="p-2 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md mt-2">
                    {submitError}
                </div>
                )}
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
              currentUserId={currentUserId}
              onLike={() => handleLike(post.id)}
              onDelete={handleDelete}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post.id)}
            />
          ))}
        </div>
      </Layout>
    );
  };

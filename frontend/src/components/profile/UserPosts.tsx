import { useEffect, useState } from "react";
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

interface UserPostsProps {
  profileId: string;
}

export function UserPosts({ profileId }: UserPostsProps) {
  const { t } = useTranslation();
  const sessionResult = authClient.useSession();
  const session = sessionResult?.data;
  const currentUserId = session?.user?.id;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState<"recent" | "oldest" | "most_liked">(
    "recent",
  );

  useEffect(() => {
    if (!profileId) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("filter", filter);

        const data = await api.get<Post[]>(
          `/posts/user/${profileId}?${params.toString()}`,
        );
        setPosts(data);
        setErrorMessage("");
      } catch {
        setPosts([]);
        setErrorMessage(t("FetchUserPostsError"));
      } finally {
        setLoading(false);
      }
    };

    void fetchUserPosts();
  }, [profileId, filter, t]);

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
            : post,
        ),
      );
      setErrorMessage("");
    } catch {
      setErrorMessage(t("ToggleLikeError"));
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await api.delete(`/posts/${postId}`);

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setErrorMessage("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage(t("DeletePostForbidden"));
        return;
      }

      setErrorMessage(t("DeletePostError"));
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold">{t("ProfileSeens")}</h2>

        {posts.length > 0 && (
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "recent" | "oldest" | "most_liked")
            }
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="recent">{t("MostRecent")}</option>
            <option value="oldest">{t("Oldest")}</option>
            <option value="most_liked">{t("MostLiked")}</option>
          </select>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}
        {loading ? (
          <div className="text-center text-muted-foreground py-6">
            {t("Loading")}...
          </div>
        ) : posts.length === 0 && !errorMessage ? (
          <div className="text-center text-muted-foreground py-6">
            {t("NoPostsYet")}
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
  );
}

import { useEffect, useState } from "react";
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

        const res = await fetch(
          `/api/posts/user/${profileId}?${params.toString()}`,
        );

        if (!res.ok) {
          console.error(t("FetchUserPostsError"), res.statusText);
          return;
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(t("FetchUserPostsError"), err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [profileId, filter]);

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
        console.error(t("ToggleLikeFailed"), res.statusText);
        return;
      }

      const data = await res.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: data.likes, liked: data.liked }
            : post,
        ),
      );
    } catch (err) {
      console.error(t("ToggleLikeError"), err);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.status === 403) {
        console.error(t("DeletePostForbidden"));
        return;
      }

      if (!res.ok) {
        console.error(t("DeletePostError"), res.statusText);
        return;
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(t("DeletePostError"), err);
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
        {loading ? (
          <div className="text-center text-muted-foreground py-6">
            {t("Loading")}...
          </div>
        ) : posts.length === 0 ? (
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

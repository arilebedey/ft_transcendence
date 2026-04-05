/**
 * @page Dashboard
 * Dashboard analytique affichant des courbes d'évolution:
 * - Likes du compte au fil du temps
 * - Followers du compte au fil du temps
 * - Likes d'un post spécifique (sélectionné via menu déroulant)
 *
 * @state
 * - selectedPostId: number - ID du post sélectionné dans le dropdown
 *
 * @features
 * - Données temps-réel via API
 * - Affichage des 30 derniers jours
 * - Sélection de post pour voir l'évolution des likes
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Title } from "@/components/ui/title";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Chart wrapper (réutilise les couleurs du thème) ──────────

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export function Dashboard() {
  const { t } = useTranslation();
  const { data, loading, error, getPostLikes } = useDashboard();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postLikesData, setPostLikesData] = useState<
    Array<{ date: string; likes: number }>
  >([]);
  const [loadingPostLikes, setLoadingPostLikes] = useState(false);

  // Handle post selection change
  useEffect(() => {
    if (selectedPostId !== null) {
      const fetchPostLikes = async () => {
        setLoadingPostLikes(true);
        try {
          const likes = await getPostLikes(selectedPostId);
          setPostLikesData(likes);
        } catch (err) {
          console.log("Failed to load post likes:", err);
          setPostLikesData([]);
        } finally {
          setLoadingPostLikes(false);
        }
      };

      fetchPostLikes();
    }
  }, [selectedPostId, getPostLikes]);

  // Set default selected post on data load
  useEffect(() => {
    if (data?.posts && data.posts.length > 0 && selectedPostId === null) {
      setSelectedPostId(data.posts[0].id);
    }
  }, [data, selectedPostId]);

  if (loading) {
    return (
      <Layout
        showSearchBar={false}
        showLanguageToggle={false}
        showThemeToggle={false}
        showPostCreationButton={false}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Title title={t("dashboard.title")} />
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("dashboard.loading")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        showSearchBar={false}
        showLanguageToggle={false}
        showThemeToggle={false}
        showPostCreationButton={false}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Title title={t("dashboard.title")} />
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{t("dashboard.error")}</p>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showSearchBar={false}
      showLanguageToggle={false}
      showThemeToggle={false}
      showPostCreationButton={false}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Title title={t("dashboard.title")} />

        {/* ── Stats Summary ── */}
        {data?.stats && (
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.stats.totalLikes}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.totalLikes")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {data.stats.totalFollowers}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.totalFollowers")}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.stats.totalPosts}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.totalPosts")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Likes du compte ── */}
        {data?.accountLikes && data.accountLikes.length > 0 ? (
          <ChartCard
            title={t("dashboard.accountLikesTitle")}
            description={t("dashboard.accountLikesDesc")}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.accountLikes}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.accountLikesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t("dashboard.noData")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Followers ── */}
        {data?.followers && data.followers.length > 0 ? (
          <ChartCard
            title={t("dashboard.followersTitle")}
            description={t("dashboard.followersDesc")}
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.followers}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ fill: "var(--accent)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.followersTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t("dashboard.noData")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Likes par post ── */}
        {data?.posts && data.posts.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.likesByPostTitle")}</CardTitle>
              <CardDescription>{t("dashboard.likesByPostDesc")}</CardDescription>
              <select
                value={selectedPostId ?? ""}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  setSelectedPostId(id);
                }}
                className="mt-2 w-full rounded-md border border-border bg-card text-card-foreground px-3 py-2 text-sm focus:outline-none"
              >
                {data.posts.map((post) => {
                  const displayText = post.content && post.content.trim() ? post.content : post.link || "(no content)";
                  const label = displayText.length > 50 ? displayText.substring(0, 50) + "..." : displayText;
                  return (
                    <option key={post.id} value={post.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </CardHeader>
            <CardContent>
              {loadingPostLikes ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t("dashboard.loading")}
                  </p>
                </div>
              ) : postLikesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={postLikesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                    />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        color: "var(--card-foreground)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--primary)", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t("dashboard.noLikes")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.likesByPostTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                {t("dashboard.noPosts")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

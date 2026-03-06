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
 * @todo
 * - Connecter aux endpoints API réels
 * - Ajouter filtres de période (7j, 30j, 90j…)
 * - Rendre les données temps-réel via WebSocket
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
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

// ─── Stub data ────────────────────────────────────────────────

const ACCOUNT_LIKES_DATA = [
  { date: "Jan", likes: 120 },
  { date: "Fév", likes: 210 },
  { date: "Mar", likes: 380 },
  { date: "Avr", likes: 450 },
  { date: "Mai", likes: 520 },
  { date: "Jun", likes: 710 },
  { date: "Jul", likes: 890 },
  { date: "Aoû", likes: 1020 },
];

const FOLLOWERS_DATA = [
  { date: "Jan", followers: 45 },
  { date: "Fév", followers: 62 },
  { date: "Mar", followers: 89 },
  { date: "Avr", followers: 124 },
  { date: "Mai", followers: 156 },
  { date: "Jun", followers: 198 },
  { date: "Jul", followers: 243 },
  { date: "Aoû", followers: 301 },
];

interface StubPost {
  id: number;
  title: string;
  data: { date: string; likes: number }[];
}

const STUB_POSTS: StubPost[] = [
  {
    id: 1,
    title: "Just shipped a new feature!",
    data: [
      { date: "Lun", likes: 3 },
      { date: "Mar", likes: 8 },
      { date: "Mer", likes: 14 },
      { date: "Jeu", likes: 22 },
      { date: "Ven", likes: 31 },
      { date: "Sam", likes: 38 },
      { date: "Dim", likes: 42 },
    ],
  },
  {
    id: 2,
    title: "Beautiful sunset from the office",
    data: [
      { date: "Lun", likes: 12 },
      { date: "Mar", likes: 34 },
      { date: "Mer", likes: 67 },
      { date: "Jeu", likes: 89 },
      { date: "Ven", likes: 105 },
      { date: "Sam", likes: 118 },
      { date: "Dim", likes: 128 },
    ],
  },
  {
    id: 3,
    title: "Reading through AI ethics discussions",
    data: [
      { date: "Lun", likes: 5 },
      { date: "Mar", likes: 11 },
      { date: "Mer", likes: 24 },
      { date: "Jeu", likes: 39 },
      { date: "Ven", likes: 48 },
      { date: "Sam", likes: 58 },
      { date: "Dim", likes: 67 },
    ],
  },
];

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
  const [selectedPostId, setSelectedPostId] = useState<number>(
    STUB_POSTS[0].id,
  );

  const { t } = useTranslation();

  const selectedPost = STUB_POSTS.find((p) => p.id === selectedPostId)!;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Title title={t("dashboard.title")} />

        {/* ── Likes du compte ── */}
        <ChartCard
          title={t("dashboard.accountLikesTitle")}
          description={t("dashboard.accountLikesDesc")}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={ACCOUNT_LIKES_DATA}>
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

        {/* ── Followers ── */}
        <ChartCard
          title={t("dashboard.followersTitle")}
          description={t("dashboard.followersDesc")}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={FOLLOWERS_DATA}>
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

        {/* ── Likes par post ── */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.likesByPostTitle")}</CardTitle>
            <CardDescription>{t("dashboard.likesByPostDesc")}</CardDescription>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(Number(e.target.value))}
              className="mt-2 w-full rounded-md border border-border bg-card text-card-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STUB_POSTS.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={selectedPost.data}>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

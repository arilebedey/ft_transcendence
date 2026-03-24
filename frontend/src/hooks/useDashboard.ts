import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface LikesOverTime {
  date: string;
  likes: number;
}

interface FollowersOverTime {
  date: string;
  followers: number;
}

interface DashboardData {
  accountLikes: LikesOverTime[];
  followers: FollowersOverTime[];
  posts: Array<{ id: number; content: string }>;
  stats: {
    totalLikes: number;
    totalFollowers: number;
    totalPosts: number;
  };
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accountLikesRes, followersRes, postsRes, statsRes] = await Promise.all([
          api.get('/dashboard/account-likes'),
          api.get('/dashboard/followers'),
          api.get('/dashboard/posts'),
          api.get('/dashboard/stats'),
        ]);

        setData({
          accountLikes: accountLikesRes,
          followers: followersRes,
          posts: postsRes,
          stats: statsRes,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.log('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getPostLikes = useCallback(async (postId: number) => {
    try {
      return await api.get(`/dashboard/post/${postId}`);
    } catch (err) {
      console.log('Failed to fetch post likes:', err);
      throw err;
    }
  }, []);

  return { data, loading, error, getPostLikes };
}

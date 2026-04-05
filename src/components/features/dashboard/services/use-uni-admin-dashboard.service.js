'use client';

import { useCallback, useEffect, useState } from 'react';

import { DashboardService } from './dashboard-stats.service';

export const useUniAdminDashboard = (termId = null) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTerms: 0,
    totalGroups: 0,
    statusCounts: {
      upcoming: 0,
      active: 0,
      ended: 0,
      closed: 0,
    },
  });
  const [recentTerms, setRecentTerms] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, dashboardData] = await Promise.all([
        DashboardService.getProfile(),
        DashboardService.getStats(termId),
      ]);

      const profileData = profileRes?.data || profileRes;
      if (profileData) setProfile(profileData);

      if (dashboardData) {
        setStats(dashboardData.stats);
        setRecentTerms(dashboardData.terms);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [termId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, termId]);

  return {
    loading,
    profile,
    stats,
    recentTerms,
    refresh: fetchData,
  };
};

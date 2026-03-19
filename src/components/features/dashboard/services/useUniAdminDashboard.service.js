'use client';

import { useState, useCallback, useEffect } from 'react';
import { DashboardService } from './DashboardService';

export const useUniAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeTerms: 0,
    totalGroups: 0,
  });
  const [recentTerms, setRecentTerms] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, terms] = await Promise.all([
        DashboardService.getProfile(),
        DashboardService.getStats(),
        DashboardService.getRecentTerms(5),
      ]);

      if (profileRes?.data) setProfile(profileRes.data);
      setStats(statsRes);
      setRecentTerms(terms);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    profile,
    stats,
    recentTerms,
    refresh: fetchData,
  };
};

'use client';

import { useState, useCallback, useEffect } from 'react';
import httpClient from '@/services/httpClient';
import { TermService } from '../../TermManagement/services/term.service';
import { userService } from '@/components/features/user/services/userService';

export const useUniAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeTerms: 0,
    totalGroups: 0,
  });
  const [recentTerms, setRecentTerms] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const profileRes = await userService.getMe();
      if (profileRes?.data) setProfile(profileRes.data);
    } catch (e) {
      console.warn('Profile fetch failed:', e);
    }

    // 2. Fetch Terms
    try {
      const termsRes = await TermService.getAll({ pageSize: 5 });
      if (termsRes?.data) {
        setRecentTerms(termsRes.data.items || []);
        setStats((prev) => ({
          ...prev,
          activeTerms: termsRes.data.totalCount || 0,
        }));
      }
    } catch (e) {
      console.warn('Terms fetch failed:', e);
    }

    // 3. Fetch Enrollment stats
    try {
      // Trying /enrollments, but handle 404 gracefully
      const enrollRes = await httpClient.httpGet('/enrollments', { pageSize: 1 });
      if (enrollRes?.data) {
        setStats((prev) => ({
          ...prev,
          totalStudents: enrollRes.data.totalCount || 0,
        }));
      }
    } catch (e) {
      console.warn('Enrollment fetch failed:', e);
    }

    // 4. Fetch Internship Groups count
    try {
      const groupsRes = await httpClient.httpGet('/internship-groups', { pageSize: 1 });
      if (groupsRes?.data) {
        setStats((prev) => ({
          ...prev,
          totalGroups: groupsRes.data.totalCount || 0,
        }));
      }
    } catch (e) {
      console.warn('Groups fetch failed:', e);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  return {
    loading,
    profile,
    stats,
    recentTerms,
    refresh: fetchDashboardData,
  };
};

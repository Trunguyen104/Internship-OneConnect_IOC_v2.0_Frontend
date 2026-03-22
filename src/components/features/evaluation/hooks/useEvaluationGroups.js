'use client';

import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';

export function useEvaluationGroups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await InternshipGroupService.getAll();
      const items = res?.data?.items || res?.data || [];
      setGroups(items);
      if (items.length > 0) {
        setSelectedGroup(items[0]);
      }
    } catch (error) {
      console.error('Error fetching evaluation groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSelectGroup = (groupId) => {
    const group = groups.find((g) => (g.internshipId || g.id) === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  return {
    groups,
    selectedGroup,
    loading,
    handleSelectGroup,
    refreshGroups: fetchGroups,
  };
}

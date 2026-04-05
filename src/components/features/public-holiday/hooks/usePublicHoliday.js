'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { PUBLIC_HOLIDAY_UI } from '@/constants/publicHoliday/uiText';
import { useToast } from '@/providers/ToastProvider';

import { PublicHolidayService } from '../services/public-holiday.service';

export function usePublicHoliday() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [year, setYear] = useState(new Date().getFullYear());

  // 1. Fetch holidays
  const { data: holidays = [], isLoading: loading } = useQuery({
    queryKey: ['public-holidays', year],
    queryFn: async () => {
      try {
        const res = await PublicHolidayService.getAll(year);
        return res?.data || [];
      } catch {
        return [];
      }
    },
  });

  // 2. Sync holidays
  const syncMutation = useMutation({
    mutationFn: (syncYear) => PublicHolidayService.sync(syncYear),
    onSuccess: (res) => {
      const syncedCount = res?.data?.syncedCount || 0;
      toast.success(PUBLIC_HOLIDAY_UI.SUCCESS.SYNC.replace('{count}', syncedCount.toString()));
      queryClient.invalidateQueries({ queryKey: ['public-holidays'] });
    },
    onError: (err) => {
      toast.error(err?.message || PUBLIC_HOLIDAY_UI.MODAL.SYNC_ERROR);
    },
  });

  // 3. Create holiday
  const createMutation = useMutation({
    mutationFn: (payload) => PublicHolidayService.create(payload),
    onSuccess: () => {
      toast.success(PUBLIC_HOLIDAY_UI.SUCCESS.CREATE);
      queryClient.invalidateQueries({ queryKey: ['public-holidays'] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to create holiday');
    },
  });

  // 4. Delete holiday
  const deleteMutation = useMutation({
    mutationFn: (id) => PublicHolidayService.delete(id),
    onSuccess: () => {
      toast.success(PUBLIC_HOLIDAY_UI.SUCCESS.DELETE);
      queryClient.invalidateQueries({ queryKey: ['public-holidays'] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to delete holiday');
    },
  });

  return {
    holidays,
    loading,
    year,
    setYear,
    syncHolidays: syncMutation.mutate,
    syncing: syncMutation.isPending,
    createHoliday: createMutation.mutateAsync,
    creating: createMutation.isPending,
    deleteHoliday: deleteMutation.mutate,
    deleting: deleteMutation.isPending,
  };
}

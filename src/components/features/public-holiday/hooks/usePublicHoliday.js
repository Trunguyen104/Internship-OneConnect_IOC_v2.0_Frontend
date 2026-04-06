import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { PublicHolidayService } from '../services/public-holiday.service';

/**
 * Hook for managing public holidays (fetching, syncing, adding, deleting).
 * @param {number} initialYear - The year to fetch holidays for.
 */
export const usePublicHoliday = (initialYear = new Date().getFullYear()) => {
  const [year, setYear] = useState(initialYear);
  const toast = useToast();
  const queryClient = useQueryClient();

  // 1. Fetch holidays
  const { data: holidaysData, isLoading: loading } = useQuery({
    queryKey: ['public-holidays', year],
    queryFn: () => PublicHolidayService.getAll(year),
    select: (res) => res?.data || [],
  });

  // 2. Sync holidays
  const syncMutation = useMutation({
    mutationFn: (syncParams) => PublicHolidayService.sync(syncParams),
    onSuccess: (res) => {
      if (res?.isSuccess !== false) {
        toast.success('Public holidays synced successfully.');
        queryClient.invalidateQueries(['public-holidays', year]);
      } else {
        toast.error(res?.message || 'Failed to sync holidays.');
      }
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        'Sync operation failed.';
      toast.error(errorMsg);
    },
  });

  // 3. Create holiday
  const createMutation = useMutation({
    mutationFn: (data) => PublicHolidayService.create(data),
    onSuccess: (res) => {
      if (res?.isSuccess !== false) {
        toast.success('Holiday added successfully.');
        queryClient.invalidateQueries(['public-holidays', year]);
      } else {
        toast.error(res?.message || 'Failed to add holiday.');
      }
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to add holiday.';
      toast.error(errorMsg);
    },
  });

  // 4. Delete holiday
  const deleteMutation = useMutation({
    mutationFn: (id) => PublicHolidayService.delete(id),
    onSuccess: (res) => {
      if (res?.isSuccess !== false) {
        toast.success('Holiday deleted successfully.');
        queryClient.invalidateQueries(['public-holidays', year]);
      } else {
        toast.error(res?.message || 'Failed to delete holiday.');
      }
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete holiday.';
      toast.error(errorMsg);
    },
  });

  return {
    holidays: holidaysData || [],
    loading,
    syncing: syncMutation.isPending,
    creating: createMutation.isPending,
    deleting: deleteMutation.isPending,
    year,
    setYear,
    syncHolidays: (syncYear) => syncMutation.mutate({ year: syncYear, countryCode: 'VN' }),
    createHoliday: createMutation.mutateAsync, // Using mutateAsync to allow await in the form
    deleteHoliday: deleteMutation.mutate,
  };
};

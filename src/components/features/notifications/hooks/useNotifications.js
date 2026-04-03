import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { NotificationService } from '../services/notification.service';

/**
 * Hook to manage fetching, marking as read, and deleting notifications.
 * Uses useInfiniteQuery for the list and standard useQuery for unread count.
 */
export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Fetch unread count (cached/invalidated on changes)
  const { data: unreadData, refetch: refreshUnreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => NotificationService.getUnreadCount(),
    // Keep count relatively fresh
    staleTime: 30 * 1000,
  });

  const unreadCount = useMemo(() => unreadData?.data?.unreadCount || 0, [unreadData]);

  // 2. Fetch paginated notifications list (using infinite query for cuộn vô tận)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: loading,
    refetch: fetchNotifications,
  } = useInfiniteQuery({
    queryKey: ['notifications', 'list'],
    queryFn: ({ pageParam = 1 }) =>
      NotificationService.getNotifications({ pageIndex: pageParam, pageSize: 15 }),
    getNextPageParam: (lastPage) => {
      const { pageIndex, totalPages } = lastPage?.data || {};
      return pageIndex < totalPages ? pageIndex + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });

  const notifications = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data?.items || []) || [];
  }, [data]);

  // 3. Mutation: Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: (id) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 4. Mutation: Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 5. Mutation: Delete one
  const deleteMutation = useMutation({
    mutationFn: (id) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // 6. Mutation: Bulk delete
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => NotificationService.bulkDeleteNotifications(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    loading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchNotifications,
    refreshUnreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    bulkDeleteNotifications: bulkDeleteMutation.mutate,
  };
};

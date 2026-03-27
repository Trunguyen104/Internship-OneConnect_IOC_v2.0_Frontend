import { useQuery, useQueryClient } from '@tanstack/react-query';

import { httpGet, httpPatch } from '@/services/http-client.service';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Unread Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      try {
        const response = await httpGet('/notifications/notifications/unread-count');
        return response?.data?.unreadCount || 0;
      } catch (error) {
        if (error?.status === 401 || error?.silent) return 0;
        console.error('Failed to fetch unread count:', error);
        return 0;
      }
    },
    staleTime: 30 * 1000, // Check every 30s
  });

  // 2. Fetch Notifications List
  const {
    data: notifications = [],
    isLoading: loading,
    refetch: fetchNotifications,
  } = useQuery({
    queryKey: ['notifications-list'],
    queryFn: async () => {
      try {
        const response = await httpGet('/notifications/notifications');
        return response?.data?.items || [];
      } catch (error) {
        if (error?.status === 401 || error?.silent) return [];
        console.error('Failed to fetch notifications:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  const markAsRead = async (notificationId) => {
    try {
      const response = await httpPatch(`/notifications/notifications/${notificationId}/read`);
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
        queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      }
    } catch (error) {
      if (error?.status === 401 || error?.silent) return;
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await httpPatch('/notifications/notifications/read-all');
      if (response?.success) {
        queryClient.invalidateQueries({ queryKey: ['notifications-list'] });
        queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      }
    } catch (error) {
      if (error?.status === 401 || error?.silent) return;
      console.error('Failed to mark all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

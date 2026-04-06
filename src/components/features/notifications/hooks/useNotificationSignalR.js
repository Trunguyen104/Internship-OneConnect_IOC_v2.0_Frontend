'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';

import { notificationSignalRService } from '../services/notification-signalr.service';

/**
 * Hook to manage SignalR lifecycle for notifications.
 * Automatically fetches temporary token for secure WebSocket connection.
 */
export const useNotificationSignalR = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isStarted = useRef(false);

  useEffect(() => {
    if (!user || isStarted.current) return;

    const connectHub = async () => {
      try {
        // Step 1: Fetch short-lived token for query-string auth (AC-02)
        const resToken = await fetch('/api/auth/token', {
          method: 'POST',
          credentials: 'include',
        });
        if (!resToken.ok) throw new Error('Failed to get notification token');
        const { accessToken } = await resToken.json();

        // Step 2: Start connection
        await notificationSignalRService.start(accessToken);
        isStarted.current = true;

        // Step 3: Listen for new notifications
        notificationSignalRService.subscribe((notification) => {
          // Show toast on receive (AC-02)
          toast.info(notification.title || 'New Notification', {
            description: notification.content,
          });

          // Invalidate cache to update UI (AC-01/02)
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        });
      } catch (err) {
        console.error('Failed to initialize Notification Hub:', err);
      }
    };

    connectHub();

    return () => {
      notificationSignalRService.stop();
      isStarted.current = false;
    };
  }, [user, toast, queryClient]);
};

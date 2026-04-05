'use client';

import { useNotificationSignalR } from '@/components/features/notifications/hooks/useNotificationSignalR';

/**
 * Provider to bootstrap SignalR notification connection globally.
 * This should be wrapped around authenticated parts of the app.
 */
export const NotificationProvider = ({ children }) => {
  // Initialize the SignalR lifecycle hook
  useNotificationSignalR();

  return <>{children}</>;
};

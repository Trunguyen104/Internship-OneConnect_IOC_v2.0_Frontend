import { httpDelete, httpGet, httpPatch, httpPost } from '@/services/http-client.service';

/**
 * Service to handle notification-related API requests.
 */
export const NotificationService = {
  /**
   * Fetch a paginated list of notifications.
   */
  getNotifications: (params = { pageIndex: 1, pageSize: 10 }) =>
    httpGet('/notifications/notifications', params),

  /**
   * Fetch the current unread notifications count.
   */
  getUnreadCount: () => httpGet('/notifications/notifications/unread-count'),

  /**
   * Mark a single notification as read.
   */
  markAsRead: (id) => httpPatch(`/notifications/notifications/${id}/read`),

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: () => httpPatch('/notifications/notifications/read-all'),

  /**
   * Delete a single notification (soft delete).
   */
  deleteNotification: (id) => httpDelete(`/notifications/notifications/${id}`),

  /**
   * Delete multiple notifications (bulk delete).
   */
  bulkDeleteNotifications: (ids) => httpPost('/notifications/notifications/bulk-delete', { ids }),
};

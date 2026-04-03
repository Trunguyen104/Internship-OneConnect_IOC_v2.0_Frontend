import { Avatar, Badge, Popover, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { cn } from '@/lib/cn';

import { NOTIFICATIONS_UI } from '../constants/uiText';
import { useNotifications } from '../hooks/useNotifications';

dayjs.extend(relativeTime);

const NotificationBell = () => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      markAsRead(item.notificationId);
    }

    // Smart Redirection (AC-04)
    if (item.referenceType && item.referenceId) {
      switch (item.referenceType.toLowerCase()) {
        case 'application':
          router.push(`/my-applications?id=${item.referenceId}`);
          break;
        case 'task':
          router.push(`/tasks?id=${item.referenceId}`);
          break;
        case 'internship':
          router.push(`/internships?id=${item.referenceId}`);
          break;
        default:
          if (item.actionUrl) router.push(item.actionUrl);
      }
    } else if (item.actionUrl) {
      router.push(item.actionUrl);
    }

    setOpen(false);
  };

  const menu = (
    <div className="flex w-[380px] flex-col overflow-hidden sm:w-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="m-0 text-base font-bold text-gray-900">{NOTIFICATIONS_UI.TITLE}</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-black text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <button
          className="rounded-lg px-2 py-1 text-xs font-bold text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          {NOTIFICATIONS_UI.MARK_ALL_READ}
        </button>
      </div>

      {/* List */}
      <div className="scrollbar-hide max-h-[500px] min-h-[100px] overflow-y-auto bg-white">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Spin size="medium" />
            <p className="text-sm font-medium text-gray-400">{NOTIFICATIONS_UI.LOADING}</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-50">
            {notifications.map((item) => (
              <div
                key={item.notificationId}
                className={cn(
                  'group relative flex cursor-pointer items-start gap-4 px-5 py-4 transition-all duration-300',
                  !item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'bg-white hover:bg-gray-50'
                )}
                onClick={() => handleNotificationClick(item)}
              >
                {!item.isRead && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                  </div>
                )}

                <div className="relative shrink-0 pt-0.5">
                  <Avatar
                    size={48}
                    src={item.avatar}
                    className="border-2 border-white bg-gray-100 shadow-sm"
                    icon={<Bell className="size-5 text-gray-400" />}
                  />
                  {item.icon && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] text-white">
                      {item.icon}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                  <div
                    className={cn(
                      'text-sm leading-snug tracking-tight line-clamp-2',
                      !item.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'
                    )}
                  >
                    {item.title}
                  </div>
                  <div
                    className={cn(
                      'text-sm leading-relaxed line-clamp-2',
                      !item.isRead ? 'text-gray-700' : 'text-gray-500'
                    )}
                  >
                    {item.content}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                {/* Individual Actions (Soft Delete AC-07) */}
                <div className="flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {!item.isRead && (
                    <Tooltip title={NOTIFICATIONS_UI.ACTIONS.MARK_AS_READ}>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.notificationId);
                        }}
                      >
                        <Check className="size-4" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip title={NOTIFICATIONS_UI.ACTIONS.DELETE}>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-all hover:bg-rose-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.notificationId);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}

            {/* Load More (Infinite Scroll AC-03) */}
            {hasNextPage && (
              <button
                className="flex w-full items-center justify-center bg-gray-50/50 py-3 text-xs font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-100 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchNextPage();
                }}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? <Spin size="small" /> : NOTIFICATIONS_UI.LOAD_MORE}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-40">
            <Bell className="size-12 text-gray-300" strokeWidth={1} />
            <p className="text-sm font-medium tracking-tight text-gray-400">
              {NOTIFICATIONS_UI.EMPTY}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={menu}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="p-0 border-none"
      styles={{ body: { padding: 0 }, content: { borderRadius: '16px', overflow: 'hidden' } }}
      arrow={false}
    >
      <div className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gray-100/80 transition-all duration-300 hover:bg-white hover:shadow-lg hover:ring-1 hover:ring-black/5 active:scale-95">
        <Badge
          count={unreadCount}
          size="small"
          overflowCount={99}
          offset={[2, -2]}
          styles={{ count: { fontSize: '10px', boxShadow: 'none' } }}
        >
          <Bell
            className={cn(
              'size-5 transition-all duration-300',
              unreadCount > 0
                ? 'fill-blue-600 text-blue-600'
                : 'text-gray-500 group-hover:text-gray-900'
            )}
          />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationBell;

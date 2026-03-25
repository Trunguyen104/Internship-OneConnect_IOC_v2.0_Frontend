'use client';

import 'dayjs/locale/vi';

import { Avatar, Badge, Popover, Spin } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell } from 'lucide-react';
import React, { useState } from 'react';

import { useNotifications } from '../hooks/useNotifications';

dayjs.extend(relativeTime);
const LABELS = {
  TITLE: 'Thông báo',
  MARK_READ: 'Đánh dấu đã đọc',
  EMPTY: 'Không có thông báo nào',
};

const NotificationBell = () => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (newOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (!isRead) {
      await markAsRead(id);
    }
  };

  const content = (
    <div className="w-[380px] sm:w-[450px]">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="m-0 text-lg font-bold text-text">{LABELS.TITLE}</h3>
        <button
          className="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            markAllAsRead();
          }}
        >
          {LABELS.MARK_READ}
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Spin size="small" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col">
            {notifications.map((item) => (
              <div
                key={item.notificationId}
                className={`flex cursor-pointer items-start gap-3 border-b border-border p-4 transition-colors duration-200 ${
                  !item.isRead ? 'bg-(--blue-50)' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => handleMarkAsRead(item.notificationId, item.isRead)}
              >
                <div className="shrink-0">
                  <Avatar
                    size={42}
                    src={item.avatar}
                    className="border border-gray-100"
                    icon={<div className="h-full w-full bg-gray-200" />}
                  />
                </div>

                <div className="min-w-0 flex-1 pr-4">
                  <div
                    className={`mb-1 text-sm leading-tight ${
                      !item.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {item.content || item.title}
                  </div>
                  <div className="text-xs text-blue-500">{dayjs(item.createdAt).fromNow()}</div>
                </div>

                {!item.isRead && (
                  <div className="shrink-0 self-center">
                    <div className="h-2 w-2 rounded-full bg-blue-800" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">{LABELS.EMPTY}</div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
      classNames={{ root: 'ant-popover-notification' }}
      arrow={false}
      styles={{ body: { padding: 0 } }}
    >
      <div className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 transition-all hover:bg-gray-300">
        <Badge count={unreadCount} size="small" offset={[2, 0]}>
          <Bell className="h-5 w-5 text-gray-700 transition-colors" />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationBell;

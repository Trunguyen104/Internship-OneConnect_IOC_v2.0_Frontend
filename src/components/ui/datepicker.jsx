'use client';

import { DatePicker as AntdDatePicker } from 'antd';
import React from 'react';

/**
 * Custom DatePicker bọc từ Ant Design.
 * Tự động bo góc 12px và h-11 để khớp với các Input khác.
 */
export const DatePicker = ({ className, ...props }) => {
  return (
    <AntdDatePicker
      className={`h-11 w-full rounded-2xl border-border hover:border-primary focus:border-primary ${className || ''}`}
      getPopupContainer={(trigger) => trigger.closest('.ant-drawer-body') || document.body}
      placement="bottomLeft"
      {...props}
    />
  );
};

export default DatePicker;

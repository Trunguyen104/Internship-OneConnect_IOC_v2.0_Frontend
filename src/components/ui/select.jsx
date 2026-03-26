'use client';

import { Select as AntdSelect } from 'antd';
import React from 'react';

/**
 * Custom Select bọc từ Ant Design.
 * Tự động bo góc 12px và h-11 để khớp với bộ UI.
 */
export const Select = ({ className, ...props }) => {
  return (
    <AntdSelect
      className={`h-11 w-full ${className || ''}`}
      classNames={{
        popup: {
          root: 'rounded-xl shadow-lg',
        },
      }}
      {...props}
    />
  );
};

export default Select;

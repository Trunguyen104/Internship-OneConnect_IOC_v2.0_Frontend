'use client';

import { Dropdown as AntdDropdown } from 'antd';
import React from 'react';

/**
 * Custom Dropdown bọc từ Ant Design.
 */
export const Dropdown = ({
  children,
  menu,
  trigger = ['click'],
  placement = 'bottomRight',
  ...props
}) => {
  return (
    <AntdDropdown menu={menu} trigger={trigger} placement={placement} {...props}>
      {children}
    </AntdDropdown>
  );
};

export default Dropdown;

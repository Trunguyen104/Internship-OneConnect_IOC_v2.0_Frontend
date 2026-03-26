'use client';

import { Checkbox as AntdCheckbox } from 'antd';
import React from 'react';

/**
 * Custom Checkbox bọc từ Ant Design.
 */
export const Checkbox = ({ children, ...props }) => {
  return <AntdCheckbox {...props}>{children}</AntdCheckbox>;
};

export default Checkbox;

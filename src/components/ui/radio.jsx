'use client';

import { Radio as AntdRadio } from 'antd';
import React from 'react';

/**
 * Custom Radio bọc từ Ant Design.
 */
export const Radio = ({ children, ...props }) => {
  return <AntdRadio {...props}>{children}</AntdRadio>;
};

export const RadioGroup = AntdRadio.Group;

export default Radio;

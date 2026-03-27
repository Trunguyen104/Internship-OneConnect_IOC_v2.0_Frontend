'use client';

import { Checkbox as AntdCheckbox } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Custom Checkbox bọc từ Ant Design.
 */
export const Checkbox = ({ children, ...props }) => {
  return <AntdCheckbox {...props}>{children}</AntdCheckbox>;
};

Checkbox.propTypes = {
  children: PropTypes.node,
};

export default Checkbox;

'use client';

import { Checkbox as AntdCheckbox } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Custom Checkbox bọc từ Ant Design.
 */
export const Checkbox = ({ children, onCheckedChange, onChange, ...props }) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
    if (onCheckedChange) onCheckedChange(e.target.checked);
  };

  return (
    <AntdCheckbox {...props} onChange={handleChange}>
      {children}
    </AntdCheckbox>
  );
};

Checkbox.propTypes = {
  children: PropTypes.node,
};

export default Checkbox;

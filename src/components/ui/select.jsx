'use client';

import { Select as AntdSelect } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Custom Select bọc từ Ant Design.
 * Tự động bo góc 12px và h-11 để khớp với bộ UI.
 */
export const Select = ({ className, error, ...props }) => {
  return (
    <div className="flex w-full flex-col gap-1.5 overflow-hidden">
      <AntdSelect
        className={`h-11 w-full ${className || ''}`}
        status={error ? 'error' : undefined}
        classNames={{
          popup: {
            root: 'rounded-xl shadow-lg',
          },
        }}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  error: PropTypes.node,
};

export default Select;

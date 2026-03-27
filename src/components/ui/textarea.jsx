'use client';

import { Input } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { cn } from '@/lib/cn';

const { TextArea: AntdTextArea } = Input;

function Textarea({ className, ...props }) {
  return (
    <AntdTextArea
      {...props}
      className={cn(
        'min-h-24 w-full rounded-md border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'transition-all focus:shadow-none',
        className
      )}
    />
  );
}

Textarea.propTypes = {
  className: PropTypes.string,
};

export { Textarea };
export default Textarea;

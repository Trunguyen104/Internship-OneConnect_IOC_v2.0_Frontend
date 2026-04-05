'use client';

import { Button as AntdButton } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { cn } from '@/lib/cn';

const VARIANT_MAP = {
  default: { type: 'primary' },
  secondary: { type: 'default' },
  outline: { type: 'default' },
  ghost: { type: 'text' },
  destructive: { type: 'primary', danger: true },
  link: { type: 'link' },
};

const SIZE_MAP = {
  default: 'middle',
  sm: 'small',
  lg: 'large',
  icon: 'middle',
};

// Map custom sizing from Tailwind to maintain visual consistency
const TAILWIND_SIZES = {
  xs: 'h-7 px-2 text-xs',
  'icon-sm': 'h-8 w-8',
  'icon-xs': 'h-6 w-6',
  'icon-lg': 'h-10 w-10',
};

function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  loading = false,
  asChild = false,
  children,
  ...props
}) {
  const antdProps = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const antdSize = SIZE_MAP[size] || 'middle';

  const mergedClassName = cn(
    'font-bold transition-all shadow-sm flex items-center justify-center',
    size === 'icon' && 'h-9 w-9 p-0',
    TAILWIND_SIZES[size] || '',
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(mergedClassName, children.props.className),
      ...props,
    });
  }

  return (
    <AntdButton
      {...props}
      htmlType={type}
      type={antdProps.type}
      danger={antdProps.danger}
      size={antdSize}
      loading={loading}
      className={mergedClassName}
    >
      {children}
    </AntdButton>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon', 'xs', 'icon-sm', 'icon-xs', 'icon-lg']),
  type: PropTypes.string,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export { Button };
export default Button;

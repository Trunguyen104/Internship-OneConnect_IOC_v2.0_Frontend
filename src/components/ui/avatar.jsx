'use client';

import { Avatar as AntdAvatar } from 'antd';
import React from 'react';

import { cn } from '@/lib/cn';

export function Avatar({
  src,
  alt,
  children,
  size = 'default',
  shape = 'circle',
  className,
  icon,
  ...props
}) {
  return (
    <AntdAvatar
      src={src}
      alt={alt}
      size={size}
      shape={shape}
      icon={icon}
      className={cn(
        'border-primary/20 bg-primary-surface text-primary border font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </AntdAvatar>
  );
}

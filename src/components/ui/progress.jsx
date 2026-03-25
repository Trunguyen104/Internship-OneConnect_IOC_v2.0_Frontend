'use client';

import { Progress as AntdProgress } from 'antd';
import React from 'react';

import { cn } from '@/lib/utils';

export function Progress({
  percent,
  size = 120,
  strokeWidth = 10,
  strokeColor,
  trailColor,
  format,
  className,
  type = 'circle',
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <AntdProgress
        type={type}
        percent={percent}
        size={size}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        trailColor={trailColor}
        format={format}
      />
    </div>
  );
}

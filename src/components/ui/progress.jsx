'use client';

import { Progress as AntdProgress } from 'antd';
import React from 'react';

import { cn } from '@/lib/cn';

export function Progress({
  percent,
  size = 120,
  strokeWidth = 10,
  strokeColor,
  railColor,
  trailColor,
  format,
  className,
  type = 'circle',
}) {
  const resolvedRailColor = railColor ?? trailColor;

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <AntdProgress
        type={type}
        percent={percent}
        size={size}
        strokeWidth={strokeWidth}
        strokeColor={strokeColor}
        railColor={resolvedRailColor}
        format={format}
      />
    </div>
  );
}

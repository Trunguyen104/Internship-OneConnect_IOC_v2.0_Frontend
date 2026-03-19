'use client';

import React from 'react';
import { Skeleton } from 'antd';

export default function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className='w-full space-y-4 py-4'>
      <div className='flex gap-4 border-b border-gray-100 pb-4'>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className='flex-1'>
            <Skeleton.Button active size='small' block />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex gap-4 border-b border-gray-50 py-4'>
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className='flex-1'>
              <Skeleton.Input active size='small' block />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

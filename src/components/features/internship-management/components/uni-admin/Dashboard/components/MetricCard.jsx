'use client';

import React, { memo } from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const MetricCard = memo(function MetricCard({ title, value, icon, color, loading, suffix }) {
  return (
    <Card
      loading={loading}
      className='group relative h-full overflow-hidden rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]'
      bodyStyle={{ padding: '24px', position: 'relative', zIndex: 1, height: '100%' }}
    >
      {/* Decorative Background Gradient */}
      <div
        className='absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150'
        style={{ backgroundColor: color }}
      />

      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-1.5 rounded-full' style={{ backgroundColor: color }} />
            <Text className='text-muted text-[10px] font-bold tracking-[0.15em] uppercase'>
              {title}
            </Text>
          </div>

          <div className='flex items-baseline gap-2'>
            <Title level={2} className='text-text m-0 text-3xl font-black tracking-tight'>
              {value}
            </Title>
            {suffix && (
              <span className='text-muted text-[11px] font-bold tracking-wider uppercase'>
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className='flex size-14 items-center justify-center rounded-2xl text-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-110'
          style={{
            background: `color-mix(in srgb, ${color}, transparent 85%)`,
            color: color,
            border: `1px solid color-mix(in srgb, ${color}, transparent 80%)`,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
});

export default MetricCard;

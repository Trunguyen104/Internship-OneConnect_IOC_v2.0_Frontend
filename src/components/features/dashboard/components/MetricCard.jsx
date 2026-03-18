'use client';

import React, { memo } from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const MetricCard = memo(function MetricCard({ title, value, icon, color, loading, suffix }) {
  return (
    <Card
      loading={loading}
      className='group bg-surface/60 relative h-full overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
      bodyStyle={{ padding: '28px', position: 'relative', zIndex: 1, height: '100%' }}
    >
      {/* Animated Background Glow */}
      <div
        className='absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20'
        style={{ backgroundColor: color }}
      />

      <div className='flex items-center justify-between'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2.5'>
            <div
              className='h-2 w-2 animate-pulse rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]'
              style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
            />
            <Text className='text-muted text-[10px] font-extrabold tracking-[0.2em] uppercase opacity-80'>
              {title}
            </Text>
          </div>

          <div className='flex items-baseline gap-3'>
            <Title level={2} className='text-text !m-0 text-4xl font-black tracking-tighter'>
              {value}
            </Title>
            {suffix && (
              <span className='text-muted/80 text-[11px] font-bold tracking-widest uppercase'>
                {suffix}
              </span>
            )}
          </div>
        </div>

        <div
          className='flex size-16 items-center justify-center rounded-[1.25rem] text-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12'
          style={{
            background: `color-mix(in srgb, ${color}, transparent 88%)`,
            color: color,
            border: `1px solid color-mix(in srgb, ${color}, transparent 80%)`,
            backdropFilter: 'blur(4px)',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
});

export default MetricCard;

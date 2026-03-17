'use client';

import React, { memo } from 'react';
import { Card, Typography } from 'antd';

const { Text, Title } = Typography;

const MetricCard = memo(function MetricCard({ title, value, icon, color, loading, suffix }) {
  return (
    <Card
      loading={loading}
      className='overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md'
      bodyStyle={{ padding: '24px' }}
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <Text className='text-[11px] font-black tracking-widest text-slate-400 uppercase'>
            {title}
          </Text>
          <div className='flex items-baseline gap-2'>
            <Title level={2} className='m-0 text-3xl font-black text-slate-800'>
              {value}
            </Title>
            {suffix && <Text className='text-xs font-bold text-slate-400'>{suffix}</Text>}
          </div>
        </div>

        <div
          className='flex size-14 items-center justify-center rounded-2xl text-2xl shadow-inner transition-transform'
          style={{
            backgroundColor: `${color}10`,
            color: color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
});

export default MetricCard;

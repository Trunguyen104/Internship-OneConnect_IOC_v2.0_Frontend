'use client';

import dayjs from 'dayjs';
import { Typography, Tag } from 'antd';

const { Title, Text, Paragraph } = Typography;

const STATUS_PROJECT_CONFIG = {
  1: { label: 'In Progress', color: 'orange' },
  2: { label: 'Pending', color: 'blue' },
  3: { label: 'Completed', color: 'green' },
  4: { label: 'Closed', color: 'red' },
};

export default function ProjectOverview({ project }) {
  if (!project) {
    return (
      <div
        className={
          'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-20'
        }
      >
        <Title level={5} className={'!text-slate-400'}>
          {'Project information not found'}
        </Title>
      </div>
    );
  }

  const statusInfo = STATUS_PROJECT_CONFIG[project.status] || {
    label: project.status,
    color: 'default',
  };

  return (
    <div className={'space-y-10'}>
      {/* Top Grid Info */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='col-span-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:col-span-2'>
          <Text
            type={'secondary'}
            className={'mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'}
          >
            {'Project Name'}
          </Text>
          <Text
            strong
            className={'block truncate text-lg leading-tight text-slate-800'}
            title={project?.projectName}
          >
            {project?.projectName}
          </Text>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
          <Text
            type={'secondary'}
            className={'mb-2 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'}
          >
            {'Status'}
          </Text>
          <Tag
            color={statusInfo.color}
            className={
              'bg-opacity-10 rounded-md border-none px-3 py-0.5 text-[11px] font-bold uppercase'
            }
          >
            {statusInfo.label}
          </Tag>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
          <Text
            type={'secondary'}
            className={'mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'}
          >
            {'Timeline'}
          </Text>
          <div className={'flex flex-col'}>
            <Text className={'text-xs font-medium text-slate-600'}>
              {project?.startDate ? dayjs(project.startDate).format('DD/MM/YYYY') : '—'}
              <span className={'mx-1 text-slate-300'}>{'to'}</span>
              {project?.endDate ? dayjs(project.endDate).format('DD/MM/YYYY') : '—'}
            </Text>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <section className='rounded-2xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8'>
          <div className='mb-6 flex items-center gap-4'>
            <div className='bg-primary h-8 w-1.5 rounded-full' />
            <Title level={4} className='!m-0 !text-xl !font-bold !text-slate-800'>
              Project Description
            </Title>
          </div>
          <Paragraph className='text-[15px] leading-relaxed text-slate-600'>
            {project?.description || 'No detailed description available for this project.'}
          </Paragraph>
        </section>
      </div>
    </div>
  );
}

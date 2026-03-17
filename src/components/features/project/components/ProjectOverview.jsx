'use client';

import dayjs from 'dayjs';
import { Typography, Tag, Empty } from 'antd';

import { PROJECT_UI } from '@/constants/project/uiText';

const { Title, Text, Paragraph } = Typography;

const STATUS_PROJECT_CONFIG = {
  1: { label: PROJECT_UI.STATUS_LABELS.PLANNING, color: 'info' },
  2: { label: PROJECT_UI.STATUS_LABELS.IN_PROGRESS, color: 'warning' },
  3: { label: PROJECT_UI.STATUS_LABELS.DONE, color: 'success' },
  4: { label: PROJECT_UI.STATUS_LABELS.CANCELLED, color: 'danger' },
};

export default function ProjectOverview({ project }) {
  if (!project) {
    return (
      <div className='flex min-h-[400px] flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-20'>
        <Empty description={PROJECT_UI.EMPTY.NO_PROJECT} />
      </div>
    );
  }

  const statusInfo = STATUS_PROJECT_CONFIG[project.status] || {
    label: project.status,
    color: 'default',
  };

  return (
    <div className={'space-y-10'}>
      <div className='w-full overflow-x-auto pb-4'>
        <div className='grid min-w-[600px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='col-span-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:col-span-2'>
            <Text
              type={'secondary'}
              className={
                'mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'
              }
            >
              {PROJECT_UI.LABELS.NAME}
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
              className={
                'mb-2 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'
              }
            >
              {PROJECT_UI.LABELS.STATUS}
            </Text>
            <Tag
              style={{
                backgroundColor: `var(--color-${statusInfo.color}-surface, var(--color-bg))`,
                color: `var(--color-${statusInfo.color})`,
              }}
              className={
                'min-w-[100px] rounded-full border-none py-1 text-center text-[10px] font-black tracking-widest uppercase shadow-sm'
              }
            >
              {statusInfo.label}
            </Tag>
          </div>

          <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm'>
            <Text
              type={'secondary'}
              className={
                'mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase'
              }
            >
              {PROJECT_UI.LABELS.TIMELINE}
            </Text>
            <div className={'flex flex-col'}>
              <Text className={'text-xs font-medium text-slate-600'}>
                {project?.startDate ? dayjs(project.startDate).format('DD/MM/YYYY') : '—'}
                <span className={'mx-1 text-slate-300'}>{PROJECT_UI.LABELS.TO}</span>
                {project?.endDate ? dayjs(project.endDate).format('DD/MM/YYYY') : '—'}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <section className='rounded-2xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8'>
          <div className='mb-6 flex items-center gap-4'>
            <Title level={4} className='!m-0 !text-xl !font-bold !text-slate-800'>
              {PROJECT_UI.LABELS.DESCRIPTION}
            </Title>
          </div>
          <Paragraph className='text-[15px] leading-relaxed text-slate-600'>
            {project?.description || PROJECT_UI.EMPTY.NO_DESCRIPTION}
          </Paragraph>
        </section>
      </div>
    </div>
  );
}

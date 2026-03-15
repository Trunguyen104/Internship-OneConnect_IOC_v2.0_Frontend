'use client';

import React, { memo } from 'react';
import dayjs from 'dayjs';
import { Typography, Tag, Divider } from 'antd';
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SolutionOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import Card from '@/components/ui/Card';

const { Title, Text, Paragraph } = Typography;

const STATUS_PROJECT_CONFIG = {
  1: {
    label: 'Đang triển khai',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  2: { label: 'Đang chờ', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
  3: {
    label: 'Đã hoàn thành',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  4: { label: 'Đã đóng', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600' },
};

const ProjectOverview = memo(function ProjectOverview({ project }) {
  if (!project) {
    return (
      <Card className='flex flex-col items-center justify-center border-dashed py-20'>
        <InfoCircleOutlined className='text-muted mb-4 text-5xl' />
        <Title level={5} className='text-muted'>
          Không tìm thấy thông tin dự án
        </Title>
      </Card>
    );
  }

  const statusInfo = STATUS_PROJECT_CONFIG[project.status] || {
    label: project.status,
    color: 'default',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='bg-surface border-border overflow-hidden rounded-2xl border p-0 shadow-sm'>
        {/* Header Section */}
        <div className='bg-muted/5 border-border flex items-center justify-between border-b px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex size-10 items-center justify-center rounded-xl'>
              <ProjectOutlined className='text-primary text-xl' />
            </div>
            <div>
              <Title level={5} className='text-text !m-0'>
                Tổng quan dự án
              </Title>
              <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                Overview
              </Text>
            </div>
          </div>
          <Tag
            color={statusInfo.color}
            variant='filled'
            className='m-0 rounded-full px-4 py-1 text-[11px] font-bold tracking-wider uppercase'
          >
            {statusInfo.label}
          </Tag>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Project Name */}
            <div className='space-y-2 md:col-span-2'>
              <div className='flex items-center gap-2'>
                <FileTextOutlined className='text-primary' />
                <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                  Tên dự án
                </Text>
              </div>
              <Title level={4} className='text-text !m-0 leading-tight'>
                {project?.projectName}
              </Title>
            </div>

            {/* Timeline */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <ClockCircleOutlined className='text-primary' />
                <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                  Thời gian
                </Text>
              </div>
              <div className='bg-muted/5 border-border flex items-center gap-3 rounded-xl border px-4 py-2'>
                <div className='flex flex-col'>
                  <Text className='text-muted text-[10px] font-bold uppercase'>Bắt đầu</Text>
                  <Text className='text-text text-sm font-bold'>
                    {project?.startDate ? dayjs(project.startDate).format('DD/MM/YYYY') : '—'}
                  </Text>
                </div>
                <div className='bg-border h-8 w-px' />
                <div className='flex flex-col'>
                  <Text className='text-muted text-[10px] font-bold uppercase'>Kết thúc</Text>
                  <Text className='text-text text-sm font-bold'>
                    {project?.endDate ? dayjs(project.endDate).format('DD/MM/YYYY') : '—'}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <Divider className='border-border my-8' />

          {/* Description */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <SolutionOutlined className='text-primary' />
              <Text className='text-muted text-[10px] font-bold tracking-widest uppercase'>
                Mô tả chi tiết
              </Text>
            </div>
            <div className='bg-muted/5 border-border relative rounded-2xl border p-6'>
              <Paragraph className='text-text mb-0 text-[16px] leading-relaxed font-medium'>
                {project?.description || 'Không có mô tả chi tiết cho dự án này.'}
              </Paragraph>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

export default ProjectOverview;

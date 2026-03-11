'use client';

import React from 'react';
import { Typography } from 'antd';
import { UserOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

const { Title } = Typography;

export default function GroupInfoCard({ groupDetail }) {
  if (!groupDetail) return null;

  // const getStatusConfig = (status) => {
  //   if (status === 'Completed') {
  //     return {
  //       label: STUDENT_LIST_UI.GROUP_STATUS.COMPLETED,
  //       style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  //     };
  //   }
  //   if (status === 'InProgress' || status === 'Active') {
  //     return {
  //       label: STUDENT_LIST_UI.GROUP_STATUS.ACTIVE,
  //       style: 'bg-blue-50 text-blue-700 border-blue-200',
  //     };
  //   }
  //   return {
  //     label: STUDENT_LIST_UI.GROUP_STATUS.INITIALIZING,
  //     style: 'bg-orange-50 text-orange-700 border-orange-200',
  //   };
  // };
  const GROUP_STATUS_MAP = {
    1: {
      label: 'Registered',
      style: 'bg-gray-50 text-gray-700 border-gray-200',
    },
    2: {
      label: 'Onboarded',
      style: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    3: {
      label: 'In Progress',
      style: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    4: {
      label: 'Completed',
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    5: {
      label: 'Failed',
      style: 'bg-red-50 text-red-700 border-red-200',
    },
  };
  // const status = getStatusConfig(groupDetail.status);
  const status = GROUP_STATUS_MAP[groupDetail.status] || {
    label: 'Unknown',
    style: 'bg-gray-50 text-gray-500 border-gray-200',
  };

  return (
    <div className='mb-6 overflow-hidden rounded-[18px] border border-gray-200/60 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:border-gray-200 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col items-start justify-between gap-6 border-b border-gray-100 bg-gray-50/30 px-8 py-6 md:flex-row md:items-center'>
        <div className='flex items-start gap-5'>
          <div>
            <Title level={3} className='!mb-1.5 !font-bold tracking-tight text-gray-900'>
              {groupDetail.groupName || STUDENT_LIST_UI.DEFAULT.UNNAMED_GROUP}
            </Title>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium text-gray-500'>
              <span className='flex items-center gap-1.5'>
                <BankOutlined className='text-gray-400' />
                {groupDetail.enterpriseName || STUDENT_LIST_UI.DEFAULT.ENTERPRISE}
              </span>
              <span className='h-1 w-1 rounded-full bg-gray-300'></span>
              <span className='flex items-center gap-1.5'>
                <UserOutlined className='text-gray-400' />
                Mentor:{' '}
                <span className='text-gray-700'>
                  {groupDetail.mentorName || STUDENT_LIST_UI.DEFAULT.NA}
                </span>
              </span>
              <span className='h-1 w-1 rounded-full bg-gray-300'></span>
              <span className='flex items-center gap-1.5'>
                <CalendarOutlined className='text-gray-400' />
                {groupDetail.startDate
                  ? new Date(groupDetail.startDate).toLocaleDateString('en-GB')
                  : STUDENT_LIST_UI.DEFAULT.NA}{' '}
                -{' '}
                {groupDetail.endDate
                  ? new Date(groupDetail.endDate).toLocaleDateString('en-GB')
                  : STUDENT_LIST_UI.DEFAULT.NA}
              </span>
            </div>
          </div>
        </div>
        <div className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${status.style}`}>
          {status.label}
        </div>
      </div>
    </div>
  );
}


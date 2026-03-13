'use client';

// import AppTable from '@/components/shared/AppTable';
import { Button, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppTable from '@/components/ui/AppTable';

const { Text } = Typography;

const STATUS_CONFIG = {
  0: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  1: {
    label: 'Ongoing',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  2: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  ONGOING: {
    label: 'Ongoing',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  UPCOMING: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  const columns = [
    {
      title: '#',
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <Text type='secondary' className='text-xs font-medium'>
          {(page - 1) * pageSize + index + 1}
        </Text>
      ),
    },
    {
      title: 'Evaluation Cycle',
      dataIndex: 'name',
      width: 280,
      render: (text) => <Text className='font-bold tracking-tight text-slate-800'>{text}</Text>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: 140,
      render: (date) => (
        <Text className='text-sm text-slate-600'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      width: 140,
      render: (date) => (
        <Text className='text-sm text-slate-600'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (status) => {
        const normalized = status ? String(status).toUpperCase() : '';
        const cfg = STATUS_CONFIG[normalized] ||
          STATUS_CONFIG[status] || {
            label: status || 'Unknown',
            bg: 'bg-slate-50',
            text: 'text-slate-600',
            icon: null,
          };

        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}
          >
            {cfg.icon}
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'Scored',
      width: 120,
      render: (_, record) => (
        <Text className='font-bold text-slate-700'>
          {record.totalStudentsScored ?? 0}
          <span className='mx-0.5 font-normal text-slate-300'>/</span>
          {record.totalTeamStudents ?? 0}
        </Text>
      ),
    },
    {
      title: 'Actions',
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          size='small'
          icon={<EyeOutlined />}
          onClick={() => onDetail(record)}
          className='rounded-full border-none bg-[#d52020] font-bold shadow-sm shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
        />
      ),
    },
  ];

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='cycleId'
        pagination={false}
        emptyText='No evaluation data'
      />
    </div>
  );
}

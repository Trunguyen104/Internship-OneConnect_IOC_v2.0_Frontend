'use client';

import AppTable from '@/shared/components/AppTable';
import { Button, Typography } from 'antd';
import { ClockCircleFilled, CheckCircleFilled, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const getStatusConfig = (status) => {
  // ... existing status logic ...
  switch (status) {
    case 'ONGOING':
      return {
        label: 'Đang diễn ra',
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        dot: <ClockCircleFilled className='text-blue-500' />,
      };
    case 'UPCOMING':
      return {
        label: 'Sắp diễn ra',
        color: 'orange',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        dot: <ClockCircleFilled className='text-orange-500' />,
      };
    case 'COMPLETED':
      return {
        label: 'Đã kết thúc',
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        dot: <CheckCircleFilled className='text-green-500' />,
      };
    default:
      return {
        label: 'Unknown',
        color: 'default',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-600',
        dot: null,
      };
  }
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  const columns = [
    {
      title: 'STT',
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
      key: 'name',
      width: 280,
      render: (text) => <span className='font-bold tracking-tight text-slate-800'>{text}</span>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 140,
      render: (date) => (
        <Text className='text-sm text-slate-600'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'End Time',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 140,
      render: (date) => (
        <Text className='text-sm text-slate-600'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        const statusCfg = getStatusConfig(status);
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusCfg.bgColor} ${statusCfg.textColor} whitespace-nowrap`}
          >
            {statusCfg.dot}
            {statusCfg.label}
          </span>
        );
      },
    },
    {
      title: 'Scored',
      key: 'scored',
      width: 120,
      render: (_, record) => (
        <Text className='font-bold text-slate-700'>
          {record.totalStudentsScored} <span className='mx-0.5 font-normal text-slate-300'>/</span>{' '}
          {record.totalTeamStudents}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          icon={<EyeOutlined />}
          className='rounded-full border-none bg-[#d52020] font-bold shadow-sm shadow-[#d52020]/20 transition-all hover:!bg-[#d52020]/90'
          onClick={() => onDetail(record)}
        >
          Chi Tiết
        </Button>
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

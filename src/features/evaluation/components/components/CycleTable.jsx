'use client';

// import AppTable from '@/components/shared/AppTable';
import { Button, Typography } from 'antd';
import { ClockCircleFilled, CheckCircleFilled, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppTable from '@/components/ui/AppTable';

const { Text } = Typography;

const STATUS_CONFIG = {
  ONGOING: {
    label: 'Đang diễn ra',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: <ClockCircleFilled className='text-blue-500' />,
  },
  UPCOMING: {
    label: 'Sắp diễn ra',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    icon: <ClockCircleFilled className='text-orange-500' />,
  },
  COMPLETED: {
    label: 'Đã kết thúc',
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: <CheckCircleFilled className='text-green-500' />,
  },
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
      width: 280,
      render: (text) => <Text className='font-bold tracking-tight text-slate-800'>{text}</Text>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startDate',
      width: 140,
      render: (date) => (
        <Text className='text-sm text-slate-600'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: 'End Time',
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
        const cfg = STATUS_CONFIG[status] || {
          label: 'Unknown',
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
          {record.totalStudentsScored}
          <span className='mx-0.5 font-normal text-slate-300'>/</span>
          {record.totalTeamStudents}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          icon={<EyeOutlined />}
          onClick={() => onDetail(record)}
          className='rounded-full border-none bg-[#d52020] font-bold shadow-sm shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
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

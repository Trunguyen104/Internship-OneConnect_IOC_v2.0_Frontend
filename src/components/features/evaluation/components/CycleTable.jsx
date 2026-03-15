'use client';

// import AppTable from '@/components/shared/AppTable';
import { Button, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppTable from '@/components/ui/AppTable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

const { Text } = Typography;

const STATUS_CONFIG = {
  0: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  1: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
  },
  2: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
  },
  ONGOING: {
    label: EVALUATION_UI.STATUS.ONGOING,
    bg: 'bg-info-surface',
    text: 'text-info',
  },
  UPCOMING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  PENDING: {
    label: EVALUATION_UI.STATUS.PENDING,
    bg: 'bg-warning-surface',
    text: 'text-warning',
  },
  COMPLETED: {
    label: EVALUATION_UI.STATUS.COMPLETED,
    bg: 'bg-success-surface',
    text: 'text-success',
  },
};

export default function CycleTable({ data, page, pageSize, onDetail }) {
  const columns = [
    {
      title: EVALUATION_UI.TABLE_COLUMNS.STT,
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <Text type='secondary' className='text-xs font-medium'>
          {(page - 1) * pageSize + index + 1}
        </Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.CYCLE,
      dataIndex: 'name',
      width: 280,
      render: (text) => <Text className='text-text font-bold tracking-tight'>{text}</Text>,
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.START_DATE,
      dataIndex: 'startDate',
      width: 140,
      render: (date) => (
        <Text className='text-muted-foreground text-sm'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.END_DATE,
      dataIndex: 'endDate',
      width: 140,
      render: (date) => (
        <Text className='text-muted-foreground text-sm'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.STATUS,
      dataIndex: 'status',
      width: 150,
      render: (status) => {
        const normalized = status ? String(status).toUpperCase() : '';
        const cfg = STATUS_CONFIG[normalized] ||
          STATUS_CONFIG[status] || {
            label: status || EVALUATION_UI.STATUS.UNKNOWN,
            bg: 'bg-muted',
            text: 'text-muted-foreground',
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
      title: EVALUATION_UI.TABLE_COLUMNS.SCORED,
      width: 120,
      render: (_, record) => (
        <Text className='text-text font-bold'>
          {record.totalStudentsScored ?? 0}
          <span className='text-muted mx-0.5 font-normal'>/</span>
          {record.totalTeamStudents ?? 0}
        </Text>
      ),
    },
    {
      title: EVALUATION_UI.TABLE_COLUMNS.ACTIONS,
      align: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          size='small'
          icon={<EyeOutlined />}
          onClick={() => onDetail(record)}
          className='bg-primary shadow-primary/20 hover:!bg-primary/90 rounded-full border-none font-bold shadow-sm'
        />
      ),
    },
  ];

  return (
    <div className='border-border/60 bg-bg overflow-hidden rounded-xl border shadow-sm'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='cycleId'
        pagination={false}
        emptyText={EVALUATION_UI.LABELS.NO_DATA}
      />
    </div>
  );
}

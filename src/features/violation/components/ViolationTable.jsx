'use client';

// import AppTable from '@/components/shared/AppTable';
import { Typography, Tag } from 'antd';
import { WarningOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AppTable from '@/components/ui/AppTable';

const { Text } = Typography;

export default function ViolationTable({ data, page, pageSize, sortOrder, onSort }) {
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
      title: 'Violation Type',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (text) => (
        <span className='flex items-center gap-2 font-bold tracking-tight text-slate-800'>
          <WarningOutlined className='text-amber-500' />
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <Text className='text-sm text-slate-600 italic' ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Violation Time',
      dataIndex: 'violationTime',
      key: 'violationTime',
      width: 180,
      render: (date) => (
        <Text className='text-xs font-medium text-slate-500'>
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </Text>
      ),
    },
    {
      title: 'Reporter',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 150,
      render: (text) => (
        <Tag color='cyan' className='rounded-full border-none px-3 text-[10px] font-bold uppercase'>
          {text}
        </Tag>
      ),
    },
    {
      title: (
        <div
          className='flex cursor-pointer items-center gap-1 transition-colors hover:text-blue-600'
          onClick={onSort}
        >
          Created Date
          <div className='flex flex-col text-[10px]'>
            <CaretUpOutlined className={sortOrder === 'asc' ? 'text-blue-600' : 'text-slate-300'} />
            <CaretDownOutlined
              className={sortOrder === 'desc' ? 'text-blue-600' : 'text-slate-300'}
            />
          </div>
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Text className='text-sm font-bold text-slate-800'>{dayjs(date).format('DD/MM/YYYY')}</Text>
      ),
    },
  ];

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm'>
      <AppTable
        columns={columns}
        data={data}
        rowKey='id'
        pagination={false}
        emptyText='No violations recorded'
      />
    </div>
  );
}

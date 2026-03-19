'use client';

import { Table, Empty, Skeleton } from 'antd';

export default function AppTable({
  columns,
  data,
  loading = false,
  rowKey = 'id',
  pagination,
  onChange,
  scroll = { x: 800 },
  emptyText = 'No data',
}) {
  if (loading) {
    return (
      <div className='p-6'>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      pagination={pagination}
      onChange={onChange}
      scroll={scroll}
      rowClassName='hover:bg-gray-50/50 transition-colors'
      locale={{
        emptyText: (
          <div className='py-10'>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className='font-medium text-gray-400'>{emptyText}</span>}
            />
          </div>
        ),
      }}
    />
  );
}

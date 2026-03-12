'use client';
import React, { useMemo, memo } from 'react';
import { Table, Tag, Space, Button, Dropdown, Typography } from 'antd';
import { EyeOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const STATUS_CONFIG = {
  0: { color: 'default', label: 'Bản nháp' },
  1: { color: 'green', label: 'Đang mở' },
  2: { color: 'red', label: 'Đã đóng' },
};

const TermTable = memo(function TermTable({
  data,
  loading,
  pagination,
  onEdit,
  onRequestDelete,
  onRequestChangeStatus,
}) {
  const columns = useMemo(
    () => [
      {
        title: 'TÊN KỲ',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <Text strong>{text}</Text>,
      },
      {
        title: 'NGÀY BẮT ĐẦU',
        dataIndex: 'startDate',
        key: 'startDate',
        width: 160,
        render: (val) => dayjs(val).format('DD/MM/YYYY'),
      },
      {
        title: 'NGÀY KẾT THÚC',
        dataIndex: 'endDate',
        key: 'endDate',
        width: 160,
        render: (val) => dayjs(val).format('DD/MM/YYYY'),
      },
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (status) => {
          const config = STATUS_CONFIG[status];
          if (!config) return null;
          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
      {
        title: 'THAO TÁC',
        key: 'action',
        width: 120,
        align: 'center',
        render: (_, record) => {
          const isClosed = record.status === 2;
          const isDraft = record.status === 0;
          const isOpen = record.status === 1;

          const items = [];

          if (isDraft) {
            items.push({
              key: 'open',
              label: 'Mở kỳ thực tập',
              onClick: () => onRequestChangeStatus(record, 1),
            });
          }

          if (isOpen) {
            items.push({
              key: 'close',
              label: 'Đóng kỳ thực tập',
              onClick: () => onRequestChangeStatus(record, 2),
            });
          }

          items.push({
            key: 'delete',
            label: 'Xóa',
            danger: true,
            onClick: () => onRequestDelete(record),
          });

          return (
            <Space>
              {isClosed ? (
                <Button type='text' icon={<EyeOutlined />} disabled />
              ) : (
                <Button type='text' icon={<EditOutlined />} onClick={() => onEdit(record)} />
              )}

              <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
                <Button type='text' icon={<EllipsisOutlined />} />
              </Dropdown>
            </Space>
          );
        },
      },
    ],
    [onEdit, onRequestDelete, onRequestChangeStatus],
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey='termId'
      size='middle'
      scroll={{ x: true }}
      pagination={
        pagination !== false
          ? {
              ...pagination,
              showSizeChanger: false,
              showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} / ${total} kết quả`,
            }
          : false
      }
    />
  );
});

export default TermTable;

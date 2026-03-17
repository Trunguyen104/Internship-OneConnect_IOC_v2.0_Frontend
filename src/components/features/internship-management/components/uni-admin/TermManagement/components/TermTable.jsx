import React, { useMemo, memo } from 'react';
import { Tag, Button, Dropdown, Typography, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  EllipsisOutlined,
  CalendarOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import DataTable from '@/components/ui/DataTable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const STATUS_CONFIG = {
  0: { color: 'default', label: 'Bản nháp' },
  1: { color: 'success', label: 'Đang hoạt động' },
  2: { color: 'error', label: 'Đã hoàn thành' },
};

const TermTable = memo(function TermTable({
  data,
  loading,
  onEdit,
  onRequestDelete,
  onRequestChangeStatus,
}) {
  const { TABLE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: <span className='tracking-wider'>{TABLE.COLUMNS.NAME}</span>,
        key: 'name',
        width: '250px',
        render: (_, record) => (
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex size-9 items-center justify-center rounded-xl'>
              <CalendarOutlined className='text-primary text-lg' />
            </div>
            <span className='text-text text-sm font-bold'>{record.name}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.DURATION,
        key: 'duration',
        width: '250px',
        render: (_, record) => (
          <div className='flex items-center gap-2'>
            <Text className='bg-surface border-border text-muted rounded-lg border px-2 py-0.5 font-mono text-xs font-semibold'>
              {dayjs(record.startDate).format('DD/MM/YYYY')}
            </Text>
            <Text className='text-muted text-[10px]'>—</Text>
            <Text className='bg-surface border-border text-muted rounded-lg border px-2 py-0.5 font-mono text-xs font-semibold'>
              {dayjs(record.endDate).format('DD/MM/YYYY')}
            </Text>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_COUNT,
        key: 'studentCount',
        width: '150px',
        align: 'center',
        render: (_, record) => (
          <div className='flex items-center justify-center gap-2'>
            <SolutionOutlined className='text-muted text-xs' />
            <span className='text-text text-sm font-bold'>{record.studentCount || 0}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        key: 'status',
        width: '160px',
        align: 'center',
        render: (_, record) => {
          const config = STATUS_CONFIG[record.status] || STATUS_CONFIG[0];
          return (
            <Tag
              color={config.color}
              className='min-w-[110px] rounded-full border-none px-3 text-[10px] font-bold uppercase'
            >
              {config.label}
            </Tag>
          );
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'action',
        width: '120px',
        align: 'right',
        render: (_, record) => {
          const isClosed = record.status === 2;
          const isDraft = record.status === 0;
          const isOpen = record.status === 1;

          const items = [];

          if (isDraft) {
            items.push({
              key: 'open',
              label: <span className='font-semibold'>Mở kỳ thực tập</span>,
              onClick: () => onRequestChangeStatus(record, 1),
            });
          }

          if (isOpen) {
            items.push({
              key: 'close',
              label: <span className='font-semibold'>Đóng kỳ thực tập</span>,
              onClick: () => onRequestChangeStatus(record, 2),
            });
          }

          items.push({
            key: 'delete',
            label: <span className='font-semibold'>Xóa kỳ thực tập</span>,
            danger: true,
            onClick: () => onRequestDelete(record),
          });

          return (
            <div className='flex items-center justify-end gap-1'>
              <Tooltip title={isClosed ? 'Xem chi tiết (Khóa)' : 'Chỉnh sửa'}>
                <Button
                  type='text'
                  icon={isClosed ? <EyeOutlined /> : <EditOutlined />}
                  className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                  onClick={() => onEdit(record)}
                />
              </Tooltip>

              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement='bottomRight'
                overlayClassName='min-w-[180px] rounded-xl overflow-hidden shadow-xl border border-border'
              >
                <Button
                  type='text'
                  icon={<EllipsisOutlined className='text-xl' />}
                  className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [onEdit, onRequestDelete, onRequestChangeStatus, TABLE],
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='termId' minWidth='900px' />
  );
});

export default TermTable;

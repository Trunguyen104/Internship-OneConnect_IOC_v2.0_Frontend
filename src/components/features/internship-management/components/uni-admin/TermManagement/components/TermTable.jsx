import React, { memo } from 'react';
import { Tag, Button, Dropdown, Typography, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const STATUS_CONFIG = {
  0: { color: 'processing', label: 'Upcoming' },
  1: { color: 'success', label: 'Active' },
  2: { color: 'warning', label: 'Ended' },
  3: { color: 'error', label: 'Closed' },
  Upcoming: { color: 'processing', label: 'Upcoming' },
  Active: { color: 'success', label: 'Active' },
  Ended: { color: 'warning', label: 'Ended' },
  Closed: { color: 'error', label: 'Closed' },
};

const TermTable = memo(function TermTable({
  data,
  page,
  pageSize,
  onEdit,
  onRequestDelete,
  onRequestChangeStatus,
}) {
  const { TABLE } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT;

  return (
    <div className='mt-5 flex min-h-0 flex-1 flex-col'>
      <div className='flex-1 overflow-auto'>
        <table className='w-full min-w-[950px] table-fixed border-collapse text-left'>
          <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
            <tr>
              <th className='text-muted w-[60px] px-4 py-5 text-center text-xs font-semibold'>#</th>
              <th className='text-muted w-[250px] px-4 py-5 text-left text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.NAME}
              </th>
              <th className='text-muted w-[140px] px-4 py-5 text-center text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.START_DATE}
              </th>
              <th className='text-muted w-[140px] px-4 py-5 text-center text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.END_DATE}
              </th>
              <th className='text-muted w-[140px] px-4 py-5 text-center text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.STUDENT_COUNT}
              </th>
              <th className='text-muted w-[140px] px-4 py-5 text-center text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.STATUS}
              </th>
              <th className='text-muted w-[110px] px-4 py-5 text-right text-xs font-semibold whitespace-nowrap'>
                {TABLE.COLUMNS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className='divide-border/50 divide-y'>
            {data.map((record, index) => {
              const config = STATUS_CONFIG[record.status] || {
                color: 'default',
                label: record.status,
              };
              const isClosed = record.status === 'Closed' || record.status === 3;
              const isUpcoming = record.status === 'Upcoming' || record.status === 0;
              const isActive = record.status === 'Active' || record.status === 1;

              const items = [];
              if (isActive) {
                items.push({
                  key: 'close',
                  label: <span className='font-semibold'>Close Term</span>,
                  onClick: () => onRequestChangeStatus(record, 2), // 2 maps to Closed in TermStatus enum
                });
              }
              if (isUpcoming) {
                items.push({
                  key: 'delete',
                  label: <span className='font-semibold'>Delete Term</span>,
                  danger: true,
                  onClick: () => onRequestDelete(record),
                });
              }

              return (
                <tr key={record.termId} className='hover:bg-bg/80 h-[72px] transition-colors'>
                  <td className='text-muted px-4 py-4 text-center text-sm font-semibold'>
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className='px-4 py-4 text-left'>
                    <div className='flex items-center gap-3'>
                      <span className='text-text text-sm font-bold'>{record.name}</span>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <Text className='bg-surface border-border text-muted rounded-lg px-2 py-0.5 font-mono text-xs font-semibold'>
                      {dayjs(record.startDate).format('DD/MM/YYYY')}
                    </Text>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <Text className='bg-surface border-border text-muted rounded-lg px-2 py-0.5 font-mono text-xs font-semibold'>
                      {dayjs(record.endDate).format('DD/MM/YYYY')}
                    </Text>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <span className='text-text text-sm font-bold'>
                        {record.totalEnrolled || 0}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <div className='flex justify-center'>
                      <Tag
                        bordered={false}
                        color={config.color}
                        className='bg-transparent px-0 text-[10px] font-bold uppercase'
                      >
                        {config.label}
                      </Tag>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Tooltip title={isClosed ? 'View Details (Locked)' : 'Edit Term'}>
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
                        disabled={items.length === 0}
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default TermTable;

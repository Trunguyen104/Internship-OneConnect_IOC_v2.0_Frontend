import React, { memo } from 'react';
import { Button, Tooltip, Empty } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

const StakeholderList = memo(function StakeholderList({
  stakeholders,
  loading,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='border-muted h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-r-transparent'></div>
        </div>
      ) : !stakeholders || stakeholders.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <Empty description={STAKEHOLDER_UI.EMPTY_TITLE} />
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='border-border bg-bg sticky top-0 z-10 border-b'>
                <tr>
                  <th className='text-muted w-[60px] px-6 py-5 text-xs font-semibold'>
                    {STAKEHOLDER_UI.TABLE_NO}
                  </th>
                  <th className='text-muted w-[300px] px-6 py-5 text-xs font-semibold'>
                    {STAKEHOLDER_UI.FIELD_NAME}
                  </th>
                  <th className='text-muted px-6 py-5 text-xs font-semibold'>
                    {STAKEHOLDER_UI.FIELD_ROLE}
                  </th>
                  <th className='text-muted px-6 py-5 text-xs font-semibold'>
                    {STAKEHOLDER_UI.FIELD_EMAIL}
                  </th>
                  <th className='text-muted w-[180px] px-6 py-5 text-xs font-semibold'>
                    {STAKEHOLDER_UI.FIELD_PHONE}
                  </th>
                  <th className='text-muted px-6 py-5 text-right text-xs font-semibold'>
                    {STAKEHOLDER_UI.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-border/50 divide-y'>
                {stakeholders.map((record, index) => (
                  <tr key={record.id} className='hover:bg-bg/80 h-[72px] transition-colors'>
                    <td className='px-6 py-4'>
                      <span className='text-muted text-xs text-[13px] font-semibold'>
                        {(page - 1) * pageSize + index + 1}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='text-text text-[15px] font-bold'>{record.name}</span>
                        {record.description && (
                          <span className='text-muted mt-0.5 line-clamp-1 text-[13px]'>
                            {record.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-primary text-[11px] font-bold'>
                        {record.role || STAKEHOLDER_UI.NO_ROLE}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-text text-sm font-medium'>{record.email}</span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-text text-sm font-medium'>
                        {record.phoneNumber || '—'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Tooltip title={STAKEHOLDER_UI.EDIT_BUTTON}>
                          <Button
                            type='text'
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            className='text-muted hover:bg-primary-surface hover:text-primary flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                        <Tooltip title={STAKEHOLDER_UI.DELETE_BUTTON}>
                          <Button
                            type='text'
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              showDeleteConfirm({
                                title: STAKEHOLDER_UI.DELETE_TITLE,
                                content: STAKEHOLDER_UI.DELETE_CONFIRM,
                                onOk: () => onDelete(record.id),
                              })
                            }
                            className='hover:bg-danger-surface flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export default StakeholderList;

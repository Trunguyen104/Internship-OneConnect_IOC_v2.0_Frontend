import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

const StakeholderList = memo(function StakeholderList({
  stakeholders,
  loading,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: STAKEHOLDER_UI.TABLE_NO,
      key: 'no',
      width: '80px',
      render: (_, __, index) => (
        <span className="text-muted text-[13px] font-semibold">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_NAME,
      key: 'name',
      width: '300px',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-text text-[15px] font-bold">{record.name}</span>
          {record.description && (
            <span className="text-muted mt-0.5 line-clamp-1 text-[13px] font-medium opacity-60">
              {record.description}
            </span>
          )}
        </div>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_ROLE,
      key: 'role',
      render: (role) => (
        <span className="text-primary text-[11px] font-black uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
          {role || STAKEHOLDER_UI.NO_ROLE}
        </span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_EMAIL,
      key: 'email',
      render: (email) => <span className="text-text text-sm font-medium">{email}</span>,
    },
    {
      title: STAKEHOLDER_UI.FIELD_PHONE,
      key: 'phoneNumber',
      width: '180px',
      render: (phone) => <span className="text-text text-sm font-medium">{phone || '—'}</span>,
    },
    {
      title: STAKEHOLDER_UI.ACTIONS,
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1 px-2">
          <Tooltip title={STAKEHOLDER_UI.EDIT_BUTTON}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(record)}
              className="size-9 rounded-xl text-muted/60 transition-all hover:bg-primary/5 hover:text-primary active:scale-90"
            >
              <EditOutlined className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip title={STAKEHOLDER_UI.DELETE_BUTTON}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                showDeleteConfirm({
                  title: STAKEHOLDER_UI.DELETE_TITLE,
                  content: STAKEHOLDER_UI.DELETE_CONFIRM,
                  onOk: () => onDelete(record.id),
                })
              }
              className="size-9 rounded-xl text-muted/40 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
            >
              <DeleteOutlined className="size-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={stakeholders}
      loading={loading}
      emptyText={STAKEHOLDER_UI.EMPTY_TITLE}
    />
  );
});

export default StakeholderList;

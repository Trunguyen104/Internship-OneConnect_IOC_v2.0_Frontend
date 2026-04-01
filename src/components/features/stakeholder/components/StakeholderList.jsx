import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { memo } from 'react';

import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { TABLE_CELL } from '@/lib/tableStyles';

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
        <span className={TABLE_CELL.rowIndex}>{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_NAME,
      key: 'name',
      width: '300px',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className={TABLE_CELL.title}>{record.name}</span>
          {record.description && (
            <span className={`${TABLE_CELL.subtitle} mt-0.5 line-clamp-1 opacity-80`}>
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
        <span className="border-primary/10 bg-primary/5 text-primary rounded-lg border px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
          {role || STAKEHOLDER_UI.NO_ROLE}
        </span>
      ),
    },
    {
      title: STAKEHOLDER_UI.FIELD_EMAIL,
      key: 'email',
      render: (email) => <span className={TABLE_CELL.secondary}>{email}</span>,
    },
    {
      title: STAKEHOLDER_UI.FIELD_PHONE,
      key: 'phoneNumber',
      width: '180px',
      render: (phone) => <span className={TABLE_CELL.secondary}>{phone || '—'}</span>,
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '48px',
      render: (_, record) => {
        const items = [
          {
            key: 'edit',
            label: STAKEHOLDER_UI.EDIT_BUTTON,
            icon: <EditOutlined />,
            onClick: () => onEdit(record),
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: STAKEHOLDER_UI.DELETE_BUTTON,
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () =>
              showDeleteConfirm({
                title: STAKEHOLDER_UI.DELETE_TITLE,
                content: STAKEHOLDER_UI.DELETE_CONFIRM,
                onOk: () => onDelete(record.id),
              }),
          },
        ];

        return (
          <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
            <TableRowDropdown items={items} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={stakeholders}
        loading={loading}
        emptyText={STAKEHOLDER_UI.EMPTY_TITLE}
        minWidth="auto"
      />
    </div>
  );
});

export default StakeholderList;

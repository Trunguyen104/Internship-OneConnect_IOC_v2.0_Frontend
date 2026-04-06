'use client';

import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import DataTable from '@/components/ui/datatable';
import StatusBadge from '@/components/ui/status-badge';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import CriteriaSettings from './CriteriaSettings';

export default function CycleList({
  cycles,
  loading,
  onOpenGrading,
  onEdit,
  onDelete,
  isTermOngoing,
  isTermPast,
}) {
  const { TABLE_COLUMNS, BUTTONS, STATUS, LABELS } = EVALUATION_UI;
  const [modalType, setModalType] = useState(null); // 'criteria'
  const [selectedItem, setSelectedItem] = useState(null);

  const columns = [
    {
      title: TABLE_COLUMNS.CYCLE,
      key: 'name',
      width: '160px',
      render: (text) => (
        <span className="block truncate font-bold" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: TABLE_COLUMNS.START_DATE,
      key: 'startDate',
      width: '120px',
      render: (text) => new Date(text).toLocaleDateString('en-GB'),
    },
    {
      title: TABLE_COLUMNS.END_DATE,
      key: 'endDate',
      width: '120px',
      render: (text) => new Date(text).toLocaleDateString('en-GB'),
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE_COLUMNS.STATUS}
        </span>
      ),
      key: 'status',
      align: 'center',
      width: '140px',
      render: (status) => {
        // Handle both numeric (0,1,2) and string ("Pending", "Grading", "Completed") statuses
        const statusMap = {
          0: { label: STATUS.UPCOMING, variant: 'neutral' },
          Pending: { label: STATUS.UPCOMING, variant: 'neutral' },
          1: { label: STATUS.ONGOING, variant: 'info' },
          Grading: { label: STATUS.ONGOING, variant: 'info' },
          Ongoing: { label: STATUS.ONGOING, variant: 'info' },
          2: { label: STATUS.COMPLETED, variant: 'success' },
          Completed: { label: STATUS.COMPLETED, variant: 'success' },
        };

        const config = statusMap[status] || { label: STATUS.UNKNOWN, variant: 'neutral' };

        return <StatusBadge variant={config.variant} label={config.label} />;
      },
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE_COLUMNS.ACTIONS}
        </span>
      ),
      key: 'actions',
      align: 'center',
      width: '80px',
      render: (_, record) => {
        const isCompleted = record.status === 2;
        const isDisabled = isTermPast || isCompleted;

        const menuItems = [
          {
            key: 'grade',
            label: BUTTONS.QUICK_GRADE,
            icon: <ThunderboltOutlined />,
            disabled: record.status === 0 || (record.status === 1 && !isTermOngoing),
            onClick: () => onOpenGrading(record),
          },
          {
            key: 'criteria',
            label: BUTTONS.CRITERIA,
            icon: <SettingOutlined />,
            onClick: () => {
              setSelectedItem(record);
              setModalType('criteria');
            },
          },
        ];

        if (!isDisabled) {
          menuItems.push(
            { type: 'divider' },
            {
              key: 'edit',
              label: BUTTONS.EDIT,
              icon: <EditOutlined />,
              onClick: () => onEdit(record),
            },
            {
              key: 'delete',
              label: BUTTONS.DELETE,
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => onDelete(record.cycleId),
            }
          );
        }

        return (
          <div className="flex justify-center">
            <TableRowDropdown items={menuItems} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <DataTable
        columns={columns}
        data={cycles}
        loading={loading}
        emptyText={LABELS.NO_CYCLES}
        rowKey="cycleId"
      />

      {/* Criteria Modal */}
      {modalType === 'criteria' && (
        <CriteriaSettings cycle={selectedItem} open={true} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}

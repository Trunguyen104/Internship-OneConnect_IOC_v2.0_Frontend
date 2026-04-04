'use client';

import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
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
        const labels = [STATUS.UPCOMING, STATUS.ONGOING, STATUS.COMPLETED];
        const variants = ['info', 'primary', 'success'];

        return (
          <StatusBadge
            variant={variants[status] || 'neutral'}
            label={labels[status] || STATUS.UNKNOWN}
          />
        );
      },
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE_COLUMNS.MANAGEMENT}
        </span>
      ),
      key: 'management',
      align: 'right',
      width: '240px',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenGrading(record)}
            disabled={record.status !== 1 || !isTermOngoing}
            className="rounded-full h-9 px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <ThunderboltOutlined className="text-xs" /> {BUTTONS.QUICK_GRADE}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={record.status == null} // Always show criteria unless error
            onClick={() => {
              setSelectedItem(record);
              setModalType('criteria');
            }}
            className="rounded-full h-9 px-6 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-muted/60"
          >
            <SettingOutlined className="text-xs" /> {BUTTONS.CRITERIA}
          </Button>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      align: 'center',
      width: '60px',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'edit',
            label: BUTTONS.EDIT,
            icon: <EditOutlined />,
            disabled: isTermPast,
            onClick: () => onEdit(record),
          },
          {
            key: 'delete',
            label: BUTTONS.DELETE,
            icon: <DeleteOutlined />,
            danger: true,
            disabled: isTermPast,
            onClick: () => onDelete(record.cycleId),
          },
        ];

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

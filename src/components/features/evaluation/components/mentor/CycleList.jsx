'use client';

import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
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
      render: (text) => <span className="font-bold">{text}</span>,
    },
    {
      title: TABLE_COLUMNS.START_DATE,
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString('en-GB'),
    },
    {
      title: TABLE_COLUMNS.END_DATE,
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString('en-GB'),
    },
    {
      title: TABLE_COLUMNS.STATUS,
      key: 'status',
      align: 'center',
      render: (status) => {
        const labels = [STATUS.UPCOMING, STATUS.ONGOING, STATUS.COMPLETED];
        const variants = ['blue', 'green', 'gray'];
        return (
          <Badge className="items-center" variant={variants[status]}>
            {labels[status] || STATUS.UNKNOWN}
          </Badge>
        );
      },
    },
    {
      title: TABLE_COLUMNS.ACTIONS,
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenGrading(record)}
            disabled={record.status !== 1 || !isTermOngoing}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
          >
            <ThunderboltOutlined /> {BUTTONS.QUICK_GRADE}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={record.status !== 1 || !isTermOngoing}
            onClick={() => {
              setSelectedItem(record);
              setModalType('criteria');
            }}
          >
            <SettingOutlined /> {BUTTONS.CRITERIA}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(record)} disabled={isTermPast}>
            <EditOutlined />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(record.cycleId)}
            disabled={isTermPast}
            className="text-red-500 hover:text-red-700"
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
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

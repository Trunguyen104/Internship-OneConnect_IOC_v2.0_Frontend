'use client';

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
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
      title: TABLE_COLUMNS.STATUS,
      key: 'status',
      align: 'center',
      width: '120px',
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
      title: TABLE_COLUMNS.MANAGEMENT,
      key: 'management',
      align: 'center',
      width: '220px',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
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
        </div>
      ),
    },
    {
      title: TABLE_COLUMNS.ACTIONS,
      key: 'actions',
      align: 'right',
      width: '60px',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined className="text-blue-500" />,
            disabled: isTermPast,
            onClick: () => onEdit(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined className="text-red-500" />,
            danger: true,
            disabled: isTermPast,
            onClick: () => onDelete(record.cycleId),
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0 transition-all hover:bg-slate-100"
            >
              <MoreOutlined className="text-muted text-lg" />
            </Button>
          </Dropdown>
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

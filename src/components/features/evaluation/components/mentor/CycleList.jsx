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
import { UI_TEXT } from '@/lib/UI_Text';

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
        const variants = ['secondary', 'primary', 'success'];
        const colors = [
          'bg-blue-50 text-blue-600 border-blue-100',
          'bg-rose-50 text-rose-600 border-rose-100',
          'bg-emerald-50 text-emerald-600 border-emerald-100',
        ];

        return (
          <Badge
            variant={variants[status]}
            className={`rounded-full px-4 h-6 text-[10px] font-black uppercase tracking-[0.15em] border ${colors[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}
          >
            {labels[status] || STATUS.UNKNOWN}
          </Badge>
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
            label: <span className="font-bold text-xs">{UI_TEXT.COMMON.EDIT}</span>,
            icon: <EditOutlined className="text-blue-500" />,
            disabled: isTermPast,
            onClick: () => onEdit(record),
          },
          {
            key: 'delete',
            label: <span className="font-bold text-xs">{UI_TEXT.BUTTON.DELETE}</span>,
            icon: <DeleteOutlined className="text-rose-500" />,
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
            className="flex justify-center"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full p-0 flex items-center justify-center transition-all hover:bg-gray-100 text-muted/30 hover:text-text"
            >
              <MoreOutlined className="text-lg" />
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

'use client';

import { CloudSyncOutlined, DeleteOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import PageLayout from '@/components/ui/pagelayout';
import { TableRowIconButton } from '@/components/ui/TableRowActions';
import { PUBLIC_HOLIDAY_UI } from '@/constants/publicHoliday/uiText';

import { usePublicHoliday } from '../hooks/usePublicHoliday';
import PublicHolidayFormModal from './PublicHolidayFormModal';

export default function PublicHolidayPage() {
  const {
    holidays,
    loading,
    year,
    setYear,
    syncHolidays,
    syncing,
    createHoliday,
    creating,
    deleteHoliday,
  } = usePublicHoliday();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const columns = [
    {
      title: PUBLIC_HOLIDAY_UI.TABLE.DATE,
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <span className="font-bold text-slate-700">{dayjs(date).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: PUBLIC_HOLIDAY_UI.TABLE.DESCRIPTION,
      dataIndex: 'description',
      key: 'description',
      render: (desc) => <span className="text-slate-600 italic">{desc || 'National Holiday'}</span>,
    },
    {
      title: PUBLIC_HOLIDAY_UI.TABLE.ACTION,
      key: 'action',
      width: 100,
      render: (_, record) => (
        <TableRowIconButton
          icon={<DeleteOutlined className="text-rose-500" />}
          title={PUBLIC_HOLIDAY_UI.DELETE_MODAL.TITLE}
          onClick={() =>
            showDeleteConfirm({
              title: PUBLIC_HOLIDAY_UI.DELETE_MODAL.TITLE,
              content: PUBLIC_HOLIDAY_UI.DELETE_MODAL.CONTENT,
              onOk: () => deleteHoliday(record.publicHolidayId),
            })
          }
        />
      ),
    },
  ];

  const handleSync = () => {
    syncHolidays(year);
  };

  const handleCreate = async (values) => {
    await createHoliday(values);
    setIsFormModalOpen(false);
  };

  return (
    <PageLayout>
      <PageLayout.Header title={PUBLIC_HOLIDAY_UI.TITLE} subtitle={PUBLIC_HOLIDAY_UI.DESCRIPTION} />

      <PageLayout.Card className="flex flex-col">
        <PageLayout.Toolbar
          actionProps={{
            label: PUBLIC_HOLIDAY_UI.CREATE_BUTTON,
            onClick: () => setIsFormModalOpen(true),
            icon: <PlusOutlined />,
          }}
          filterContent={
            <div className="flex items-center gap-3">
              <Select
                value={year}
                onChange={setYear}
                className="h-11 w-40"
                rootClassName="premium-select"
                suffixIcon={<FilterOutlined className="text-primary" />}
                options={Array.from({ length: 11 }, (_, i) => ({
                  value: 2025 + i,
                  label: `Year ${2025 + i}`,
                }))}
              />
              <Button
                variant="outline"
                className="h-11 rounded-2xl font-bold flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                onClick={handleSync}
                loading={syncing}
              >
                <CloudSyncOutlined />
                {PUBLIC_HOLIDAY_UI.SYNC_BUTTON}
              </Button>
            </div>
          }
        />

        <PageLayout.Content className="px-0">
          <DataTable
            columns={columns}
            data={holidays}
            loading={loading}
            rowKey="publicHolidayId"
            minWidth="auto"
          />
        </PageLayout.Content>
      </PageLayout.Card>

      <PublicHolidayFormModal
        visible={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleCreate}
        submitting={creating}
      />
    </PageLayout>
  );
}

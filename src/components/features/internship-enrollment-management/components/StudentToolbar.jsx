import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Select, Space } from 'antd';
import React from 'react';

import DataTableToolbar from '@/components/ui/datatabletoolbar';

export const StudentToolbar = ({
  searchTerm,
  onSearchChange,
  terms,
  termsLoading,
  termId,
  onTermChange,
  statusFilter,
  onStatusChange,
  STATUS_OPTIONS,
  STATUS_FILTER_LABEL,
  TERM_PLACEHOLDER,
  SEARCH_PLACEHOLDER,
  handleBulkWithdraw,
  selectedIds,
  isClosed,
  MESSAGES,
  ACTIONS,
  onAdd,
  setImportVisible,
}) => {
  return (
    <DataTableToolbar className="mb-6 !border-0 !p-0">
      <DataTableToolbar.Search
        placeholder={SEARCH_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <DataTableToolbar.Filters className="gap-0">
        <Space.Compact className="w-full sm:w-auto shadow-sm !rounded-xl overflow-hidden border border-border">
          <Select
            loading={termsLoading}
            placeholder={TERM_PLACEHOLDER}
            value={termId}
            onChange={onTermChange}
            className="!h-10 min-w-[150px] !border-0 focus:!ring-0"
            variant="borderless"
            options={terms.map((t) => ({ label: t.name, value: t.termId }))}
            suffixIcon={<FilterOutlined className="text-muted/40" />}
          />
          <div className="bg-border h-6 w-[1px] self-center opacity-50" />
          <Select
            allowClear
            placeholder={STATUS_FILTER_LABEL}
            value={statusFilter || undefined}
            onChange={onStatusChange}
            className="!h-10 min-w-[140px] !border-0 focus:!ring-0"
            variant="borderless"
            options={STATUS_OPTIONS}
            suffixIcon={<FilterOutlined className="text-muted/40" />}
          />
        </Space.Compact>
      </DataTableToolbar.Filters>
      <DataTableToolbar.Actions className="ml-auto gap-3">
        <Button
          danger
          type="primary"
          icon={<UserDeleteOutlined />}
          onClick={handleBulkWithdraw}
          disabled={selectedIds.length === 0 || isClosed}
          className="!h-10 !rounded-xl shadow-md"
        >
          {MESSAGES.BULK_WITHDRAW.ACTION_LABEL}
          {selectedIds.length > 0 && ` (${selectedIds.length})`}
        </Button>

        <Dropdown
          disabled={isClosed}
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'add',
                icon: <PlusOutlined />,
                label: ACTIONS.ADD,
                onClick: onAdd,
              },
              {
                type: 'divider',
              },
              {
                key: 'import',
                icon: <DownloadOutlined />,
                label: ACTIONS.IMPORT,
                onClick: () => setImportVisible(true),
              },
            ],
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="!h-10 !rounded-xl shadow-md px-4 font-semibold"
          >
            {ACTIONS.ADD}
          </Button>
        </Dropdown>
      </DataTableToolbar.Actions>
    </DataTableToolbar>
  );
};

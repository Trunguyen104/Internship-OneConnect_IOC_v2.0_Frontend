import {
  CloseCircleOutlined,
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
  TERM_PLACEHOLDER,
  SEARCH_PLACEHOLDER,
  handleBulkWithdraw,
  handleBulkUnassign,
  selectedIds,
  students = [],
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
        <Space.Compact className="w-full overflow-hidden rounded-xl border border-border shadow-sm sm:w-auto">
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
        </Space.Compact>
      </DataTableToolbar.Filters>
      <DataTableToolbar.Actions className="ml-auto gap-3">
        <Button
          type="primary"
          icon={<CloseCircleOutlined />}
          onClick={handleBulkUnassign}
          disabled={
            selectedIds.length === 0 ||
            isClosed ||
            !students
              .filter((s) => selectedIds.includes(s.studentTermId))
              .some(
                (s) => s.placementStatus === 'PLACED' || s.placementStatus === 'PENDING_ASSIGNMENT'
              )
          }
          className="!h-10 !rounded-xl shadow-md !bg-primary-500 hover:!bg-primary-600 !border-primary-500"
        >
          {MESSAGES.BULK_UNASSIGN.ACTION_LABEL}
          {selectedIds.length > 0 &&
            ` (${
              students
                .filter((s) => selectedIds.includes(s.studentTermId))
                .filter(
                  (s) =>
                    s.placementStatus === 'PLACED' || s.placementStatus === 'PENDING_ASSIGNMENT'
                ).length
            })`}
        </Button>

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
            className="!h-10 !rounded-xl px-4 font-semibold shadow-md"
          >
            {ACTIONS.ADD}
          </Button>
        </Dropdown>
      </DataTableToolbar.Actions>
    </DataTableToolbar>
  );
};

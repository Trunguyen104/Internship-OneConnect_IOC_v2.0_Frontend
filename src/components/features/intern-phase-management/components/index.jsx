'use client';

import { CheckSquareFilled, CheckSquareOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

import { useInternPhaseActions } from '../hooks/useInternPhaseActions';
import { useInternPhaseManagement } from '../hooks/useInternPhaseManagement';
import InternPhaseFormModal from './InternPhaseFormModal';
import InternPhaseTable from './InternPhaseTable';
import JobPostingFormModal from './JobPostingFormModal';

export default function InternPhaseManagementContainer() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isJobModalVisible, setJobModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const {
    items,
    isLoading,
    search,
    setSearch,
    includeEnded,
    setIncludeEnded,
    pagination,
    totalCount,
    handleTableChange,
    refetch,
  } = useInternPhaseManagement();

  const { saveMutation, handleDelete, isSubmitting } = useInternPhaseActions({
    editingRecord: selectedRecord,
    setModalVisible,
    onSuccess: refetch,
  });

  const handleCreate = () => {
    setSelectedRecord(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleView = (record) => {
    const id = record.id || record.internPhaseId;
    router.push(`/company/phases/${id}`);
  };

  const handleSave = (values) => {
    saveMutation.mutate(values);
  };

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-0">
        <div className="flex-1 min-h-0 overflow-hidden p-6 sm:p-8 flex flex-col gap-6">
          <DataTableToolbar className="!border-0 !p-0 shrink-0">
            <DataTableToolbar.Search
              placeholder={INTERN_PHASE_MANAGEMENT.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <DataTableToolbar.Filters>
              <div className="flex items-center gap-3">
                <Tooltip title={INTERN_PHASE_MANAGEMENT.FILTERS.INCLUDE_ENDED}>
                  <div
                    onClick={() => setIncludeEnded(!includeEnded)}
                    className={`flex h-9 items-center gap-2 cursor-pointer transition-all px-4 rounded-xl border font-bold text-[11px] uppercase tracking-wider ${
                      includeEnded
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-primary/30 hover:bg-slate-50'
                    }`}
                  >
                    {includeEnded ? (
                      <CheckSquareFilled />
                    ) : (
                      <CheckSquareOutlined className="opacity-40" />
                    )}
                    {INTERN_PHASE_MANAGEMENT.FILTERS.INCLUDE_ENDED}
                  </div>
                </Tooltip>
              </div>
            </DataTableToolbar.Filters>

            <DataTableToolbar.Actions
              label={INTERN_PHASE_MANAGEMENT.CREATE_BTN}
              icon={<PlusOutlined />}
              onClick={handleCreate}
              className="ml-auto"
            />
          </DataTableToolbar>

          <div className="flex-1 min-h-0 overflow-hidden">
            <InternPhaseTable
              items={items}
              loading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className="border-border/50 mt-auto flex flex-shrink-0 justify-end border-t p-6 px-8">
          <Pagination
            total={totalCount}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onPageChange={(page) => handleTableChange({ ...pagination, current: page })}
            onPageSizeChange={(size) =>
              handleTableChange({ ...pagination, pageSize: size, current: 1 })
            }
          />
        </div>
      </PageLayout.Card>

      <InternPhaseFormModal
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        loading={isSubmitting}
        editingRecord={selectedRecord}
        existingPhases={items}
      />

      <JobPostingFormModal
        visible={isJobModalVisible}
        onCancel={() => setJobModalVisible(false)}
        phase={selectedRecord}
      />
    </PageLayout>
  );
}

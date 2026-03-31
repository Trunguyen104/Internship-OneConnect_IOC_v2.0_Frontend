'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import PageTitle from '@/components/ui/pagetitle';
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
    router.push(`/intern-phase-management/${id}`);
  };

  const handleSave = (values) => {
    saveMutation.mutate(values);
  };

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageTitle title={INTERN_PHASE_MANAGEMENT.TITLE} />

      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <InternPhaseTable
          items={items}
          loading={isLoading}
          search={search}
          setSearch={setSearch}
          includeEnded={includeEnded}
          setIncludeEnded={setIncludeEnded}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />

        <PageLayout.Pagination
          total={totalCount}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onPageChange={(page) => handleTableChange({ ...pagination, current: page })}
          onPageSizeChange={(size) =>
            handleTableChange({ ...pagination, pageSize: size, current: 1 })
          }
        />
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

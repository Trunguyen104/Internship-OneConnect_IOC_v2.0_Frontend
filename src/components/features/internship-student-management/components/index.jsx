'use client';

import {
  DownOutlined,
  EditOutlined,
  InfoCircleOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import React from 'react';

import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import CreateGroupModal from '../../internship-group-management/components/CreateGroupModal';
import { useInternshipManagement } from '../hooks/useInternshipManagement';
import GroupActionModal from './GroupActionModal';
import PhaseDetailModal from './PhaseDetailModal';
import StudentDetailModal from './StudentDetailModal';
import StudentFilters from './StudentFilters';
import StudentTable from './StudentTable';

export default function InternshipManagement() {
  const [phaseDetailModal, setPhaseDetailModal] = React.useState({ open: false, phase: null });

  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;

  const {
    search,
    groupFilter,
    setGroupFilter,
    pagination,
    filteredData,
    total,
    loading,
    groupModal,
    detailModal,
    selectedRowKeys,
    setGroupModal,
    setDetailModal,
    setSelectedRowKeys,
    handleSearchChange,
    handleGroupFilterChange,
    handleMentorFilterChange,
    handleTableChange,
    handlePageSizeChange,
    handleGroupSubmit,
    handleViewStudent,
    phaseId,
    setPhaseId,
    phaseOptions,
    resetFilters,
    setCreateModal,
    createModal,
    unassignedStudents,
    fetchingStudents,
    handleCreateGroup,

    mentorFilter,
    setMentorFilter,
    isPhaseEditable,
    hasGroups,
    existingGroups,
    sort,
    setSort,
    mentors,
    loadingMentors,
  } = useInternshipManagement();

  const handleViewPhaseDetail = React.useCallback(() => {
    const { PHASE_DETAIL } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;
    if (!phaseId || phaseId === 'ALL_VISIBLE') return;
    const found = phaseOptions.find((p) => p.value === phaseId);
    if (!found) return;
    setPhaseDetailModal({
      open: true,
      phase: {
        phaseId: found.value,
        name: found.phaseName || found.label,
        enterpriseName: found.enterpriseName,
        startDate: found.startDate,
        endDate: found.endDate,
        status: found.status,
        maxStudents: found.maxStudents,
        description: found.description,
        groupCount: found.groupCount,
      },
    });
  }, [phaseId, phaseOptions]);

  const selectedStudents = filteredData.filter((s) => selectedRowKeys.includes(s.id));
  const hasGroup = selectedStudents.some((s) => !!s.groupId);

  const uniquePhases = new Set(selectedStudents.map((s) => s.phaseId || s.termId));
  const isSinglePhase = uniquePhases.size === 1;

  const bulkItems = [
    {
      key: 'addToGroup',
      label: INTERNSHIP_LIST.ACTIONS.ADD_TO_GROUP,
      icon: <UsergroupAddOutlined />,
      disabled: !isPhaseEditable || !isSinglePhase,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'ADD' }),
    },
    {
      key: 'changeGroup',
      label: INTERNSHIP_LIST.ACTIONS.CHANGE_GROUP,
      icon: <EditOutlined />,
      disabled: !isPhaseEditable || !isSinglePhase,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'CHANGE' }),
    },
  ].filter(Boolean);

  const { PHASE_DETAIL } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;
  const selectedPhase =
    phaseId && phaseId !== 'ALL_VISIBLE' ? phaseOptions.find((p) => p.value === phaseId) : null;

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={INTERNSHIP_LIST.FILTERS.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <DataTableToolbar.Filters>
            <div className="flex flex-wrap items-center gap-3">
              <StudentFilters
                groupFilter={groupFilter}
                setGroupFilter={handleGroupFilterChange}
                mentorFilter={mentorFilter}
                setMentorFilter={handleMentorFilterChange}
                resetFilters={resetFilters}
              />
            </div>
          </DataTableToolbar.Filters>

          {selectedRowKeys.length > 0 && bulkItems.length > 0 && (
            <DataTableToolbar.Actions className="ml-auto">
              <DataTableToolbar.Actions
                label={INTERNSHIP_LIST.ACTIONS.BULK_ACTIONS || 'Bulk Actions'}
                icon={<DownOutlined />}
                menu={{ items: bulkItems }}
                className="bg-slate-800 hover:bg-slate-900"
              />
            </DataTableToolbar.Actions>
          )}
        </DataTableToolbar>

        {selectedPhase && (
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={handleViewPhaseDetail}
              className="flex items-center gap-1.5 text-[11px] text-primary/70 hover:text-primary font-semibold transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              <InfoCircleOutlined className="text-[11px]" />
              {PHASE_DETAIL.VIEW_PHASE_DETAIL}
            </button>
          </div>
        )}

        <StudentTable
          data={filteredData}
          page={pagination.current}
          pageSize={pagination.pageSize}
          loading={loading}
          isPhaseEditable={isPhaseEditable}
          hasGroups={hasGroups}
          emptyText={
            phaseOptions.find((o) => o.value === 'ALL_VISIBLE')?.label === 'All Open Phases'
              ? INTERNSHIP_LIST.TABLE.EMPTY_TEXT_UPCOMING
              : INTERNSHIP_LIST.TABLE.EMPTY_TEXT_ACTIVE
          }
          sortBy={sort.column}
          sortOrder={sort.order}
          onSort={(key, order) => setSort({ column: key, order })}
          selectedRowKeys={selectedRowKeys}
          onSelectRowChange={setSelectedRowKeys}
          onView={handleViewStudent}
          onCreateGroup={(student) => setCreateModal({ open: true, students: [student] })}
          onAddToGroup={(student) =>
            setGroupModal({ open: true, students: [student], type: 'ADD' })
          }
          onChangeGroup={(student) =>
            setGroupModal({ open: true, students: [student], type: 'CHANGE' })
          }
        />
        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={total || 0}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil((total || 0) / pagination.pageSize))}
            onPageChange={handleTableChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </PageLayout.Card>

      <StudentDetailModal
        open={detailModal.open}
        student={detailModal.student}
        onCancel={() => setDetailModal({ open: false, student: null })}
      />

      <PhaseDetailModal
        open={phaseDetailModal.open}
        phase={phaseDetailModal.phase}
        onCancel={() => setPhaseDetailModal({ open: false, phase: null })}
      />

      <GroupActionModal
        open={groupModal.open}
        students={groupModal.students}
        type={groupModal.type}
        onCancel={() => setGroupModal({ open: false, students: [], type: 'ADD' })}
        onConfirm={handleGroupSubmit}
      />

      <CreateGroupModal
        open={createModal.open}
        students={unassignedStudents}
        existingGroups={existingGroups}
        loadingStudents={fetchingStudents}
        initialStudents={createModal.students}
        mentors={mentors}
        loadingMentors={loadingMentors}
        onCancel={() => setCreateModal({ open: false, students: [] })}
        onFinish={handleCreateGroup}
      />
    </PageLayout>
  );
}

'use client';

import { CheckCircle2, Clock, LayoutList, UserCheck } from 'lucide-react';
import React from 'react';

import { StatCard } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationManagement } from '../hooks/useApplicationManagement';
import ApplicationDetailModal from './ApplicationDetailModal';
import ApplicationFilters from './ApplicationFilters';
import RejectModal from './RejectModal';
import SelfApplyTable from './SelfApplyTable';
import UniAssignTable from './UniAssignTable';

/**
 * Component chính quản lý danh sách ứng tuyển (Dashboard ứng tuyển).
 * Chia làm 2 tab chính: Tự ứng tuyển (Self-apply) và Nhà trường phân bổ (Uni Assign).
 * @param {Object} props - Thuộc tính component.
 * @param {string} props.internshipPhaseId - (Optional) ID của giai đoạn thực tập để lọc mặc định.
 */
export default function ApplicationManagement({ internshipPhaseId }) {
  const {
    activeTab,
    setActiveTab,
    filters,
    effectiveFilters,
    applications,
    totalCount,
    isLoading,
    phases,
    schools,
    statusCounts,
    detailModalOpen,
    setDetailModalOpen,
    rejectModalOpen,
    setRejectModalOpen,
    rejectType,
    targetId,
    actions,
    handleFilterChange,
    handlePageChange,
    onAction,
    handleRejectConfirm,
  } = useApplicationManagement(internshipPhaseId);

  return (
    <PageLayout>
      <PageLayout.Header title={APPLICATIONS_UI.TITLE} subtitle={APPLICATIONS_UI.SUBTITLE} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex gap-2">
          {[
            { key: '1', label: APPLICATIONS_UI.TABS.SELF_APPLY },
            { key: '2', label: APPLICATIONS_UI.TABS.UNI_ASSIGN },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center rounded-2xl border px-6 py-2.5 text-sm font-black tracking-widest uppercase shadow-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 pb-4">
        <StatCard
          label="APPLIED"
          value={statusCounts[APPLICATION_STATUS.APPLIED]}
          icon={<LayoutList className="h-5 w-5" />}
          color="var(--color-info)"
          colorClass="text-info bg-info-surface"
        />
        <StatCard
          label="INTERVIEWING"
          value={statusCounts[APPLICATION_STATUS.INTERVIEWING]}
          icon={<Clock className="h-5 w-5" />}
          color="var(--color-warning)"
          colorClass="text-warning-text bg-warning-surface"
        />
        <StatCard
          label="OFFERED"
          value={statusCounts[APPLICATION_STATUS.OFFERED]}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="var(--color-primary)"
          colorClass="text-primary bg-primary-surface"
        />
        <StatCard
          label="PLACED"
          value={statusCounts[APPLICATION_STATUS.PLACED]}
          icon={<UserCheck className="h-5 w-5" />}
          color="var(--color-success)"
          colorClass="text-success bg-success-surface"
        />
      </div>

      <div className="flex flex-col gap-6">
        <ApplicationFilters
          filters={effectiveFilters}
          onFilterChange={handleFilterChange}
          schools={schools}
          phases={phases}
          isPhaseLocked={!!internshipPhaseId}
          isLoadingOptions={isLoading}
          showAudience={activeTab === '1'}
        />

        <PageLayout.Card className="flex flex-col overflow-hidden p-0! shadow-sm border border-slate-100">
          <div className="px-8 py-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">
            <span>{APPLICATIONS_UI.CURRENT_LIST || 'Current Applications'}</span>
            <span className="text-[12px] font-bold text-slate-400 normal-case tracking-normal">
              {APPLICATIONS_UI.TOTAL_LABEL || 'Total'}:{' '}
              <span className="text-slate-900">
                {totalCount} {APPLICATIONS_UI.ITEMS_LABEL || 'items'}
              </span>
            </span>
          </div>
          <PageLayout.Content className="px-0">
            {activeTab === '1' ? (
              <SelfApplyTable
                data={applications}
                pagination={{
                  current: filters.page,
                  pageSize: filters.size,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
                loading={isLoading}
                onAction={onAction}
              />
            ) : (
              <UniAssignTable
                data={applications}
                pagination={{
                  current: filters.page,
                  pageSize: filters.size,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
                loading={isLoading}
                onAction={onAction}
              />
            )}
          </PageLayout.Content>
        </PageLayout.Card>
      </div>

      <RejectModal
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={actions.isRejecting || actions.isRejectingUniAssign}
        title={
          rejectType === 'uni'
            ? APPLICATIONS_UI.MODAL_TITLE.REJECT_UNI
            : APPLICATIONS_UI.MODAL_TITLE.REJECT_STANDARD
        }
      />

      <ApplicationDetailModal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        applicationId={targetId}
      />
    </PageLayout>
  );
}

'use client';

import React, { memo } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

import { useIssueTab } from '../hooks/useIssueTab';
import IssueDetailModal from './IssueDetailModal';
import IssueFormModal from './IssueFormModal';
import IssueTable from './IssueTable';

const IssueTab = memo(function IssueTab() {
  const {
    issues,
    stakeholders,
    loading,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    openIssueForm,
    setOpenIssueForm,
    issueForm,
    setIssueForm,
    issueDetail,
    setIssueDetail,
    handleViewDetail,
    handleSaveIssue,
    handleDelete,
    handleToggleStatus,
    tableBodyRef,
  } = useIssueTab();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: ISSUE_UI.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
          }}
          actionProps={{
            label: ISSUE_UI.ADD_BUTTON,
            onClick: () => setOpenIssueForm(true),
          }}
        />

        <PageLayout.Content className="px-0">
          <IssueTable
            issues={issues}
            stakeholders={stakeholders}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onView={handleViewDetail}
            tableBodyRef={tableBodyRef}
          />
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
              {UI_TEXT.COMMON.TOTAL}: <span className="font-extrabold text-slate-800">{total}</span>
            </span>
            <PageLayout.Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
      </PageLayout.Card>

      <IssueFormModal
        isOpen={openIssueForm}
        onClose={() => setOpenIssueForm(false)}
        form={issueForm}
        setForm={setIssueForm}
        stakeholders={stakeholders}
        onSave={handleSaveIssue}
      />

      <IssueDetailModal issue={issueDetail} onClose={() => setIssueDetail(null)} />
    </div>
  );
});

export default IssueTab;

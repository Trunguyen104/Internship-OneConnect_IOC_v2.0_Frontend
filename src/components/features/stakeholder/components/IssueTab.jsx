'use client';

import React, { memo } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

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
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageLayout.Card>
        <div className="flex flex-1 flex-col overflow-hidden">
          <PageLayout.Toolbar
            searchProps={{
              placeholder: ISSUE_UI.SEARCH_PLACEHOLDER,
              value: search,
              onChange: (e) => {
                setSearch(e.target.value);
                setPage(1);
              },
            }}
            actionProps={{
              label: ISSUE_UI.ADD_BUTTON,
              onClick: () => setOpenIssueForm(true),
            }}
          />

          <PageLayout.Content>
            <IssueTable
              issues={issues}
              stakeholders={stakeholders}
              loading={loading}
              page={page}
              pageSize={pageSize}
              total={total}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onView={handleViewDetail}
              tableBodyRef={tableBodyRef}
            />
          </PageLayout.Content>

          {total > 0 && (
            <PageLayout.Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              totalPages={Math.ceil(total / pageSize)}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>
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

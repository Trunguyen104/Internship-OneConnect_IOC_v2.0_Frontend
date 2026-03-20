'use client';

import React, { memo } from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
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
    <div className="animate-in fade-in flex h-full flex-1 flex-col space-y-6 duration-500">
      <Card className="flex min-h-0 flex-1 flex-col !p-4 sm:!p-8 2xl:h-auto">
        <DataTableToolbar
          className="mb-6 !border-0 !p-0"
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

        {total > 0 && (
          <div className="border-border/50 mt-6 border-t pt-6">
            <Pagination
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
          </div>
        )}
      </Card>

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

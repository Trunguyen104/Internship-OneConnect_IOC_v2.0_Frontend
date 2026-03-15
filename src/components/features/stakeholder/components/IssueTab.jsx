'use client';

import React, { memo } from 'react';
import Card from '@/components/ui/Card';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { useIssueTab } from '../hooks/useIssueTab';
import IssueTable from './IssueTable';
import IssueFormModal from './IssueFormModal';
import IssueDetailModal from './IssueDetailModal';

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
    <div className='flex flex-col gap-6'>
      <Card className='bg-surface border-border overflow-hidden rounded-2xl border p-4 shadow-sm'>
        <SearchBar
          placeholder={ISSUE_UI.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          showFilter
          showAction
          actionLabel={ISSUE_UI.ADD_BUTTON}
          onActionClick={() => {
            setIssueForm({ title: '', stakeholderId: '', description: '' });
            setOpenIssueForm(true);
          }}
          className='mb-6'
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
      </Card>

      <div className='flex items-center justify-between px-2'>
        <div className='text-muted text-xs font-bold tracking-widest uppercase'>
          Tổng cộng: {total} vấn đề
        </div>
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

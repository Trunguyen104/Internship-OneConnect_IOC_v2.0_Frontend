'use client';

import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { useIssueTab } from '../hooks/useIssueTab';
import IssueTable from './IssueTable';
import IssueFormModal from './IssueFormModal';
import IssueDetailModal from './IssueDetailModal';

export default function IssueTab() {
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
    <>
      <Card>
        <DataTableToolbar
          className='mb-6 !border-0 !p-0'
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
      </Card>

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

      <IssueFormModal
        isOpen={openIssueForm}
        onClose={() => setOpenIssueForm(false)}
        form={issueForm}
        setForm={setIssueForm}
        stakeholders={stakeholders}
        onSave={handleSaveIssue}
      />

      <IssueDetailModal issue={issueDetail} onClose={() => setIssueDetail(null)} />
    </>
  );
}

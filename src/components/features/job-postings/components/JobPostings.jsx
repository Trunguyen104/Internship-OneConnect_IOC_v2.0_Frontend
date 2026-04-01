'use client';

import { PlusOutlined } from '@ant-design/icons';
import { App } from 'antd';
import { FileText, Send, Trash2, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { StatCard } from '@/components/ui/atoms';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/ui/pagelayout';

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import { useInternshipPhases, useJobPostingActions, useJobPostings } from '../hooks/useJobPostings';
import JobPostingModal from './JobPostingModal';
import JobPostingsFilters from './JobPostingsFilters';
import JobPostingsTable from './JobPostingsTable';

/**
 * Main logical container for Enterprise Job Postings.
 */
export default function JobPostings() {
  const { modal: modalApi } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    page: 1,
    size: 10,
  });

  // Data fetching
  const { jobPostings, totalCount, isLoading } = useJobPostings(filters);
  const { phases } = useInternshipPhases();
  const actions = useJobPostingActions();

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (page, size) => {
    setFilters((prev) => ({ ...prev, page, size }));
  };

  const openCreateModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const onAction = (key, record) => {
    const title = record?.title || 'this job posting';
    const id = record.jobId;

    // Compute active applications count
    const activeAppCount = (record.applicationStatusCounts || [])
      .filter((item) => [1, 2, 3].includes(item.status)) // Applied, Interviewing, Offered
      .reduce((sum, item) => sum + item.count, 0);

    const showConfirm = ({
      title: confirmTitle,
      content,
      onOk,
      confirmText = 'Confirm',
      variant = 'default',
    }) => {
      modalApi.confirm({
        title: (
          <span className="text-lg font-black tracking-tight text-slate-800">{confirmTitle}</span>
        ),
        content: <p className="mt-2 font-medium text-slate-500">{content}</p>,
        okText: confirmText,
        cancelText: JOB_POSTING_UI.CONFIRM.BUTTONS.CANCEL,
        centered: true,
        width: 440,
        className: 'premium-confirm-modal',
        okButtonProps: {
          className:
            variant === 'danger'
              ? 'bg-rose-500 hover:bg-rose-600 border-none rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[11px]'
              : 'bg-slate-900 hover:bg-slate-800 border-none rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[11px]',
        },
        cancelButtonProps: {
          className:
            'rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[11px] border-slate-200 text-slate-500',
        },
        onOk,
      });
    };

    switch (key) {
      case 'publish':
        showConfirm({
          title: JOB_POSTING_UI.CONFIRM.PUBLISH.TITLE,
          content: JOB_POSTING_UI.CONFIRM.PUBLISH.CONTENT(title),
          onOk: () => actions.publishDraft.mutate(id),
          confirmText: JOB_POSTING_UI.CONFIRM.BUTTONS.CONFIRM,
        });
        break;
      case 'close': {
        const titleMsg = JOB_POSTING_UI.CONFIRM.CLOSE.TITLE;
        const content =
          activeAppCount > 0
            ? JOB_POSTING_UI.CONFIRM.CLOSE.CONTENT_ACTIVE(title, activeAppCount)
            : JOB_POSTING_UI.CONFIRM.CLOSE.CONTENT_INACTIVE(title);

        showConfirm({
          title: titleMsg,
          content,
          onOk: () => actions.closeJob.mutate(id),
          confirmText: JOB_POSTING_UI.CONFIRM.BUTTONS.CONFIRM,
        });
        break;
      }
      case 'delete': {
        const titleMsg = JOB_POSTING_UI.CONFIRM.DELETE.TITLE;
        const content =
          activeAppCount > 0
            ? JOB_POSTING_UI.CONFIRM.DELETE.CONTENT_ACTIVE(title, activeAppCount)
            : JOB_POSTING_UI.CONFIRM.DELETE.CONTENT_INACTIVE(title);

        showConfirm({
          title: titleMsg,
          content,
          onOk: () => actions.deleteJob.mutate(id),
          confirmText: JOB_POSTING_UI.CONFIRM.DELETE.BUTTON,
          variant: 'danger',
        });
        break;
      }
      case 'edit':
        setSelectedRecord(record);
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Status Summary Stats logic from real data
  const statusCounts = useMemo(() => {
    const counts = {
      [JOB_STATUS.DRAFT]: 0,
      [JOB_STATUS.PUBLISHED]: 0,
      [JOB_STATUS.CLOSED]: 0,
      [JOB_STATUS.DELETED]: 0,
    };

    // Use jobPostings for current view counts or a separate summary API if available.
    // For now, derive from current page data or previous fetch.
    jobPostings.forEach((job) => {
      if (counts[job.status] !== undefined) {
        counts[job.status]++;
      }
    });

    return counts;
  }, [jobPostings]);

  return (
    <PageLayout>
      <div className="flex items-center justify-between gap-4">
        <PageLayout.Header title={JOB_POSTING_UI.TITLE} subtitle={JOB_POSTING_UI.LIST.SUBTITLE} />
        <Button
          className="bg-slate-900 hover:bg-slate-800 flex h-11 items-center gap-2 rounded-2xl px-6 text-[11px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:shadow-lg"
          onClick={openCreateModal}
        >
          <PlusOutlined className="text-lg" />
          {JOB_POSTING_UI.CREATE_BUTTON}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 pb-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={JOB_POSTING_UI.FILTERS.DRAFT}
          value={statusCounts[JOB_STATUS.DRAFT]}
          icon={<FileText className="h-5 w-5" />}
          color="var(--color-warning)"
          colorClass="text-warning-text bg-warning-surface shadow-warning/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.PUBLISHED}
          value={statusCounts[JOB_STATUS.PUBLISHED]}
          icon={<Send className="h-5 w-5" />}
          color="var(--color-success)"
          colorClass="text-success bg-success-surface shadow-success/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.CLOSED}
          value={statusCounts[JOB_STATUS.CLOSED]}
          icon={<XCircle className="h-5 w-5" />}
          color="var(--color-danger)"
          colorClass="text-danger bg-danger-surface shadow-danger/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.ALL}
          value={totalCount}
          icon={<Trash2 className="h-5 w-5" />}
          color="var(--color-primary)"
          colorClass="text-primary bg-primary-surface shadow-primary/10"
        />
      </div>

      <div className="flex flex-col gap-6">
        <JobPostingsFilters filters={filters} onFilterChange={handleFilterChange} />

        <PageLayout.Card className="border-border/60 bg-surface/70 flex flex-col overflow-hidden border p-0! shadow-xl backdrop-blur-sm">
          <div className="border-border/60 bg-surface/50 flex items-center justify-between border-b px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span>{JOB_POSTING_UI.LIST.TITLE}</span>
            <span className="text-[12px] font-bold normal-case tracking-normal text-slate-400">
              {JOB_POSTING_UI.LIST.TOTAL}{' '}
              <span className="text-slate-900">{JOB_POSTING_UI.LIST.ITEMS_COUNT(totalCount)}</span>
            </span>
          </div>
          <PageLayout.Content className="px-0">
            <JobPostingsTable
              data={jobPostings}
              pagination={{
                current: filters.page,
                pageSize: filters.size,
                total: totalCount,
                onChange: handlePageChange,
              }}
              loading={isLoading || actions.isMutating}
              onAction={onAction}
            />
          </PageLayout.Content>
        </PageLayout.Card>
      </div>

      <JobPostingModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        record={selectedRecord}
        phases={phases}
        onSuccess={() => setIsModalOpen(false)}
      />
    </PageLayout>
  );
}

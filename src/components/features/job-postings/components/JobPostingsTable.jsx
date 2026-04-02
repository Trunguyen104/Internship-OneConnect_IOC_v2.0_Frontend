'use client';

import React from 'react';

import DataTable from '@/components/ui/datatable';

import { JOB_POSTING_UI } from '../constants/job-postings.constant';
import { useJobPostingsTable } from '../hooks/useJobPostingsTable';

/**
 * Clean UI component for Job Postings Table.
 * Uses useJobPostingsTable hook for its logic.
 */
export const JobPostingsTable = ({ data = [], loading = false, pagination, onAction }) => {
  const current = pagination?.current ?? 1;
  const pageSize = pagination?.pageSize ?? 10;

  const { columns } = useJobPostingsTable({
    current,
    pageSize,
    onAction,
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="jobId"
      size="small"
      minWidth="100%"
      className="job-postings-table"
      emptyText={JOB_POSTING_UI.PLACEHOLDERS.EMPTY_TABLE}
    />
  );
};

export default JobPostingsTable;

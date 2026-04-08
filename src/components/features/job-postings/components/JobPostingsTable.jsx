'use client';

import React from 'react';

import DataTable from '@/components/ui/datatable';

import { JOB_POSTING_UI } from '../constants/job-postings.constant';
import { useJobPostingsTable } from '../hooks/useJobPostingsTable';

/**
 * Data table displaying the list of job postings.
 * Uses useJobPostingsTable to define column structure and logic.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.data - Array of job posting records.
 * @param {boolean} props.loading - Loading state of the table.
 * @param {Object} props.pagination - Current pagination state.
 * @param {Function} props.onAction - Handler for row-level actions (Edit, Delete, etc.).
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

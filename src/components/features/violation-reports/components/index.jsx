'use client';

import { PlusOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/card';
import CompoundModal from '@/components/ui/CompoundModal';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { EmptyState } from '@/components/ui/emptystate';
import Pagination from '@/components/ui/pagination';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';
import { useViolationReports } from '../hooks/useViolationReports';
import ViolationReportDetail from './ViolationReportDetail';
import ViolationReportFilters from './ViolationReportFilters';
import ViolationReportForm from './ViolationReportForm';
import ViolationReportTable from './ViolationReportTable';

export default function ViolationManagement() {
  const {
    reports,
    loading,
    total,
    params,
    students,
    groups,
    handleSearch,
    handleFilterChange,
    handleTableChange,
    handleCreateReport,
    handleUpdateReport,
    handleDeleteReport,
  } = useViolationReports();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);

  const currentUserId = 'mentor-123';

  const handleOpenCreate = () => {
    setEditingReport(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (report) => {
    setViewingReport(null);
    setIsDetailOpen(false);
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleView = (report) => {
    setViewingReport(report);
    setIsDetailOpen(true);
  };

  const handleDelete = (report) => {
    showDeleteConfirm({
      title: VIOLATION_REPORT_UI.CONFIRM.DELETE_TITLE,
      content: VIOLATION_REPORT_UI.CONFIRM.DELETE_CONTENT,
      onOk: () => {
        handleDeleteReport(report.id);
        setIsDetailOpen(false);
      },
      okText: VIOLATION_REPORT_UI.CONFIRM.DELETE,
      cancelText: VIOLATION_REPORT_UI.CONFIRM.CANCEL,
    });
  };

  const handleSave = async (payload) => {
    if (editingReport) {
      return await handleUpdateReport(editingReport.id, payload);
    } else {
      return await handleCreateReport(payload);
    }
  };

  const [dateRange, setDateRange] = useState([null, null]);

  const onDateRangeChange = (dates) => {
    setDateRange(dates);
    handleFilterChange({
      startDate: dates?.[0]?.format('YYYY-MM-DD'),
      endDate: dates?.[1]?.format('YYYY-MM-DD'),
    });
  };

  return (
    <section className="animate-in fade-in flex min-h-[420px] flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={VIOLATION_REPORT_UI.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar
          className="mb-6 flex-shrink-0 !border-0 !p-0"
          searchProps={{
            placeholder: VIOLATION_REPORT_UI.SEARCH_PLACEHOLDER,
            value: params.search || '',
            onChange: (e) => handleSearch(e.target.value),
          }}
          filterContent={
            <div className="flex flex-wrap items-center gap-3">
              <ViolationReportFilters
                params={params}
                groups={groups}
                onFilterChange={handleFilterChange}
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
                onReset={() => {
                  setDateRange([null, null]);
                  handleFilterChange({
                    search: '',
                    groupId: undefined,
                    startDate: undefined,
                    endDate: undefined,
                    createdBy: undefined,
                  });
                }}
              />
            </div>
          }
          actionProps={{
            label: VIOLATION_REPORT_UI.CREATE_BUTTON,
            onClick: handleOpenCreate,
            icon: <PlusOutlined />,
          }}
        />

        <div className="min-h-0 flex-1">
          {total === 0 && !loading ? (
            <EmptyState description={VIOLATION_REPORT_UI.EMPTY_MESSAGE} className="py-20" />
          ) : (
            <ViolationReportTable
              data={reports}
              loading={loading}
              page={params.page || 1}
              pageSize={params.pageSize || 10}
              total={total}
              onView={handleView}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          )}
        </div>

        {total > 0 && (
          <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
            <Pagination
              total={total}
              page={params.page || 1}
              pageSize={params.pageSize || 10}
              totalPages={Math.ceil(total / (params.pageSize || 10))}
              onPageChange={(page, pageSize) =>
                handleTableChange({ current: page, pageSize }, null, {})
              }
              onPageSizeChange={(pageSize) => handleTableChange({ current: 1, pageSize }, null, {})}
            />
          </div>
        )}
      </Card>

      <ViolationReportForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialValues={editingReport}
        students={students}
        loading={loading}
      />

      <CompoundModal open={isDetailOpen} onCancel={() => setIsDetailOpen(false)} width={800}>
        <CompoundModal.Header
          title={VIOLATION_REPORT_UI.DETAIL.TITLE}
          icon={<InfoCircleOutlined />}
        />
        <CompoundModal.Content className="bg-gray-50/30">
          {viewingReport && (
            <>
              <ViolationReportDetail report={viewingReport} />
              {viewingReport.createdBy === currentUserId && (
                <div className="mt-6 flex justify-end gap-3 border-t pt-6">
                  <button
                    onClick={() => handleOpenEdit(viewingReport)}
                    className="border-border text-text hover:bg-info/5 hover:text-info hover:border-info/50 h-11 rounded-xl border px-6 font-bold transition-all cursor-pointer"
                  >
                    {VIOLATION_REPORT_UI.TABLE.ACTIONS.EDIT}
                  </button>
                  <button
                    onClick={() => handleDelete(viewingReport)}
                    className="bg-red-500 hover:bg-red-600 h-11 rounded-xl px-6 font-bold text-white shadow-sm transition-all cursor-pointer"
                  >
                    {VIOLATION_REPORT_UI.TABLE.ACTIONS.DELETE}
                  </button>
                </div>
              )}
            </>
          )}
        </CompoundModal.Content>
        <CompoundModal.Footer
          onCancel={() => setIsDetailOpen(false)}
          onConfirm={() => setIsDetailOpen(false)}
          confirmText="Close"
        />
      </CompoundModal>
    </section>
  );
}

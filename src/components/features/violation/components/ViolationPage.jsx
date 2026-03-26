'use client';

import { DatePicker } from 'antd';
import React, { useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useViolation } from '../hooks/useViolation';
import ViolationModal from './ViolationModal';
import ViolationTable from './ViolationTable';

const { RangePicker } = DatePicker;

export default function ViolationPage() {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  const {
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginated,
    total,
    loading,
    dateRange,
    handleDateRangeChange,
  } = useViolation();

  const [dateError, setDateError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);

  const handleView = (id) => {
    const violation = paginated.find((v) => v.id === id);
    if (violation) {
      setSelectedViolation(violation);
      setModalVisible(true);
    }
  };

  const onDateChange = (dates) => {
    if (dates && dates[0] && dates[1] && dates[0].isAfter(dates[1], 'day')) {
      setDateError(true);
      return;
    }
    setDateError(false);
    handleDateRangeChange(dates);
  };

  return (
    <PageLayout>
      <PageLayout.Header title={VIOLATION_REPORT.TITLE} />

      <PageLayout.Card>
        <div className="flex flex-1 flex-col overflow-hidden">
          <PageLayout.Toolbar
            searchProps={{
              placeholder: VIOLATION_REPORT.SEARCH_PLACEHOLDER,
              value: search,
              onChange: (e) => setSearch(e.target.value),
            }}
          >
            <div className="relative">
              <RangePicker
                className="h-9 w-60"
                status={dateError ? 'error' : ''}
                value={dateRange}
                onChange={onDateChange}
                placeholder={[
                  VIOLATION_REPORT.FILTERS.START_DATE,
                  VIOLATION_REPORT.FILTERS.END_DATE,
                ]}
              />
              {dateError && (
                <span className="absolute -bottom-5 left-0 whitespace-nowrap text-[10px] text-danger">
                  {INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS.FORM.DATE_INVALID}
                </span>
              )}
            </div>
          </PageLayout.Toolbar>

          <PageLayout.Content>
            <ViolationTable
              data={paginated}
              loading={loading}
              page={page}
              pageSize={pageSize}
              onView={handleView}
            />
          </PageLayout.Content>

          {total > 0 && (
            <PageLayout.Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          )}
        </div>
      </PageLayout.Card>

      <ViolationModal
        visible={modalVisible}
        initialValues={selectedViolation}
        onCancel={() => {
          setModalVisible(false);
          setSelectedViolation(null);
        }}
        viewOnly={true}
      />
    </PageLayout>
  );
}

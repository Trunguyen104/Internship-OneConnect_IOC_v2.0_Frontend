'use client';

import { DatePicker } from 'antd';
import { useState } from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
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
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={VIOLATION_REPORT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={VIOLATION_REPORT.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DataTableToolbar.Filters>
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
          </DataTableToolbar.Filters>
        </DataTableToolbar>

        <ViolationTable
          data={paginated}
          loading={loading}
          page={page}
          pageSize={pageSize}
          onView={handleView}
        />

        {total > 0 && (
          <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
            <Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </Card>

      <ViolationModal
        visible={modalVisible}
        initialValues={selectedViolation}
        onCancel={() => {
          setModalVisible(false);
          setSelectedViolation(null);
        }}
        viewOnly={true}
      />
    </section>
  );
}

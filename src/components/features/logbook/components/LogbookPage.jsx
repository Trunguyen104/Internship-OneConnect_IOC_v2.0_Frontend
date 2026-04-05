'use client';

import { FilterOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useState } from 'react';

import { LogBookService } from '@/components/features/logbook/services/log-book.service';
import PageLayout from '@/components/ui/pagelayout';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { USER_ROLE } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';

import { useLogbook } from '../hooks/useLogbook';
import LogbookDetailModal from './LogbookDetailModal';
import LogbookFormModal from './LogbookFormModal';
import LogbookTable from './LogbookTable';
import MissingLogbookModal from './MissingLogbookModal';

/**
 * Daily Report / Logbook — same shell as SuperAdmin User Management:
 * PageLayout.Header → Card → Toolbar (search + filters + primary Create) → Content px-0 → Footer + Pagination.
 */
export default function LogbookPage() {
  const {
    data,
    loading,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    fetchLogbooks,
    handleDelete,
    internshipId,
    userProfile,
    missingDatesData,
    missingLoading,
  } = useLogbook();

  const user = useAuthStore((state) => state.user);
  const role = Number(user?.role);
  const isStudent = role === USER_ROLE.STUDENT;

  const toast = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);
  const [hasCheckedMissing, setHasCheckedMissing] = useState(false);

  // Auto-trigger missing dates modal
  const missingDates = React.useMemo(
    () => missingDatesData?.missingDates || [],
    [missingDatesData]
  );
  const totalMissing = missingDates.length;

  React.useEffect(() => {
    if (!missingLoading && !hasCheckedMissing) {
      if (totalMissing > 0) {
        setIsMissingModalOpen(true);
      }
      setHasCheckedMissing(true);
    }
  }, [missingLoading, hasCheckedMissing, totalMissing, missingDates]);

  const handleCreateOrUpdate = async (values) => {
    setSubmitting(true);
    try {
      let res;
      const SUBMITTED_STATUS = 0;
      const PUNCTUAL_STATUS = 3;
      const effectiveInternshipId = internshipId;

      const now = dayjs();
      const getFormattedDate = (date) => {
        return date.hour(now.hour()).minute(now.minute()).second(now.second()).toISOString();
      };

      if (editingId) {
        const updatePayload = {
          internshipId: effectiveInternshipId,
          logbookId: editingId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: getFormattedDate(values.dateReport),
          status: PUNCTUAL_STATUS,
        };
        res = await LogBookService.update(editingId, updatePayload);
      } else {
        const createPayload = {
          internshipId: effectiveInternshipId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: getFormattedDate(values.dateReport),
          status: SUBMITTED_STATUS,
        };
        res = await LogBookService.create(createPayload);
      }
      if (res && res.isSuccess !== false) {
        toast.success(
          editingId ? DAILY_REPORT_MESSAGES.SUCCESS.UPDATE : DAILY_REPORT_MESSAGES.SUCCESS.CREATE
        );

        if (!editingId) {
          setPageNumber(1);
        }
        fetchLogbooks();
        closeFormModal();
      } else {
        let errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.data?.message ||
          res?.message ||
          DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED;

        if (res?.statusCode === 409 || res?.status === 409) {
          errorMsg = DAILY_REPORT_MESSAGES.ERROR.DUPLICATE_REPORT;
        }

        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED;
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const openFormModal = async (record = null) => {
    if (record && record.logbookId) {
      try {
        setSubmitting(true);
        const res = await LogBookService.getById(record.logbookId);
        const detailData = res?.data || {};
        const fullData = {
          ...record,
          ...detailData,
          dateReport: detailData.dateReport || detailData.reportDate || record.dateReport,
        };
        setEditingId(fullData.logbookId);
        setCurrentRecord(fullData);
      } catch {
        setEditingId(record.logbookId);
        setCurrentRecord(record);
      } finally {
        setSubmitting(false);
      }
    } else {
      setEditingId(null);
      setCurrentRecord(record);
    }
    setIsFormModalOpen(true);
  };

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingId(null);
    setCurrentRecord(null);
  }, []);

  const openDetailModal = async (record) => {
    try {
      setSubmitting(true);
      const res = await LogBookService.getById(record.logbookId);
      const detailData = res?.data || {};
      setViewRecord({
        ...record,
        ...detailData,
        dateReport: detailData.dateReport || record.dateReport,
      });
      setIsDetailModalOpen(true);
    } catch {
      setViewRecord(record);
      setIsDetailModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setViewRecord(null);
  }, []);

  return (
    <PageLayout>
      <PageLayout.Header title={DAILY_REPORT_UI.TITLE} subtitle={DAILY_REPORT_UI.DESCRIPTION} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: DAILY_REPORT_UI.TABLE.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
          }}
          actionProps={
            isStudent
              ? {
                  label: DAILY_REPORT_UI.CREATE_BUTTON,
                  onClick: () => openFormModal(),
                }
              : undefined
          }
          filterContent={
            <Select
              allowClear
              placeholder={DAILY_REPORT_UI.FILTER_STATUS}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPageNumber(1);
              }}
              className="h-11 w-full md:w-64"
              rootClassName="premium-select"
              suffixIcon={<FilterOutlined className="text-primary" />}
              options={[
                { value: 4, label: DAILY_REPORT_UI.STATUS.PUNCTUAL },
                { value: 5, label: DAILY_REPORT_UI.STATUS.LATE },
              ]}
            />
          }
        />

        <PageLayout.Content className="px-0">
          <LogbookTable
            data={data}
            loading={loading}
            userProfile={userProfile}
            onView={openDetailModal}
            onEdit={openFormModal}
            onDelete={handleDelete}
          />
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
              {UI_TEXT.COMMON.TOTAL}: <span className="font-extrabold text-slate-800">{total}</span>
            </span>
            <PageLayout.Pagination
              total={total}
              page={pageNumber}
              pageSize={pageSize}
              onPageChange={setPageNumber}
              onPageSizeChange={setPageSize}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
      </PageLayout.Card>

      <LogbookFormModal
        visible={isFormModalOpen}
        editingId={editingId}
        submitting={submitting}
        initialValues={currentRecord}
        onSubmit={handleCreateOrUpdate}
        onCancel={closeFormModal}
      />

      <LogbookDetailModal
        visible={isDetailModalOpen}
        record={viewRecord}
        onClose={closeDetailModal}
      />

      <MissingLogbookModal
        visible={isMissingModalOpen}
        missingDates={missingDates}
        onClose={() => setIsMissingModalOpen(false)}
        onCreateReport={(date) => {
          openFormModal({ dateReport: date });
        }}
      />
    </PageLayout>
  );
}

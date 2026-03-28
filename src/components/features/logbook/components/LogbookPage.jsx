'use client';

import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import { LogBookService } from '@/components/features/logbook/services/log-book.service';
import { EmptyState } from '@/components/ui/atoms';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/ui/pagelayout';
import { Skeleton } from '@/components/ui/skeleton';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { useToast } from '@/providers/ToastProvider';

import { useLogbook } from '../hooks/useLogbook';
import LogbookDetailModal from './LogbookDetailModal';
import LogbookFormModal from './LogbookFormModal';
import LogbookTable from './LogbookTable';

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
  } = useLogbook();

  const toast = useToast();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (record) {
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
      setCurrentRecord(null);
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
      setViewRecord(res?.data || record);
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
      <PageLayout.Header title={DAILY_REPORT_UI.TITLE} description={DAILY_REPORT_UI.DESCRIPTION} />

      <PageLayout.Card>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-2">
            <PageLayout.Toolbar
              className="!p-0 !border-0 flex-1"
              searchProps={{
                placeholder: DAILY_REPORT_UI.TABLE.SEARCH_PLACEHOLDER,
                value: search,
                onChange: (e) => setSearch(e.target.value),
              }}
              leftContent={
                <Select
                  allowClear
                  placeholder={DAILY_REPORT_UI.FILTER_STATUS}
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val);
                    setPageNumber(1);
                  }}
                  className="w-full md:w-64 h-11"
                  rootClassName="premium-select"
                  suffixIcon={<FilterOutlined className="text-primary" />}
                  options={[
                    { value: 0, label: DAILY_REPORT_UI.STATUS.SUBMITTED },
                    { value: 3, label: DAILY_REPORT_UI.STATUS.PUNCTUAL },
                    { value: 4, label: DAILY_REPORT_UI.STATUS.LATE },
                  ]}
                />
              }
            />
            <Button
              variant="primary"
              onClick={() => openFormModal()}
              className="h-11 rounded-full px-8 font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full lg:w-auto justify-center"
            >
              <PlusOutlined /> {DAILY_REPORT_UI.CREATE_BUTTON}
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <PageLayout.Content>
              {loading && data.length === 0 ? (
                <div className="space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 flex h-20 animate-pulse items-center gap-6 rounded-2xl px-6"
                    >
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-9 w-20 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : data.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center">
                  <EmptyState
                    title={DAILY_REPORT_UI.EMPTY.NO_LOGBOOK || 'No logbooks found'}
                    description={DAILY_REPORT_UI.EMPTY.DESCRIPTION}
                  />
                </div>
              ) : (
                <LogbookTable
                  data={data}
                  loading={loading}
                  userProfile={userProfile}
                  onView={openDetailModal}
                  onEdit={openFormModal}
                  onDelete={handleDelete}
                />
              )}
            </PageLayout.Content>
          </div>

          {!loading && total > 0 && (
            <PageLayout.Pagination
              total={total}
              page={pageNumber}
              pageSize={pageSize}
              onPageChange={setPageNumber}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPageNumber(1);
              }}
            />
          )}
        </div>
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
    </PageLayout>
  );
}

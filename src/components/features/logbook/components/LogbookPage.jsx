'use client';

import PageLayout from '@/components/ui/PageLayout';
import { Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import LogbookTable from './LogbookTable';
import LogbookFormModal from './LogbookFormModal';
import LogbookDetailModal from './LogbookDetailModal';
import { useLogbook } from '../hooks/useLogbook';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
import { useToast } from '@/providers/ToastProvider';
import { LogBookService } from '@/components/features/logbook/services/logBook.service';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';

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
          editingId ? DAILY_REPORT_MESSAGES.SUCCESS.UPDATE : DAILY_REPORT_MESSAGES.SUCCESS.CREATE,
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
          errorMsg =
            'Ngày này đã có báo cáo hoặc bị trùng lặp. Vui lòng kiểm tra lại hoặc xóa báo cáo cũ.';
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
      } catch (err) {
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
    } catch (err) {
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
      <PageLayout.Header title={DAILY_REPORT_UI.TITLE} />

      <PageLayout.Card>
        <PageLayout.Toolbar
          searchProps={{
            placeholder: DAILY_REPORT_UI.TABLE.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          filterContent={
            <Select
              allowClear
              placeholder={DAILY_REPORT_UI.FILTER_STATUS}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPageNumber(1);
              }}
              className='w-56 shadow-sm'
              rootClassName='custom-select-premium'
              suffixIcon={<FilterOutlined className='text-muted' />}
              options={[
                { value: 3, label: DAILY_REPORT_UI.STATUS.PUNCTUAL },
                { value: 4, label: DAILY_REPORT_UI.STATUS.LATE },
              ]}
            />
          }
          actionProps={{
            label: DAILY_REPORT_UI.CREATE_BUTTON,
            onClick: () => openFormModal(),
          }}
        />

        <PageLayout.Content>
          {loading && data.length === 0 ? (
            <div className='space-y-4 py-4 px-6'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex gap-4 items-center h-[72px] border-b border-slate-50'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 flex-1' />
                  <Skeleton className='h-6 w-16 rounded-full' />
                  <Skeleton className='h-8 w-16 rounded-lg' />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <EmptyState 
              title={DAILY_REPORT_UI.EMPTY.NO_LOGBOOK || 'No logbooks found'}
              description="Keep track of your learning journey! Start by adding your first daily report."
            />
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

        {total > 0 && (
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

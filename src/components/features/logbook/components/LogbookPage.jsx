'use client';

import React, { useState, useCallback } from 'react';
import { Form, Select, Button } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import LogbookTable from './LogbookTable';
import LogbookFormModal from './LogbookFormModal';
import LogbookDetailModal from './LogbookDetailModal';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { useLogbook } from '../hooks/useLogbook';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
import { useToast } from '@/providers/ToastProvider';
import { LogBookService } from '@/components/features/logbook/services/logBook.service';
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
    setSortOrder,
    fetchLogbooks,
    handleDelete,
    internshipId,
    userProfile,
  } = useLogbook();

  const toast = useToast();
  const [form] = Form.useForm();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateOrUpdate = async (values) => {
    setSubmitting(true);
    try {
      let res;
      const SUBMITTED_STATUS = 0;
      const PUNCTUAL_STATUS = 3;
      const effectiveInternshipId = internshipId;

      if (editingId) {
        const updatePayload = {
          internshipId: effectiveInternshipId,
          logbookId: editingId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: values.dateReport.toISOString(),
          status: PUNCTUAL_STATUS,
        };
        res = await LogBookService.update(editingId, updatePayload);
      } else {
        const createPayload = {
          internshipId: effectiveInternshipId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: values.dateReport.toISOString(),
          status: SUBMITTED_STATUS,
        };
        res = await LogBookService.create(createPayload);
      }

      if (res && (res.isSuccess !== false || res.success !== false)) {
        toast.success(
          editingId ? DAILY_REPORT_MESSAGES.SUCCESS.UPDATE : DAILY_REPORT_MESSAGES.SUCCESS.CREATE,
        );

        if (!editingId) {
          setPageNumber(1);
        }
        fetchLogbooks();
        closeFormModal();
      } else {
        toast.error(res?.message || DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED);
      }
    } catch {
      toast.error(DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED);
    } finally {
      setSubmitting(false);
    }
  };

  const openFormModal = useCallback(
    (record = null) => {
      if (record) {
        setEditingId(record.logbookId);
        form.setFieldsValue({
          dateReport: record.dateReport ? dayjs(record.dateReport) : null,
          summary: record.summary,
          issue: record.issue,
          plan: record.plan,
        });
      } else {
        setEditingId(null);
        form.resetFields();
      }
      setIsFormModalOpen(true);
    },
    [form],
  );

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingId(null);
    form.resetFields();
  }, [form]);

  const openDetailModal = useCallback((record) => {
    setViewRecord(record);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setViewRecord(null);
  }, []);

  return (
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={DAILY_REPORT_UI.TITLE} description={DAILY_REPORT_UI.DESCRIPTION} />

      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col'>
        <Card className='bg-surface border-border overflow-hidden rounded-2xl border shadow-sm'>
          <div className='flex flex-wrap items-center justify-between gap-4 p-4'>
            <div className='min-w-[280px]'>
              <Select
                allowClear
                placeholder={DAILY_REPORT_UI.FILTER_STATUS}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setPageNumber(1);
                }}
                className='h-11 w-full'
                suffixIcon={<FilterOutlined className='text-muted' />}
                options={[
                  { value: 0, label: DAILY_REPORT_UI.STATUS.SUBMITTED },
                  { value: 3, label: DAILY_REPORT_UI.STATUS.PUNCTUAL },
                  { value: 4, label: DAILY_REPORT_UI.STATUS.LATE },
                ]}
              />
            </div>

            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => openFormModal()}
              className='bg-primary h-11 rounded-xl border-none px-6 font-bold shadow-md transition-all hover:scale-105 active:scale-95'
            >
              {DAILY_REPORT_UI.CREATE_BUTTON}
            </Button>
          </div>

          <LogbookTable
            data={data}
            loading={loading}
            userProfile={userProfile}
            onView={openDetailModal}
            onEdit={openFormModal}
            onDelete={handleDelete}
            onTableChange={(pagination, filters, sorter) => {
              if (sorter.field === 'dateReport' && sorter.order) {
                setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
              }
            }}
          />
        </Card>

        <div className='mt-6 flex items-center justify-between px-2'>
          <div className='text-muted text-xs font-bold tracking-widest uppercase'>
            Tổng cộng: {total} báo cáo
          </div>
          <Pagination
            total={total}
            page={pageNumber}
            pageSize={pageSize}
            totalPages={Math.ceil(total / pageSize)}
            onPageChange={setPageNumber}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageNumber(1);
            }}
          />
        </div>
      </div>

      <LogbookFormModal
        visible={isFormModalOpen}
        editingId={editingId}
        submitting={submitting}
        form={form}
        onSubmit={handleCreateOrUpdate}
        onCancel={closeFormModal}
      />

      <LogbookDetailModal
        visible={isDetailModalOpen}
        record={viewRecord}
        onClose={closeDetailModal}
      />
    </section>
  );
}

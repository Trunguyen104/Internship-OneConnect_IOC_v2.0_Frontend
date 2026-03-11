'use client';

import { Form } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { Select, Button } from 'antd';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import LogbookTable from './LogbookTable';
import LogbookFormModal from './LogbookFormModal';
import LogbookDetailModal from './LogbookDetailModal';
import { useLogbook } from './hooks/useLogbook';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
import { LogBookService } from '@/features/logbook/services/logBook.service';
import dayjs from 'dayjs';
import { useState } from 'react';

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
    contextHolder,
    messageApi,
    internshipId,
  } = useLogbook();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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
        messageApi.success(
          editingId ? DAILY_REPORT_MESSAGES.SUCCESS.UPDATE : DAILY_REPORT_MESSAGES.SUCCESS.CREATE,
        );

        if (!editingId) {
          setPageNumber(1);
          fetchLogbooks();
        } else {
          fetchLogbooks();
        }
        closeFormModal();
      } else {
        messageApi.error(res?.message || DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED);
      }
    } catch {
      messageApi.error(DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED);
    } finally {
      setSubmitting(false);
    }
  };

  const openFormModal = (record = null) => {
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
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const openDetailModal = (record) => {
    setViewRecord(record);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewRecord(null);
  };

  return (
    <section className='animate-in fade-in flex h-full flex-col space-y-6 duration-500'>
      {contextHolder}
      <h1 className='text-2xl font-bold text-slate-900'>{DAILY_REPORT_UI.TITLE}</h1>

      <Card className='flex flex-1 flex-col overflow-hidden rounded-2xl border-none shadow-xl shadow-slate-200/50'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 bg-slate-50/20 py-4'>
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
            suffixIcon={<FilterOutlined className='text-slate-400' />}
            options={[
              { value: 0, label: DAILY_REPORT_UI.STATUS.SUBMITTED },
              { value: 3, label: DAILY_REPORT_UI.STATUS.PUNCTUAL },
              { value: 4, label: DAILY_REPORT_UI.STATUS.LATE },
            ]}
          />

          <Button
            icon={<PlusOutlined />}
            onClick={() => openFormModal()}
            className='!bg-primary hover:!bg-primary-hover flex items-center gap-2 !rounded-xl !border-none !px-6 !py-2.5 !text-sm !font-medium !text-white shadow-sm transition-colors'
          >
            {DAILY_REPORT_UI.CREATE_BUTTON}
          </Button>
        </div>

        <LogbookTable
          data={data}
          loading={loading}
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

'use client';

import { Form } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
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
    sortOrder,
    setSortOrder,
    search,
    setSearch,
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
          dateReport: values.dateReport.hour(12).toISOString(),
          status: PUNCTUAL_STATUS,
        };
        res = await LogBookService.update(editingId, updatePayload);
      } else {
        const createPayload = {
          internshipId: effectiveInternshipId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: values.dateReport.hour(12).toISOString(),
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
        const errorMsg =
          res?.data?.errors?.[0] ||
          res?.errors?.[0] ||
          res?.data?.message ||
          res?.message ||
          DAILY_REPORT_MESSAGES.ERROR.UNEXPECTED;
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Logbook submit error:', error);
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
        const fullData = res?.data || record;

        setEditingId(fullData.logbookId);
        form.setFieldsValue({
          dateReport: fullData.dateReport ? dayjs(fullData.dateReport) : null,
          summary: fullData.summary,
          issue: fullData.issue,
          plan: fullData.plan,
        });
      } catch (err) {
        console.error('Failed to load logbook details', err);
        setEditingId(record.logbookId);
        form.setFieldsValue({
          dateReport: record.dateReport ? dayjs(record.dateReport) : null,
          summary: record.summary,
          issue: record.issue,
          plan: record.plan,
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsFormModalOpen(true);
  };

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingId(null);
    form.resetFields();
  }, [form]);

  const openDetailModal = async (record) => {
    try {
      setSubmitting(true);
      const res = await LogBookService.getById(record.logbookId);
      setViewRecord(res?.data || record);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('Failed to load logbook details', err);
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
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={DAILY_REPORT_UI.TITLE} />

      <Card className='flex flex-1 flex-col overflow-hidden rounded-2xl border-none shadow-xl shadow-slate-200/50'>
        <DataTableToolbar
          className='mb-5 !border-0 !p-0'
          searchProps={{
            placeholder: 'Search by student name...',
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
              suffixIcon={<FilterOutlined className='text-slate-400' />}
              options={[
                { value: 0, label: DAILY_REPORT_UI.STATUS.SUBMITTED },
                { value: 1, label: DAILY_REPORT_UI.STATUS.APPROVED },
                { value: 2, label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION },
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

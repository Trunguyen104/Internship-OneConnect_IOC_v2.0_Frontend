'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Skeleton,
  Empty,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { LogBookService } from '@/services/logBook.service';
import { ProjectService } from '@/services/projectService';
import dayjs from 'dayjs';
import Card from '@/shared/components/Card';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function DailyReport() {
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const internshipId = searchParams.get('id');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [projectId, setProjectId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const tokenRaw = sessionStorage.getItem('accessToken');
    if (tokenRaw) {
      try {
        let token = tokenRaw;
        if (!token.startsWith('ey')) {
          const parsed = JSON.parse(tokenRaw);
          token = parsed?.accessToken || parsed?.data?.accessToken;
        }
        if (token) {
          const payloadBase64 = token.split('.')[1];
          const payloadStr = atob(payloadBase64);
          const payload = JSON.parse(payloadStr);
          const id =
            payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
            payload.sub;
          setStudentId(id);
        }
      } catch (e) {
        console.error('Failed to decode JWT to get StudentId', e);
      }
    }
  }, []);

  const fetchLogbooks = useCallback(async () => {
    let idToFetch = projectId;
    setLoading(true);

    try {
      if (!idToFetch) {
        let projectRes;

        if (internshipId) {
          projectRes = await ProjectService.getByInternshipGroup(internshipId);
        } else {
          projectRes = await ProjectService.getAll();
        }

        if (projectRes && projectRes.isSuccess !== false && projectRes.data) {
          const items = projectRes.data.items || projectRes.items || [];
          if (items.length > 0) {
            const matchedProject = internshipId
              ? items.find((p) => p.internshipId === internshipId) || items[0]
              : items[0];

            idToFetch = matchedProject.projectId;
            setProjectId(idToFetch);
          }
        }
      }

      if (!idToFetch) {
        setLoading(false);
        return;
      }

      const res = await LogBookService.getAll(idToFetch, {
        Status: statusFilter,
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortColumn: 'dateReport',
        SortOrder: sortOrder,
      });

      if (res && res.isSuccess !== false) {
        let items = [];
        if (Array.isArray(res.data)) {
          items = res.data;
        } else if (res.data?.items && Array.isArray(res.data.items)) {
          items = res.data.items;
        } else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
          items = [res.data];
        } else if (Array.isArray(res.items)) {
          items = res.items;
        }

        if (statusFilter) {
          items = items.filter((item) => {
            const itemStatus = item.status ? String(item.status).toUpperCase() : '';
            return itemStatus === String(statusFilter).toUpperCase();
          });
        }

        const startIndex = (pageNumber - 1) * pageSize;
        const pagedItems = items.slice(startIndex, startIndex + pageSize);

        setData(pagedItems);
        setTotal(items.length);
      }
    } finally {
      setLoading(false);
    }
  }, [internshipId, projectId, statusFilter, pageNumber, pageSize, sortOrder, messageApi]);

  useEffect(() => {
    fetchLogbooks();
  }, [fetchLogbooks]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);

    if (sorter.field === 'dateReport' && sorter.order) {
      setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
    } else if (!sorter.order) {
      setSortOrder(undefined);
    }
  };

  const handleCreateOrUpdate = async (values) => {
    const targetId = projectId;
    if (!targetId) {
      messageApi.error('Missing Project ID');
      return;
    }
    if (!studentId) {
      messageApi.error('User context missing (Student ID not found)');
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (editingId) {
        const updatePayload = {
          logbookId: editingId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: values.dateReport.toISOString(),
          status: values.status,
        };
        res = await LogBookService.update(targetId, editingId, updatePayload);
      } else {
        const createPayload = {
          projectId: targetId,
          summary: values.summary,
          issue: values.issue || '',
          plan: values.plan,
          dateReport: values.dateReport.toISOString(),
        };
        res = await LogBookService.create(targetId, createPayload);
      }

      if (res && res.isSuccess !== false) {
        messageApi.success(
          editingId ? 'Logbook updated successfully!' : 'Logbook created successfully!',
        );
        closeModal();
        fetchLogbooks();
      } else {
        messageApi.error(
          res?.message ||
          res?.data?.message ||
          (editingId ? 'Failed to update logbook' : 'Failed to create logbook'),
        );
      }
    } catch (error) {
      console.error(error);
      messageApi.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.logbookId);

    form.setFieldsValue({
      dateReport: record.dateReport ? dayjs(record.dateReport) : null,
      status: record.status,
      summary: record.summary,
      issue: record.issue,
      plan: record.plan,
    });

    setIsModalOpen(true);
  };
  const handleView = (record) => {
    setViewRecord(record);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      if (!projectId) return;
      const res = await LogBookService.delete(projectId, id);
      if (res && res.isSuccess !== false) {
        messageApi.success('Logbook deleted successfully!');
        if (data.length === 1 && pageNumber > 1) {
          setPageNumber(pageNumber - 1);
        } else {
          fetchLogbooks();
        }
      } else {
        messageApi.error(res?.message || 'Failed to delete logbook');
      }
    } catch {
      messageApi.error('An error occurred during deletion');
    }
  };

  const renderStatus = (status) => {
    const config = {
      SUBMITTED: {
        label: 'Submitted',
        style: 'bg-blue-50 text-blue-600 border-blue-200 border',
      },
      APPROVED: {
        label: 'Approved',
        style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
      },
      NEEDS_REVISION: {
        label: 'Needs Revision',
        style: 'bg-orange-50 text-orange-600 border-orange-200 border',
      },
      PUNCTUAL: {
        label: 'Punctual',
        style: 'bg-purple-50 text-purple-600 border-purple-200 border',
      },
      LATE: {
        label: 'Late',
        style: 'bg-red-50 text-red-600 border-red-200 border',
      },
    };

    const c = config[status] || {
      label: 'Unknown',
      style: 'bg-gray-50 text-gray-600 border-gray-200 border',
    };

    return (
      <div className={`inline-flex px-3 py-1 rounded-full text-[13px] font-semibold ${c.style}`}>
        {c.label}
      </div>
    );
  };
  const columns = [
    {
      title: 'Report Date',
      dataIndex: 'dateReport',
      key: 'dateReport',
      sorter: true,
      render: (text) => (
        <span className='font-medium text-gray-700'>
          {text ? new Date(text).toLocaleDateString('en-GB') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => <Text className='font-semibold'>{text || 'N/A'}</Text>,
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          <span className='text-gray-600'>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement='topLeft' title={text}>
          <span className='text-gray-600'>{text || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Tooltip title='View Details'>
            <Button
              type='text'
              icon={
                <FileTextOutlined className='text-gray-500 hover:text-blue-600 transition-colors' />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleView(record);
              }}
              className='hover:bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center'
            />
          </Tooltip>

          <Tooltip title='Edit Report'>
            <Button
              type='text'
              icon={
                <EditOutlined className='text-gray-500 hover:text-blue-600 transition-colors' />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              className='hover:bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center'
            />
          </Tooltip>

          <Tooltip title='Delete Report'>
            <Button
              type='text'
              danger
              icon={
                <DeleteOutlined className='text-gray-400 hover:text-red-500 transition-colors' />
              }
              onClick={(e) => {
                e.stopPropagation();
                Modal.confirm({
                  title: 'Delete Logbook',
                  content: 'Are you sure you want to delete this logbook entry?',
                  okText: 'Yes, Delete',
                  okType: 'danger',
                  cancelText: 'Cancel',
                  onOk: () => handleDelete(record.logbookId),
                  className: 'modern-modal',
                  okButtonProps: { className: 'rounded-lg font-semibold' },
                  cancelButtonProps: { className: 'rounded-lg font-medium' },
                });
              }}
              className='hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center'
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (!projectId && !loading && total === 0) {
    return (
      <div className='flex h-[400px] items-center justify-center bg-gray-50/50 rounded-[24px] border border-gray-200/50 m-6'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='my-auto'
          description={
            <span className='text-gray-500 font-medium'>
              You are not assigned to any projects yet.
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className='max-w-[1400px] mx-auto pb-4 gap-4'>
      {contextHolder}

      <div className='flex items-center justify-between mt-4 px-2 shrink-0 mb-4'>
        <div>
          <Title level={2} className='!mb-1 tracking-tight text-gray-900'>
            Daily Report
          </Title>
          <Text className='text-gray-500 text-[15px]'>
            Manage and submit your daily internship logbooks
          </Text>
        </div>
      </div>

      <Card>
        <div className='px-2 py-2 border-none flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0'>
          <div className='flex items-center gap-4'>
            <Select
              allowClear
              placeholder='Filter by Status'
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPageNumber(1);
              }}
              className='w-48 shadow-sm'
              rootClassName='custom-select-rounded'
              classNames={{ popup: '!rounded-xl shadow-lg border border-gray-100' }}
              suffixIcon={<FilterOutlined />}
              options={[
                { value: 'SUBMITTED', label: 'Submitted' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'NEEDS_REVISION', label: 'Needs Revision' },
                { value: 'PUNCTUAL', label: 'Punctual' },
                { value: 'LATE', label: 'Late' },
              ]}
            />
          </div>

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className='bg-black hover:bg-gray-800 text-white rounded-xl h-10 px-6 font-semibold shadow-sm border-0 transition-all hover:scale-105'
          >
            Create Report
          </Button>
        </div>

        <div className='px-2 pb-2 mt-2 flex-grow'>
          {loading ? (
            <div className='p-6 space-y-4'>
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : (
            <Table
              dataSource={data}
              columns={columns}
              rowKey='logbookId'
              onChange={handleTableChange}
              scroll={{ x: 800, y: 220 }}
              pagination={{
                current: pageNumber,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                className: 'px-2 mt-4',
              }}
              rowClassName='hover:bg-gray-50/50 transition-colors cursor-default'
              locale={{
                emptyText: (
                  <div className='py-12'>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span className='text-gray-400 font-medium'>
                          No logbooks found for this group
                        </span>
                      }
                    />
                  </div>
                ),
              }}
            />
          )}
        </div>
      </Card>

      <Modal
        title={
          <div className='flex items-center gap-3 py-2 border-b border-gray-100 mb-4'>
            <div>
              <h3 className='text-lg font-bold text-gray-900 m-0'>
                {editingId ? 'Edit Daily Report' : 'Create Daily Report'}
              </h3>
              <p className='text-sm text-gray-500 font-medium m-0 mt-0.5'>
                {editingId
                  ? 'Update your submitted logbook details'
                  : 'Submit your internship progress'}
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        confirmLoading={submitting}
        onOk={() => form.submit()}
        okText={editingId ? 'Save Changes' : 'Submit Report'}
        cancelText='Cancel'
        className='modern-modal'
        width={700}
        centered
        okButtonProps={{
          className:
            'bg-black hover:bg-gray-800 text-white rounded-lg h-10 px-6 font-semibold shadow-sm border-0',
        }}
        cancelButtonProps={{
          className:
            'rounded-lg h-10 px-5 font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600',
        }}
      >
        <div className='max-h-[60vh] overflow-y-auto px-1 custom-scrollbar'>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleCreateOrUpdate}
            className='mt-2'
            initialValues={{
              // status: 0,
              status: 'SUBMITTED',
            }}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
              <Form.Item
                label={<span className='text-sm font-semibold text-gray-700'>Report Date</span>}
                name='dateReport'
                rules={[{ required: true, message: 'Please select a date!' }]}
              >
                <DatePicker
                  className='w-full h-[44px] rounded-xl'
                  format='DD/MM/YYYY'
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>

              <Form.Item
                label={<span className='text-sm font-semibold text-gray-700'>Status</span>}
                name='status'
                rules={[{ required: true, message: 'Please select a status!' }]}
              >
                <Select
                  className='h-[44px]'
                  rootClassName='custom-select-rounded'
                  classNames={{
                    popup: {
                      root: '!rounded-xl shadow-lg border border-gray-100',
                    },
                  }}
                  options={[
                    { value: 'SUBMITTED', label: 'Submitted' },
                    { value: 'APPROVED', label: 'Approved' },
                    { value: 'NEEDS_REVISION', label: 'Needs Revision' },
                    { value: 'PUNCTUAL', label: 'Punctual' },
                    { value: 'LATE', label: 'Late' },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className='text-sm font-semibold text-gray-700'>Work Summary</span>}
              name='summary'
              rules={[
                { required: true, message: 'Please enter a summary of your work!' },
                { min: 10, message: 'Summary must be at least 10 characters long.' },
              ]}
            >
              <TextArea
                placeholder='Describe the tasks you worked on today...'
                autoSize={{ minRows: 2, maxRows: 6 }}
                className='rounded-xl p-3'
              />
            </Form.Item>

            <Form.Item
              label={
                <span className='text-sm font-semibold text-gray-700'>
                  Issues Encountered (Optional)
                </span>
              }
              name='issue'
            >
              <TextArea
                placeholder='Any blockers or challenges you faced?'
                autoSize={{ minRows: 2, maxRows: 5 }}
                className='rounded-xl p-3'
              />
            </Form.Item>

            <Form.Item
              label={<span className='text-sm font-semibold text-gray-700'>Plan for Next Day</span>}
              name='plan'
              rules={[
                { required: true, message: 'Please outline your plan for the next working day!' },
              ]}
            >
              <TextArea
                placeholder='What are your tasks for tomorrow?'
                autoSize={{ minRows: 3, maxRows: 6 }}
                className='rounded-xl p-3'
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title={
          <div className='flex items-center gap-3 py-2 border-b border-gray-100 mb-4'>
            <div className='w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0'>
              <FileTextOutlined className='text-lg' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900 m-0'>Logbook Details</h3>
              <p className='text-sm text-gray-500 font-medium m-0 mt-0.5'>
                {viewRecord ? dayjs(viewRecord.dateReport).format('DD/MM/YYYY') : ''}
              </p>
            </div>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button
            key='close'
            onClick={() => setIsViewModalOpen(false)}
            className='rounded-lg h-10 px-6 font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
          >
            Close
          </Button>,
        ]}
        width={700}
        className='modern-modal'
        centered
      >
        {viewRecord && (
          <div className='space-y-6 mt-2 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar'>
            <div className='grid grid-cols-2 gap-4 pb-4 border-b border-gray-100'>
              <div>
                <span className='block text-sm font-semibold text-gray-500 mb-1'>Student</span>
                <span className='text-base font-medium text-gray-900'>
                  {viewRecord.studentName || 'N/A'}
                </span>
              </div>
              <div>
                <span className='block text-sm font-semibold text-gray-500 mb-1'>Status</span>
                {renderStatus(viewRecord.status)}
              </div>
            </div>

            <div>
              <span className='block text-md font-semibold text-gray-800 mb-2'>Work Summary</span>
              <div className='bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap'>
                {viewRecord.summary || 'No summary provided.'}
              </div>
            </div>

            <div>
              <span className='block text-md font-semibold text-gray-800 mb-2'>
                Issues Encountered
              </span>
              <div className='bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap'>
                {viewRecord.issue || 'No issues reported.'}
              </div>
            </div>

            <div>
              <span className='block text-md font-semibold text-gray-800 mb-2'>
                Plan for Next Day
              </span>
              <div className='bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap'>
                {viewRecord.plan || 'No plan outlined.'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

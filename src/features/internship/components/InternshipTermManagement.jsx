'use client';
import React, { useMemo, useState, useCallback, memo, useEffect } from 'react';
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Dropdown,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
  Drawer,
  Pagination,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
const STATUS_CONFIG = {
  0: { color: 'default', label: 'Bản nháp', type: 'draft' },
  1: { color: 'green', label: 'Đang mở', type: 'open' },
  2: { color: 'red', label: 'Đã đóng', type: 'closed' },
};
const initialMockData = [
  {
    termId: '1',
    name: 'Kỳ thực tập Xuân 2026',
    startDate: '2026-01-01',
    endDate: '2026-04-30',
    status: 1,
  },
  {
    termId: '2',
    name: 'Kỳ thực tập Hè 2026',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    status: 0,
  },
  {
    termId: '3',
    name: 'Kỳ thực tập Thu 2025',
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    status: 2,
  },
  {
    termId: '4',
    name: 'Kỳ thực tập Hè 2025',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 2,
  },
  {
    termId: '5',
    name: 'Kỳ thực tập Xuân 2025',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 2,
  },
  {
    termId: '6',
    name: 'Kỳ thực tập Xuân 2025',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 2,
  },
  {
    termId: '7',
    name: 'Kỳ thực tập Xuân 2025',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 2,
  },
  {
    termId: '8',
    name: 'Kỳ thực tập Xuân 2025',
    startDate: '2025-01-01',
    endDate: '2025-04-30',
    status: 2,
  },
  {
    termId: '9',
    name: 'Kỳ thực tập Hè 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 2,
  },
  {
    termId: '10',
    name: 'Kỳ thực tập Thu 2024',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    status: 2,
  },
  {
    termId: '11',
    name: 'Kỳ thực tập Xuân 2024',
    startDate: '2024-01-01',
    endDate: '2024-04-30',
    status: 2,
  },
  {
    termId: '12',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
  {
    termId: '13',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
  {
    termId: '14',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
  {
    termId: '15',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
  {
    termId: '16',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
  {
    termId: '17',
    name: 'Kỳ thực tập dự phòng 2026',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 0,
  },
];
const TermFormDrawer = memo(function TermFormDrawer({
  visible,
  onCancel,
  onSave,
  loading,
  initialValues,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
        status: initialValues.status,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ status: 0 });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        status: initialValues ? initialValues.status : values.status,
      };

      onSave(payload, initialValues?.termId);
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  return (
    <Drawer
      open={visible}
      onClose={onCancel}
      size='large'
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div className='flex h-full flex-col bg-white'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-5 backdrop-blur-md'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>
              {initialValues ? 'Chỉnh sửa Kỳ thực tập' : 'Thêm Kỳ thực tập mới'}
            </h2>
            <p className='text-sm text-slate-500'>
              {initialValues
                ? 'Cập nhật thông tin cho kỳ thực tập đã chọn'
                : 'Điền thông tin để tạo kỳ thực tập mới'}
            </p>
          </div>
          <button
            type='button'
            onClick={onCancel}
            className='flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200'
          >
            <CloseOutlined />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-8'>
          <Form
            form={form}
            layout='vertical'
            name='termForm'
            className='space-y-6'
            validateTrigger='onSubmit'
            autoComplete='off'
            requiredMark={false}
          >
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-slate-700'>
                Tên kỳ thực tập <span className='text-primary'>*</span>
              </label>
              <div className='relative'>
                <Form.Item
                  name='name'
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên kỳ thực tập!' },
                    { max: 100, message: 'Tên kỳ thực tập không quá 100 ký tự!' },
                  ]}
                  className='m-0'
                >
                  <Input
                    className='focus:border-primary focus:ring-primary/20 w-full rounded-full border-slate-200 bg-white px-6 py-3 text-sm text-slate-900 transition-all outline-none'
                    placeholder='VD: Kỳ thực tập Xuân 2026'
                  />
                </Form.Item>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-slate-700'>
                  Ngày bắt đầu <span className='text-primary'>*</span>
                </label>
                <div className='group relative'>
                  <Form.Item
                    name='startDate'
                    rules={[{ required: true, message: 'Chọn ngày bắt đầu!' }]}
                    className='m-0'
                  >
                    <DatePicker
                      format='DD/MM/YYYY'
                      className='focus:border-primary focus:ring-primary/20 hover:border-primary w-full rounded-full border-slate-200 bg-white px-6 py-3 text-sm text-slate-900 transition-all outline-none [&_.ant-picker-input_input]:text-slate-900'
                      placeholder='DD/MM/YYYY'
                      suffixIcon={null}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-slate-700'>
                  Ngày kết thúc <span className='text-primary'>*</span>
                </label>
                <div className='group relative'>
                  <Form.Item
                    name='endDate'
                    dependencies={['startDate']}
                    rules={[
                      { required: true, message: 'Chọn ngày kết thúc!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            !getFieldValue('startDate') ||
                            value.isAfter(getFieldValue('startDate'))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                        },
                      }),
                    ]}
                    className='m-0'
                  >
                    <DatePicker
                      format='DD/MM/YYYY'
                      className='focus:border-primary focus:ring-primary/20 hover:border-primary w-full rounded-full border-slate-200 bg-white px-6 py-3 text-sm text-slate-900 transition-all outline-none [&_.ant-picker-input_input]:text-slate-900'
                      placeholder='DD/MM/YYYY'
                      suffixIcon={null}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {initialValues ? (
              <div className='flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6'>
                <label className='text-sm font-semibold text-slate-700'>Trạng thái hiện tại</label>
                <div className='flex items-center'>
                  {initialValues.status === 1 && (
                    <span className='bg-success/10 text-success ring-success/30 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ring-1'>
                      <span className='bg-success size-2 animate-pulse rounded-full'></span>
                      Đang mở (Open)
                    </span>
                  )}
                  {initialValues.status === 0 && (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700 ring-1 ring-gray-200'>
                      <span className='size-2 rounded-full bg-gray-400'></span>
                      Bản nháp (Draft)
                    </span>
                  )}
                  {initialValues.status === 2 && (
                    <span className='bg-danger/10 text-danger ring-danger/30 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ring-1'>
                      <span className='bg-danger size-2 rounded-full'></span>
                      Đã đóng (Closed)
                    </span>
                  )}
                </div>
                <p className='text-xs leading-relaxed text-slate-500 italic'>
                  Trạng thái được thay đổi qua nút chuyển trạng thái tại danh sách
                </p>
              </div>
            ) : (
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-slate-700'>
                  Trạng thái khởi tạo
                </label>
                <Form.Item name='status' rules={[{ required: true }]} className='m-0'>
                  <Select
                    className='[&_.ant-select-selector]:hover:border-primary [&_.ant-select-selector]:focus-within:border-primary [&_.ant-select-selector]:focus-within:ring-primary/20 h-12 w-full border-none [&_.ant-select-selection-item]:leading-[46px] [&_.ant-select-selector]:h-12 [&_.ant-select-selector]:rounded-full [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:px-6 [&_.ant-select-selector]:focus-within:ring-2'
                    options={[
                      { value: 0, label: 'Nháp (Draft)' },
                      { value: 1, label: 'Kích hoạt ngay' },
                    ]}
                  />
                </Form.Item>
                <p className='mt-1 px-2 text-xs text-slate-400 italic'>
                  Trạng thái nháp cho phép chỉnh sửa cấu hình trước khi công khai.
                </p>
              </div>
            )}
          </Form>
        </div>

        <div className='sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5'>
          <Button
            onClick={onCancel}
            className='flex h-12 items-center justify-center rounded-full border border-slate-200 bg-transparent px-8 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
          >
            Hủy bỏ
          </Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={loading}
            className='bg-primary hover:bg-primary-hover shadow-primary/20 flex h-12 items-center justify-center rounded-full border-none px-8 text-sm font-semibold text-white shadow-lg transition-all'
          >
            {initialValues ? 'Cập nhật' : 'Tạo Kỳ thực tập'}
          </Button>
        </div>
      </div>
    </Drawer>
  );
});
const TermHeader = memo(function TermHeader({ onCreateNew }) {
  return (
    <header className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Danh sách Kỳ thực tập</h1>
        <p className='mt-1 text-sm text-gray-500'>
          Quản lý và theo dõi các kỳ thực tập của sinh viên.
        </p>
      </div>
      <Button
        icon={<PlusOutlined />}
        onClick={onCreateNew}
        size='medium'
        className='!bg-primary hover:!bg-primary-hover cursor-pointer !border-none font-medium !text-white shadow-sm'
      >
        Thêm Kỳ Mới
      </Button>
    </header>
  );
});
const TermFilterBar = memo(function TermFilterBar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div className='flex w-full flex-1 items-center gap-3 sm:w-auto'>
        <Input
          placeholder='Tìm tên kỳ thực tập…'
          prefix={<SearchOutlined className='text-gray-400' />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className='max-w-md rounded-md'
          size='large'
          allowClear
          spellCheck={false}
          autoComplete='off'
        />
        <Select
          size='large'
          className='min-w-[160px]'
          value={statusFilter}
          onChange={onStatusChange}
          placeholder='Tất cả trạng thái'
          allowClear
          suffixIcon={<FilterOutlined className='text-gray-400' />}
          options={[
            { value: 1, label: 'Đang mở' },
            { value: 0, label: 'Bản nháp' },
            { value: 2, label: 'Đã đóng' },
          ]}
        />
      </div>
    </div>
  );
});
const TermTable = memo(function TermTable({
  data,
  loading,
  pagination,
  onEdit,
  onRequestDelete,
  onRequestChangeStatus,
}) {
  const columns = useMemo(
    () => [
      {
        title: 'TÊN KỲ',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <span className='font-medium text-gray-900'>{text}</span>,
      },
      {
        title: 'NGÀY BẮT ĐẦU',
        dataIndex: 'startDate',
        key: 'startDate',
        width: 150,
        render: (val) => dayjs(val).format('DD/MM/YYYY'),
      },
      {
        title: 'NGÀY KẾT THÚC',
        dataIndex: 'endDate',
        key: 'endDate',
        width: 150,
        render: (val) => dayjs(val).format('DD/MM/YYYY'),
      },
      {
        title: 'TRẠNG THÁI',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (status) => {
          const config = STATUS_CONFIG[status];
          if (!config) return null;
          return (
            <Tag
              color={config.color}
              className='m-0 rounded-full border-transparent px-2.5 py-0.5 font-medium'
            >
              {config.label}
            </Tag>
          );
        },
      },
      {
        title: 'THAO TÁC',
        key: 'action',
        width: 120,
        align: 'center',
        render: (_, record) => {
          const isClosed = record.status === 2;
          const isDraft = record.status === 0;
          const isOpen = record.status === 1;
          const items = [];

          if (isDraft) {
            items.push({
              key: 'open',
              label: 'Mở kỳ thực tập',
              onClick: () => onRequestChangeStatus(record, 1), // status: 1 = Open
            });
          }

          if (isOpen) {
            items.push({
              key: 'close',
              label: 'Đóng kỳ thực tập',
              onClick: () => onRequestChangeStatus(record, 2), // status: 2 = Closed
            });
          }
          items.push({
            key: 'delete',
            label: <span className='text-primary'>Xóa</span>,
            onClick: () => onRequestDelete(record),
          });
          return (
            <Space size='middle'>
              {isClosed ? (
                <Button
                  type='text'
                  icon={<EyeOutlined className='text-gray-400' />}
                  aria-label='Xem chi tiết'
                  disabled
                />
              ) : (
                <Button
                  type='text'
                  icon={<EditOutlined className='text-info' />}
                  aria-label='Chỉnh sửa'
                  onClick={() => onEdit(record)}
                />
              )}
              <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
                <Button type='text' icon={<EllipsisOutlined />} aria-label='Thêm thao tác' />
              </Dropdown>
            </Space>
          );
        },
      },
    ],
    [onEdit, onRequestDelete, onRequestChangeStatus],
  );
  return (
    <div className='flex-1 overflow-hidden rounded-lg border border-gray-200'>
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content', y: '500px' }}
        pagination={
          pagination !== false
            ? {
                ...pagination,
                showSizeChanger: false,
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} / ${total} kết quả`,
              }
            : false
        }
        loading={loading}
        rowKey='termId'
        size='middle'
        className='w-full'
      />
    </div>
  );
});
export default function InternshipTermManagement() {
  const [data, setData] = useState(initialMockData);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({ open: false, record: null });
  const [statusModalState, setStatusModalState] = useState({
    open: false,
    record: null,
    newStatus: null,
  });
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter !== undefined ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);
  // useEffect(() => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     current: 1,
  //   }));
  // }, [searchTerm, statusFilter]);
  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
  }, []);
  const handleCreateNew = useCallback(() => {
    setEditingRecord(null);
    setModalVisible(true);
  }, []);
  const handleEdit = useCallback((record) => {
    setEditingRecord(record);
    setModalVisible(true);
  }, []);
  const handleRequestDelete = useCallback((record) => {
    setDeleteModalState({ open: true, record });
  }, []);

  const handleRequestChangeStatus = useCallback((record, newStatus) => {
    setStatusModalState({ open: true, record, newStatus });
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteModalState.record) return;
    setData((prev) => prev.filter((item) => item.termId !== deleteModalState.record.termId));
    message.success('Xóa kỳ thực tập thành công');
    setDeleteModalState({ open: false, record: null });
  }, [deleteModalState.record]);

  const handleChangeStatus = useCallback(() => {
    if (!statusModalState.record || statusModalState.newStatus === null) return;
    setData((prev) =>
      prev.map((item) =>
        item.termId === statusModalState.record.termId
          ? { ...item, status: statusModalState.newStatus }
          : item,
      ),
    );
    message.success('Cập nhật trạng thái thành công');
    setStatusModalState({ open: false, record: null, newStatus: null });
  }, [statusModalState.record, statusModalState.newStatus]);
  const handleSaveModal = useCallback((payload, termId) => {
    setSubmitLoading(true);

    setTimeout(() => {
      if (termId) {
        setData((prev) =>
          prev.map((item) => (item.termId === termId ? { ...item, ...payload } : item)),
        );
        message.success('Cập nhật kỳ thực tập thành công!');
      } else {
        const newTerm = {
          termId: Date.now().toString(),
          ...payload,
        };
        setData((prev) => [newTerm, ...prev]);
        message.success('Tạo kỳ thực tập mới thành công!');
      }

      setSubmitLoading(false);
      setModalVisible(false);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
  }, []);
  return (
    <div className='flex h-[calc(100vh-48px)] w-full flex-col overflow-hidden'>
      <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6 overflow-hidden'>
        <TermHeader onCreateNew={handleCreateNew} />

        <section className='flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6'>
          <TermFilterBar
            searchValue={searchTerm}
            // onSearchChange={setSearchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            // onStatusChange={setStatusFilter}
            onStatusChange={handleStatusChange}
          />

          <TermTable
            data={paginatedData}
            loading={loading}
            pagination={false}
            onTableChange={handleTableChange}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
            onRequestChangeStatus={handleRequestChangeStatus}
          />

          <div className='mt-auto flex items-center justify-between border-t border-slate-100 px-2 pt-6'>
            <div className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
              Total: {filteredData.length}
            </div>
            <Pagination
              {...pagination}
              total={filteredData.length}
              showSizeChanger={false}
              onChange={(page) => handleTableChange({ current: page })}
              itemRender={(page, type, originalElement) => {
                if (type === 'prev') return <LeftOutlined />;
                if (type === 'next') return <RightOutlined />;
                return originalElement;
              }}
            />
          </div>
        </section>
      </div>
      <TermFormDrawer
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveModal}
        loading={submitLoading}
        initialValues={editingRecord}
      />

      <Modal
        open={deleteModalState.open}
        onCancel={() => setDeleteModalState({ open: false, record: null })}
        footer={null}
        closable={false}
        centered
        width={440}
        styles={{ content: { padding: 0, borderRadius: '0.75rem', overflow: 'hidden' } }}
      >
        <div className='flex flex-col items-center bg-white p-8 text-center'>
          <div className='bg-danger/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
            <WarningOutlined className='text-danger text-[28px]' />
          </div>
          <h3 className='mb-2 text-[20px] font-bold text-slate-900'>Xóa Kỳ thực tập?</h3>
          <p className='mb-8 text-sm leading-relaxed text-slate-500'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-semibold text-slate-700'>
              &quot;{deleteModalState.record?.name}&quot;
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div className='flex w-full items-center gap-3'>
            <Button
              onClick={() => setDeleteModalState({ open: false, record: null })}
              className='h-11 flex-1 rounded-full border border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50'
              type='default'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleDelete}
              className='bg-primary hover:bg-primary-hover shadow-primary/20 h-11 flex-1 rounded-full border-none text-sm font-bold text-white shadow-lg transition-colors'
              type='primary'
            >
              Xóa kỳ thực tập
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={statusModalState.open}
        onCancel={() => setStatusModalState({ open: false, record: null, newStatus: null })}
        footer={null}
        closable={false}
        centered
        width={440}
        styles={{ content: { padding: 0, borderRadius: '0.75rem', overflow: 'hidden' } }}
      >
        {(() => {
          const isOpening = statusModalState.newStatus === 1;
          const title = isOpening ? 'Mở Kỳ thực tập?' : 'Đóng Kỳ thực tập?';
          const bgIconClass = isOpening ? 'bg-info/10' : 'bg-danger/10';
          const confirmText = isOpening ? 'Xác nhận mở' : 'Xác nhận đóng';

          return (
            <div className='flex flex-col items-center bg-white p-8 text-center'>
              <div
                className={`h-16 w-16 rounded-full ${bgIconClass} mb-6 flex items-center justify-center`}
              >
                {isOpening ? (
                  <InfoCircleOutlined className='text-info text-4xl' />
                ) : (
                  <WarningOutlined className='text-danger text-4xl' />
                )}
              </div>
              <h3 className='mb-2 text-[20px] font-bold text-slate-900'>{title}</h3>
              <p className='mb-8 text-sm leading-relaxed text-slate-500'>
                {isOpening ? (
                  <>
                    Bạn có chắc chắn muốn chuyển{' '}
                    <span className='font-semibold text-slate-700'>
                      &quot;{statusModalState.record?.name}&quot;
                    </span>{' '}
                    từ trạng thái <span className='italic'>Nháp</span> sang{' '}
                    <span className='italic'>Mở</span>? Sinh viên sẽ có thể đăng ký tham gia.
                  </>
                ) : (
                  <>
                    Bạn có chắc chắn muốn chuyển{' '}
                    <span className='font-semibold text-slate-700'>
                      &quot;{statusModalState.record?.name}&quot;
                    </span>{' '}
                    sang trạng thái <span className='italic'>Đóng</span>? Sinh viên sẽ không thể
                    đăng ký hay thay đổi thông tin nữa.
                  </>
                )}
              </p>
              <div className='flex w-full items-center gap-3'>
                <Button
                  onClick={() =>
                    setStatusModalState({ open: false, record: null, newStatus: null })
                  }
                  className='h-11 flex-1 rounded-full border border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50'
                  type='default'
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleChangeStatus}
                  className='bg-primary hover:bg-primary-hover shadow-primary/20 h-11 flex-1 rounded-full border-none text-sm font-bold text-white shadow-lg transition-colors'
                  type='primary'
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}


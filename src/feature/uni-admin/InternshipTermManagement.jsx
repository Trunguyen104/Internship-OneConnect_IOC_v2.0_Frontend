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
      form.setFieldsValue({ status: 0 }); // default draft
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
      width={480}
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      <div className='flex flex-col h-full bg-white'>
        {/* Drawer Header */}
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
            className='flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>

        {/* Drawer Body / Form */}
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
            {/* Term Name Input */}
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
                    className='w-full rounded-full border-slate-200 bg-white px-6 py-3 text-slate-900 focus:border-primary focus:ring-primary/20 transition-all outline-none text-sm'
                    placeholder='VD: Kỳ thực tập Xuân 2026'
                  />
                </Form.Item>
              </div>
            </div>

            {/* Date Pickers */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-slate-700'>
                  Ngày bắt đầu <span className='text-primary'>*</span>
                </label>
                <div className='relative group'>
                  <Form.Item
                    name='startDate'
                    rules={[{ required: true, message: 'Chọn ngày bắt đầu!' }]}
                    className='m-0'
                  >
                    <DatePicker
                      format='DD/MM/YYYY'
                      className='w-full rounded-full border-slate-200 bg-white px-6 py-3 text-slate-900 focus:border-primary focus:ring-primary/20 hover:border-primary outline-none transition-all text-sm [&_.ant-picker-input_input]:text-slate-900'
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
                <div className='relative group'>
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
                      className='w-full rounded-full border-slate-200 bg-white px-6 py-3 text-slate-900 focus:border-primary focus:ring-primary/20 hover:border-primary outline-none transition-all text-sm [&_.ant-picker-input_input]:text-slate-900'
                      placeholder='DD/MM/YYYY'
                      suffixIcon={null}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Status Section */}
            {initialValues ? (
              <div className='flex flex-col gap-3 rounded-2xl bg-slate-50 p-6 border border-slate-100'>
                <label className='text-sm font-semibold text-slate-700'>Trạng thái hiện tại</label>
                <div className='flex items-center'>
                  {initialValues.status === 1 && (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-success/10 px-4 py-1.5 text-sm font-bold text-success ring-1 ring-success/30'>
                      <span className='size-2 rounded-full bg-success animate-pulse'></span>
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
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-4 py-1.5 text-sm font-bold text-danger ring-1 ring-danger/30'>
                      <span className='size-2 rounded-full bg-danger'></span>
                      Đã đóng (Closed)
                    </span>
                  )}
                </div>
                <p className='text-xs italic text-slate-500 leading-relaxed'>
                  Trạng thái được thay đổi qua nút chuyển trạng thái tại danh sách
                </p>
              </div>
            ) : (
              <div className='space-y-2'>
                <label className='block text-sm font-semibold text-slate-700'>
                  Trạng thái khởi tạo
                </label>
                <Form.Item name='status' rules={[{ required: true }]} className='m-0'>
                  <Select className='w-full h-12 [&_.ant-select-selector]:h-12 border-none [&_.ant-select-selector]:rounded-full [&_.ant-select-selector]:px-6 [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:hover:border-primary [&_.ant-select-selector]:focus-within:border-primary [&_.ant-select-selector]:focus-within:ring-2 [&_.ant-select-selector]:focus-within:ring-primary/20 [&_.ant-select-selection-item]:leading-[46px]'>
                    <Select.Option value={0}>Nháp (Draft)</Select.Option>
                    <Select.Option value={1}>Kích hoạt ngay</Select.Option>
                  </Select>
                </Form.Item>
                <p className='text-xs text-slate-400 px-2 italic mt-1'>
                  Trạng thái nháp cho phép chỉnh sửa cấu hình trước khi công khai.
                </p>
                <div className='p-6 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 mt-6'>
                  {/* <span className='material-symbols-outlined text-primary'>info</span> */}
                  <div className='space-y-1'>
                    <p className='text-sm font-semibold text-primary'>Lưu ý</p>
                    <p className='text-xs text-slate-600 leading-relaxed'>
                      Khi tạo kỳ thực tập, hệ thống sẽ tự động khởi tạo danh sách điểm danh và báo
                      cáo tương ứng cho kỳ này.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Placeholder Info */}
            {initialValues && (
              <div className='pt-4 border-t border-slate-100'>
                <div className='flex items-start gap-4 text-slate-500'>
                  <span className='material-symbols-outlined text-xl'>info</span>
                  <p className='text-xs leading-relaxed'>
                    Mọi thay đổi sẽ được ghi nhật ký hệ thống. Vui lòng kiểm tra kỹ thời hạn bắt đầu
                    và kết thúc trước khi lưu.
                  </p>
                </div>
              </div>
            )}
          </Form>
        </div>

        {/* Footer */}
        <div className='px-6 py-5 border-t border-slate-100 bg-white sticky bottom-0 flex items-center justify-end gap-3'>
          <Button
            onClick={onCancel}
            className='flex items-center justify-center h-12 px-8 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm bg-transparent'
          >
            Hủy bỏ
          </Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={loading}
            className='flex items-center justify-center h-12 px-8 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 text-sm border-none'
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
    <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-900 m-0'>Danh sách Kỳ thực tập</h1>
        <p className='text-gray-500 text-sm mt-1'>
          Quản lý và theo dõi các kỳ thực tập của sinh viên.
        </p>
      </div>
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={onCreateNew}
        size='large'
        className='shadow-sm font-medium'
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
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
      <div className='flex flex-1 items-center gap-3 w-full sm:w-auto'>
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
        >
          <Select.Option value={1}>Đang mở</Select.Option>
          <Select.Option value={0}>Bản nháp</Select.Option>
          <Select.Option value={2}>Đã đóng</Select.Option>
        </Select>
      </div>
    </div>
  );
});
const TermTable = memo(function TermTable({
  data,
  loading,
  pagination,
  onTableChange,
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
              className='m-0 px-2.5 py-0.5 rounded-full font-medium border-transparent'
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
        scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
        pagination={
          pagination !== false
            ? {
                ...pagination,
                showSizeChanger: false,
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} / ${total} kết quả`,
              }
            : false
        }
        onChange={onTableChange}
        loading={loading}
        rowKey='termId'
        className='w-full'
      />
    </div>
  );
});
export default function InternshipTermManagement() {
  const [data, setData] = useState(initialMockData);
  // const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: initialMockData.length,
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
  //     total: filteredData.length,
  //     current: 1,
  //   }));
  // }, [filteredData.length, searchTerm, statusFilter]);
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
    <div className='h-[calc(100vh-48px)] w-full flex flex-col overflow-hidden'>
      <div className='max-w-7xl w-full mx-auto flex-1 flex flex-col overflow-hidden space-y-6'>
        <TermHeader onCreateNew={handleCreateNew} />

        <section className='bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden'>
          <TermFilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
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
        </section>
        <div className='flex justify-end p-4'>
          <Pagination
            {...pagination}
            total={filteredData.length}
            showSizeChanger={false}
            onChange={(page) => handleTableChange({ current: page })}
            showTotal={(total, range) => `Hiển thị ${range[0]}-${range[1]} / ${total} kết quả`}
          />
        </div>
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
        <div className='bg-white flex flex-col items-center text-center p-8'>
          <div className='w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6'>
            <span className='material-symbols-outlined text-danger text-4xl font-bold'>
              warning
            </span>
          </div>
          <h3 className='text-[20px] font-bold text-slate-900 mb-2'>Xóa Kỳ thực tập?</h3>
          <p className='text-sm text-slate-500 leading-relaxed mb-8'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-semibold text-slate-700'>
              &quot;{deleteModalState.record?.name}&quot;
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div className='flex items-center gap-3 w-full'>
            <Button
              onClick={() => setDeleteModalState({ open: false, record: null })}
              className='flex-1 h-11 rounded-full border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors'
              type='default'
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleDelete}
              className='flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 border-none'
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
          const icon = isOpening ? 'info' : 'warning';
          const iconColorClass = isOpening ? 'text-info' : 'text-danger';
          const bgIconClass = isOpening ? 'bg-info/10' : 'bg-danger/10';
          const confirmText = isOpening ? 'Xác nhận mở' : 'Xác nhận đóng';

          return (
            <div className='bg-white flex flex-col items-center text-center p-8'>
              <div
                className={`w-16 h-16 rounded-full ${bgIconClass} flex items-center justify-center mb-6`}
              >
                <span className={`material-symbols-outlined ${iconColorClass} text-4xl`}>
                  {icon}
                </span>
              </div>
              <h3 className='text-[20px] font-bold text-slate-900 mb-2'>{title}</h3>
              <p className='text-sm text-slate-500 leading-relaxed mb-8'>
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
              <div className='flex items-center gap-3 w-full'>
                <Button
                  onClick={() =>
                    setStatusModalState({ open: false, record: null, newStatus: null })
                  }
                  className='flex-1 h-11 rounded-full border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors'
                  type='default'
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleChangeStatus}
                  className='flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 border-none'
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

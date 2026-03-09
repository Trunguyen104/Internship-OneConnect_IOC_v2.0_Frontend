'use client';

import React, { useState, useMemo, memo } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tooltip,
  Modal,
  Upload,
  message,
  Drawer,
  Dropdown,
} from 'antd';
const { Dragger } = Upload;
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  UserAddOutlined,
  UploadOutlined,
  UserDeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  SettingOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  StarFilled,
} from '@ant-design/icons';

// --- MOCK DATA ---
const MOCK_STUDENTS = [
  {
    id: 'STD-2024-001',
    name: 'Alex Thompson',
    major: 'Computer Science',
    status: 'placed',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSYNM47g2R488MRz_0bdvvp9v6RGzUECAnIvRYJXA5IEF524EYL068komdPrN6cVWeIa3cAFqUtdDZWcdJAo5KMz2-7iqJGqPyBJDVgROUhpuiT0susiVTYzD-9TtJRkQN_T9YFphu-1vZzvVHzJzM4bRuVOULvgYDhceob-K6aefAvL3wlS8oGBy9eWIgs6KvrlJHfsYKMXJr0RNOlwz7F15f5fobkFrFKuBfgBJl0G29WpEewOyp7xKus73Pr1dVeWj56Hed178',
  },
  {
    id: 'STD-2024-012',
    name: 'Sarah Jenkins',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFmtqCVrgnlnyV6DpSc_3cjgSf18ckHg-Zj2igwD9EtR75c4L6VtVB_OXYgYbziWarRg5Tzqlzs3MGuZiijza_hhLgcx4yx88Npzhd0-0UuwgqD5C-DMYk08sLnQaqBQVVdVl3Pee2OM9BbdrcZGOU8fZwcLzWsVa_bA0qyNbYyYPT6C06Ayn7T2ZJQmDOUC7QKtG8XffZm52CCoJhyFr4cZIBnyR1WqJaeWvgXndlJx30eHRabauiYFN-EawxHc-8PmdZKKm6-dQ',
  },
  {
    id: 'STD-2024-005',
    name: 'Marcus Chen',
    major: 'Mechanical Engineering',
    status: 'withdrawn',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7tFdi9BwVA9DpAOCrRCAqi2zGKLepUoadDUQpWb0_INfSEHysiL9hYmAGFbwpIu0Kpm4a7mBbro4Nh5rwHWKPVCpwXjIuTdMpKZwU_zcOogtGmCKcGJh0ih_f25_-hhg3TE-FEBEDq9wogrYFCGyErYw3-OPpjOe-dbzqfQkQpsYTxtcx9TAmrsxklrNdSq_BoUHG-bz3X8UoXnNUDwOjEwD0D3-GyxjQI-5QUGHGk9jYVlQq1ABYPcEMog3ZimlTbkBStNRgDsg',
  },
  {
    id: 'STD-2024-022',
    name: 'Elena Rodriguez',
    major: 'Computer Science',
    status: 'placed',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSiyx87duWhGJKN18nH8VOxw9soHNolaQgP5gFoxG-8w6vKbBsFRpVJw2yZnooGoS1GcwHIa10Fad4WNONqvEY9mhmOGQ2u5f5TNJAhRotg7NnxjWQLbvYMMtmjEkNXw9WeLbzsZUAupYCsLCHX-sZKHGxHlOs1g9zhgeX77UsIO6XFmhErq9gZrlzi90UzR6pU7oEGWHHqbSFQMtpgPQijpYyAQXe90kCxyWjq6P4rStJOaM_DqXmz9cyp_s5uhlOEqu9DiAwDN8',
  },
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
];

const STATUS_CONFIG = {
  placed: {
    label: 'Placed',
    bgClass: 'bg-green-100',
    textClass: 'text-green-700',
    borderClass: 'border-green-200',
    dotClass: 'bg-green-500',
  },
  unplaced: {
    label: 'Unplaced',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-600',
    borderClass: 'border-slate-200',
    dotClass: 'bg-slate-400',
  },
  withdrawn: {
    label: 'Withdrawn',
    bgClass: 'bg-red-100',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    dotClass: 'bg-red-500',
  },
};

const MOCK_IMPORT_PREVIEW = [
  { id: '1', name: 'Michael Jordan', studentId: 'ST010', email: 'm.j@edu.com', valid: true },
  {
    id: '2',
    name: 'Sarah Connor',
    studentId: '---',
    email: 's.connor@edu.com',
    valid: false,
    error: 'Missing ID',
  },
  {
    id: '3',
    name: 'Robert Paulson',
    studentId: 'ST012',
    email: 'robert@domain',
    valid: false,
    error: 'Invalid Email',
  },
];

const HeaderActions = memo(function HeaderActions({ onImport, onAdd }) {
  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
      <div>
        <h1 className='text-4xl font-bold text-slate-900'>Term Students</h1>
        <p className='text-slate-500 mt-2'>
          Manage enrollment and placement for the current academic term.
        </p>
      </div>
      <Space size='middle' wrap>
        <Button
          type='primary'
          icon={<UserAddOutlined />}
          size='large'
          className='bg-[#d52020] hover:!bg-[#d52020]/90 font-bold rounded-full border-none shadow-md shadow-[#d52020]/20'
          onClick={onAdd}
        >
          Thêm sinh viên
        </Button>
        <Button
          icon={<UploadOutlined />}
          size='large'
          className='text-[#d52020] font-bold rounded-full border-[#d52020]/20 hover:!text-[#d52020] hover:!border-[#d52020] hover:!bg-[#d52020]/5 focus:!text-[#d52020] focus:!border-[#d52020]'
          onClick={onImport}
        >
          Nhập từ Excel
        </Button>
        <Button
          icon={<UserDeleteOutlined />}
          size='large'
          className='rounded-full text-slate-400 bg-slate-50 border-slate-200'
          disabled
        >
          Rút lui
        </Button>
      </Space>
    </div>
  );
});

const FiltersAndSearch = memo(function FiltersAndSearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  majorFilter,
  onMajorFilterChange,
}) {
  return (
    <div className='bg-white rounded-[2rem] p-2 pl-4 pr-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center'>
      <div className='flex-1 w-full'>
        <Input
          prefix={<SearchOutlined className='text-slate-400 mr-2 text-lg' />}
          placeholder='Tìm kiếm theo tên hoặc MSSV...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size='large'
          className='w-full border-none shadow-none hover:bg-slate-50 focus-within:bg-slate-50 rounded-full bg-transparent'
          style={{ padding: '8px 16px' }}
        />
      </div>

      <div className='h-8 w-[1px] bg-slate-200 hidden md:block'></div>

      <Space size='middle' className='w-full md:w-auto flex-wrap md:flex-nowrap' wrap={false}>
        <Select
          allowClear
          placeholder='Trạng thái: Tất cả'
          size='large'
          value={statusFilter || undefined}
          onChange={(value) => onStatusFilterChange(value || '')}
          className='min-w-[160px]'
          variant='borderless'
          options={[
            { value: 'placed', label: 'Đã sắp xếp' },
            { value: 'unplaced', label: 'Chưa sắp xếp' },
            { value: 'withdrawn', label: 'Đã rút' },
          ]}
        />

        <div className='h-6 w-[1px] bg-slate-200 hidden md:block'></div>

        <Select
          allowClear
          placeholder='Ngành học: Tất cả'
          size='large'
          value={majorFilter || undefined}
          onChange={(value) => onMajorFilterChange(value || '')}
          className='min-w-[180px]'
          variant='borderless'
          options={[
            { value: 'Computer Science', label: 'Computer Science' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Business Administration', label: 'Business Admin' },
            { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
          ]}
        />
      </Space>
    </div>
  );
});

const DataGrid = memo(function DataGrid({ students, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0'>
            <img
              className='w-full h-full object-cover'
              alt={`Avatar của ${text}`}
              src={record.avatar}
              loading='lazy'
            />
          </div>
          <span className='font-medium text-slate-900'>{text}</span>
        </div>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <span className='font-mono text-slate-600'>{text}</span>,
    },
    {
      title: 'Ngành học',
      dataIndex: 'major',
      key: 'major',
      render: (text) => <span className='text-slate-600'>{text}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.unplaced;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
            {config.label}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2 text-slate-400'>
          <Tooltip title='Xem chi tiết'>
            <Button
              type='text'
              shape='circle'
              icon={<EyeOutlined />}
              className='hover:text-[#d52020] hover:bg-[#d52020]/5'
              onClick={(e) => {
                e.stopPropagation();
                onView(record);
              }}
            />
          </Tooltip>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='text'
              shape='circle'
              icon={<EditOutlined />}
              className='hover:text-[#d52020] hover:bg-[#d52020]/5'
              onClick={(e) => {
                e.stopPropagation();
                onEdit(record);
              }}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: 'Xóa sinh viên',
                  icon: <UserDeleteOutlined />,
                  danger: true,
                  onClick: (e) => {
                    e.domEvent.stopPropagation();
                    onDelete(record);
                  },
                },
              ],
            }}
            trigger={['click']}
          >
            <Tooltip title='Tùy chọn'>
              <Button
                type='text'
                shape='circle'
                icon={<MoreOutlined />}
                className='hover:text-[#d52020] hover:bg-[#d52020]/5'
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Dropdown>
        </div>
      ),
      width: 140,
    },
  ];

  return (
    <div className='bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex-1 overflow-hidden flex flex-col'>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={students}
        scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
        pagination={{
          total: 124,
          showTotal: (total, range) => (
            <span className='text-slate-500'>
              Hiển thị <span className='font-bold text-slate-900'>{range[0]}</span> đến{' '}
              <span className='font-bold text-slate-900'>{range[1]}</span> trong{' '}
              <span className='font-bold text-slate-900'>{total}</span> sinh viên
            </span>
          ),
          defaultPageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          position: ['bottomCenter'],
          className: '!px-4 !py-4 !m-0 border-t border-slate-100',
        }}
        rowSelection={{} /* Basic row selection */}
        className='custom-antd-table flex-1'
        style={{ '--ant-color-primary': '#d52020' }}
      />
    </div>
  );
});

const ImportModal = memo(function ImportModal({ visible, onClose }) {
  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '#',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const previewColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className='text-slate-600 font-medium'>{text}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (text) => <span className='text-slate-600'>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span className='text-slate-600'>{text}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      render: (_, record) =>
        record.valid ? (
          <Tooltip title='Valid'>
            <CheckCircleOutlined className='text-green-500 text-lg' />
          </Tooltip>
        ) : (
          <Tooltip title={record.error}>
            <ExclamationCircleOutlined className='text-[#d52020] text-lg' />
          </Tooltip>
        ),
    },
  ];

  return (
    <Modal
      title={<span className='text-xl font-bold text-slate-900'>Import Students</span>}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button
          key='cancel'
          onClick={onClose}
          shape='round'
          size='large'
          className='font-bold text-slate-600 border-none bg-slate-100 hover:!bg-slate-200'
        >
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          shape='round'
          size='large'
          className='bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90 border-none'
          onClick={onClose}
        >
          Confirm Import
        </Button>,
      ]}
      className='custom-import-modal'
    >
      <div className='py-2'>
        <Dragger
          {...uploadProps}
          className='bg-[#d52020]/5 border-[#d52020]/30 hover:border-[#d52020]/50 transition-colors rounded-xl p-8 mb-6'
        >
          <p className='ant-upload-drag-icon'>
            <div className='bg-[#d52020]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
              <UploadOutlined className='text-[#d52020] text-3xl' />
            </div>
          </p>
          <p className='ant-upload-text text-lg font-bold text-slate-900'>
            Drag &amp; Drop Excel File
          </p>
          <p className='ant-upload-hint text-sm text-slate-500 mt-1'>
            or click to browse from your computer
          </p>
          <Button shape='round' className='mt-6 font-bold border-[#d52020]/20 text-slate-700'>
            Select File
          </Button>
        </Dragger>

        <div className='relative flex items-center py-2 mb-2'>
          <div className='flex-grow border-t border-[#d52020]/10'></div>
          <span className='flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400'>
            Import Preview
          </span>
          <div className='flex-grow border-t border-[#d52020]/10'></div>
        </div>

        <Table
          dataSource={MOCK_IMPORT_PREVIEW}
          columns={previewColumns}
          pagination={false}
          size='middle'
          rowKey='id'
          className='border border-[#d52020]/10 rounded-lg overflow-hidden custom-antd-table'
          rowClassName={(record) => (record.valid ? '' : 'bg-red-50/50')}
        />
      </div>
    </Modal>
  );
});

const AddStudentModal = memo(function AddStudentModal({ visible, onClose }) {
  return (
    <Modal
      title={
        <div className='flex items-center gap-3 text-slate-900'>
          <div className='bg-[#d52020]/10 p-2 rounded-lg text-[#d52020] inline-flex'>
            <UserAddOutlined className='text-xl' />
          </div>
          <span className='text-xl font-bold tracking-tight'>Add New Student</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={560}
      footer={
        <div className='px-2 py-2 flex items-center justify-end gap-4 mt-6'>
          <Button
            onClick={onClose}
            shape='round'
            size='large'
            className='font-semibold text-slate-600 border-none bg-slate-100 hover:!bg-slate-200'
          >
            Cancel
          </Button>
          <Button
            type='primary'
            shape='round'
            size='large'
            className='bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90 border-none flex items-center gap-2'
            onClick={onClose}
          >
            <span>Save Student</span>
            <CheckCircleOutlined />
          </Button>
        </div>
      }
      className='custom-add-student-modal'
      closeIcon={
        <span className='material-symbols-outlined text-slate-500 hover:text-slate-800 transition-colors'>
          close
        </span>
      }
    >
      <div className='pt-6 pb-2 space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Full Name</label>
          <Input
            size='large'
            prefix={<UserOutlined className='text-slate-400 text-lg mr-2' />}
            placeholder='e.g. John Doe'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Student Code</label>
          <Input
            size='large'
            prefix={<IdcardOutlined className='text-slate-400 text-lg mr-2' />}
            placeholder='e.g. STU-2024-001'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Email Address</label>
          <Input
            size='large'
            type='email'
            prefix={<MailOutlined className='text-slate-400 text-lg mr-2' />}
            placeholder='e.g. john@university.edu'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-slate-700 text-sm font-semibold'>Phone Number</label>
            <Input
              size='large'
              type='tel'
              prefix={<PhoneOutlined className='text-slate-400 text-lg mr-2' />}
              placeholder='+1 (555) 000-0000'
              className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-slate-700 text-sm font-semibold'>Date of Birth</label>
            <Input
              size='large'
              type='date'
              prefix={<CalendarOutlined className='text-slate-400 text-lg mr-2' />}
              className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
            />
          </div>
        </div>
      </div>
    </Modal>
  );
});

const EditStudentModal = memo(function EditStudentModal({ visible, onClose, student }) {
  if (!student) return null;

  return (
    <Modal
      title={
        <div className='flex items-center gap-3 text-slate-900'>
          <div className='bg-[#d52020]/10 p-2 rounded-lg text-[#d52020] inline-flex'>
            <EditOutlined className='text-xl' />
          </div>
          <span className='text-xl font-bold tracking-tight'>Chỉnh sửa Sinh viên</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={560}
      footer={
        <div className='px-2 py-2 flex items-center justify-end gap-4 mt-6'>
          <Button
            onClick={onClose}
            shape='round'
            size='large'
            className='font-semibold text-slate-600 border-none bg-slate-100 hover:!bg-slate-200'
          >
            Cancel
          </Button>
          <Button
            type='primary'
            shape='round'
            size='large'
            className='bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90 border-none flex items-center gap-2'
            onClick={onClose}
          >
            <span>Save Changes</span>
            <CheckCircleOutlined />
          </Button>
        </div>
      }
      className='custom-add-student-modal'
      closeIcon={
        <span className='material-symbols-outlined text-slate-500 hover:text-slate-800 transition-colors'>
          close
        </span>
      }
    >
      <div className='pt-6 pb-2 space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Full Name</label>
          <Input
            size='large'
            prefix={<UserOutlined className='text-slate-400 text-lg mr-2' />}
            defaultValue={student.name}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Student Code</label>
          <Input
            size='large'
            prefix={<IdcardOutlined className='text-slate-400 text-lg mr-2' />}
            defaultValue={student.id}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-slate-700 text-sm font-semibold'>Email Address</label>
          <Input
            size='large'
            type='email'
            prefix={<MailOutlined className='text-slate-400 text-lg mr-2' />}
            defaultValue={`${student.id.toLowerCase()}@university.edu`}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:ring-2 focus-within:ring-[#d52020]/20 focus-within:border-[#d52020]'
          />
        </div>
      </div>
    </Modal>
  );
});

const StudentDetailsDrawer = memo(function StudentDetailsDrawer({ visible, onClose, student }) {
  if (!student) return null;
  const statusCfg = STATUS_CONFIG[student.status] || STATUS_CONFIG.unplaced;

  return (
    <Drawer
      title={
        <div className='flex items-center gap-4'>
          <div className='bg-[#d52020]/10 p-2 rounded-full text-[#d52020]'>
            <UserOutlined className='text-xl' />
          </div>
          <div>
            <h2 className='text-slate-900 text-xl font-bold leading-tight m-0'>Student Details</h2>
            <p className='text-slate-500 text-xs font-medium uppercase tracking-wider m-0'>
              Placement Portal
            </p>
          </div>
        </div>
      }
      placement='right'
      onClose={onClose}
      open={visible}
      width={480}
      closeIcon={
        <span className='material-symbols-outlined text-slate-500 hover:text-[#d52020] transition-colors'>
          close
        </span>
      }
      className='custom-student-drawer'
      styles={{
        header: { borderBottom: '1px solid rgba(213, 32, 32, 0.1)', padding: '24px' },
        body: { padding: 0 },
      }}
      footer={
        <div className='flex gap-4'>
          <Button
            size='large'
            className='flex-1 rounded-xl border-2 border-[#d52020]/10 text-slate-600 font-bold'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            size='large'
            className='flex-1 rounded-xl bg-[#d52020] font-bold shadow-lg shadow-[#d52020]/20 border-none hover:!bg-[#d52020]/90'
          >
            Update Details
          </Button>
        </div>
      }
    >
      <div className='p-6 space-y-8 bg-[#f8f6f6] h-full'>
        {/* Header Profile Section */}
        <div className='flex items-start gap-6 pt-2'>
          <div
            className='bg-center bg-no-repeat bg-cover rounded-xl min-h-24 w-24 border-4 border-white shadow-sm flex-shrink-0'
            style={{ backgroundImage: `url("${student.avatar}")`, aspectRatio: '1/1' }}
          />
          <div className='flex flex-col justify-center gap-1'>
            <h3 className='text-slate-900 text-2xl font-bold tracking-tight m-0'>{student.name}</h3>
            <p className='text-slate-500 text-sm font-medium m-0'>
              ID: <span className='text-[#d52020]'>{student.id}</span>
            </p>
            <div className='mt-2 flex'>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-${statusCfg.bgClass.split('-')[1]}-100 text-${statusCfg.textClass.split('-')[1]}-700 border ${statusCfg.borderClass}`}
              >
                <span className={`size-2 rounded-full ${statusCfg.dotClass} mr-2`}></span>
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <InfoCircleOutlined className='text-[#d52020] text-xl' />
            <h2 className='text-slate-900 text-lg font-bold m-0'>Personal Information</h2>
          </div>
          <div className='bg-white rounded-2xl border border-[#d52020]/5 p-1'>
            <div className='grid grid-cols-3 border-b border-[#d52020]/5 py-4 px-4'>
              <p className='text-slate-500 text-sm font-medium m-0'>Email</p>
              <p className='text-slate-900 text-sm font-medium col-span-2 m-0'>
                {student.id.toLowerCase()}@university.edu
              </p>
            </div>
            <div className='grid grid-cols-3 border-b border-[#d52020]/5 py-4 px-4'>
              <p className='text-slate-500 text-sm font-medium m-0'>Phone</p>
              <p className='text-slate-900 text-sm font-medium col-span-2 m-0'>+1 (555) 012-3456</p>
            </div>
            <div className='grid grid-cols-3 py-4 px-4'>
              <p className='text-slate-500 text-sm font-medium m-0'>Major</p>
              <p className='text-slate-900 text-sm font-medium col-span-2 m-0'>{student.major}</p>
            </div>
          </div>
        </section>

        {/* Placement Settings */}
        <section>
          <div className='flex items-center gap-2 mb-4'>
            <SettingOutlined className='text-[#d52020] text-xl' />
            <h2 className='text-slate-900 text-lg font-bold m-0'>Placement Settings</h2>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-bold text-slate-700 mb-2'>
                Placement Status
              </label>
              <Select
                defaultValue={student.status}
                size='large'
                className='w-full custom-details-select'
                options={[
                  { value: 'unplaced', label: 'Unplaced' },
                  { value: 'placed', label: 'Placed' },
                  { value: 'withdrawn', label: 'Withdrawn' },
                ]}
              />
            </div>
            <div>
              <label className='block text-sm font-bold text-slate-700 mb-2'>Enterprise</label>
              <Input
                size='large'
                prefix={<SearchOutlined className='text-slate-400 text-lg mr-2' />}
                placeholder='Search enterprise...'
                defaultValue={student.status === 'placed' ? 'Global Tech Solutions' : ''}
                className='rounded-xl border-[#d52020]/20 py-3'
              />
            </div>
          </div>
        </section>

        {/* Feedback History */}
        <section>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <HistoryOutlined className='text-[#d52020] text-xl' />
              <h2 className='text-slate-900 text-lg font-bold m-0'>Feedback History</h2>
            </div>
            <button className='text-[#d52020] text-sm font-bold flex items-center gap-1 hover:underline bg-transparent border-none cursor-pointer'>
              View All
            </button>
          </div>
          <div className='space-y-3'>
            <div className='bg-white p-4 rounded-xl border border-[#d52020]/10 shadow-sm'>
              <div className='flex justify-between items-start mb-2'>
                <p className='text-slate-900 font-bold text-sm m-0'>Final Technical Interview</p>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>2 days ago</span>
              </div>
              <p className='text-slate-600 text-xs leading-relaxed m-0'>
                Candidate showed exceptional problem-solving skills and knowledge of distributed
                systems. Highly recommended.
              </p>
              <div className='mt-3 flex items-center gap-2'>
                <div className='size-6 rounded-full bg-[#d52020]/20 flex items-center justify-center'>
                  <StarFilled className='text-[#d52020] text-[12px]' />
                </div>
                <span className='text-xs font-bold text-slate-700'>Rating: 4.8/5.0</span>
              </div>
            </div>
            <div className='bg-white p-4 rounded-xl border border-[#d52020]/10 shadow-sm'>
              <div className='flex justify-between items-start mb-2'>
                <p className='text-slate-900 font-bold text-sm m-0'>HR Culture Fit</p>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>1 week ago</span>
              </div>
              <p className='text-slate-600 text-xs leading-relaxed m-0'>
                Good communication skills and alignment with company values.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
});

// --- MAIN COMPONENT ---

export default function StudentEnrollment() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');

  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? student.status === statusFilter : true;
      const matchMajor = majorFilter ? student.major === majorFilter : true;
      return matchSearch && matchStatus && matchMajor;
    });
  }, [students, searchTerm, statusFilter, majorFilter]);

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewDrawerVisible(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalVisible(true);
  };

  const handleDelete = (student) => {
    Modal.confirm({
      title: 'Xóa sinh viên',
      content: `Bạn có chắc chắn muốn xóa sinh viên ${student.name} (${student.id}) không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        message.success('Đã xóa sinh viên thành công');
      },
    });
  };

  return (
    <div className='flex-1 flex flex-col p-6 lg:p-10 font-[family-name:var(--font-primary)] overflow-hidden bg-[#FCFAFA] h-full'>
      <div className='max-w-7xl mx-auto flex flex-col flex-1 overflow-hidden w-full'>
        <HeaderActions
          onImport={() => setIsImportModalVisible(true)}
          onAdd={() => setIsAddModalVisible(true)}
        />
        <FiltersAndSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          majorFilter={majorFilter}
          onMajorFilterChange={setMajorFilter}
        />
        <DataGrid
          students={filteredStudents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ImportModal visible={isImportModalVisible} onClose={() => setIsImportModalVisible(false)} />
      <AddStudentModal visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)} />

      <EditStudentModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      <StudentDetailsDrawer
        visible={isViewDrawerVisible}
        onClose={() => {
          setIsViewDrawerVisible(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />
    </div>
  );
}

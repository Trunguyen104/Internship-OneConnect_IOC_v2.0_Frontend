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
  Avatar,
  Pagination,
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
  InfoCircleOutlined,
  CloseOutlined,
  HistoryOutlined,
  SettingOutlined,
  StarFilled,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
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
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
  {
    id: 'STD-2024-088',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
  },
  {
    id: 'STD-2024-081',
    name: 'David Wilson',
    major: 'Business Administration',
    status: 'unplaced',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbJv1cp6TT-CGnLpDk9CRuAQr0wxEsDCj_NC-56Q3zczU4x2OXumHX7ScPhgNgEsqMe2ZQA_q7vqeKer-sU_CqosTfYWc0lGCl6Wku3vCfFcvIDlSoVLT8RF6tHBEu079vdovQHB9fyy-BuVVuYo5ZdrGUuemHAawNS2j1HmrYgRgSnlk0XDO4X_bVyPCOTp7_y5qQC-soh-Q_G_OEEV6F0Vmu9cla-LiPmimxNXjyOPtmxb_R4I_-3_V3I3lNm4iDkdnbTE8ps',
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
const STATUS_STYLES = {
  placed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    label: 'Placed',
    dot: 'bg-green-500',
  },
  unplaced: {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    label: 'Unplaced',
    dot: 'bg-slate-400',
  },
  withdrawn: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Withdrawn',
    dot: 'bg-red-500',
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
    <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Term Students</h1>
        <p className='mt-2 text-slate-500'>
          Manage enrollment and placement for the current academic term.
        </p>
      </div>
      <Space size='middle' wrap>
        <Button
          type='primary'
          icon={<UserAddOutlined />}
          size='medium'
          className='rounded-full border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
          onClick={onAdd}
        >
          Thêm sinh viên
        </Button>
        <Button
          icon={<UploadOutlined />}
          size='medium'
          className='rounded-full border-[#d52020]/20 font-bold text-[#d52020] hover:!border-[#d52020] hover:!bg-[#d52020]/5 hover:!text-[#d52020] focus:!border-[#d52020] focus:!text-[#d52020]'
          onClick={onImport}
        >
          Nhập từ Excel
        </Button>
        <Button
          icon={<UserDeleteOutlined />}
          size='medium'
          className='rounded-full border-slate-200 bg-slate-50 text-slate-400'
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
    <div className='mb-6 flex flex-row items-center gap-4 rounded-[2rem] border border-slate-100 bg-white p-2 pr-3 pl-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:flex-row'>
      <div className='w-full flex-1'>
        <Input
          prefix={<SearchOutlined className='mr-2 text-lg text-slate-400' />}
          placeholder='Tìm kiếm theo tên hoặc MSSV...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size='medium'
          className='w-full rounded-full border-none bg-transparent shadow-none focus-within:bg-slate-50 hover:bg-slate-50'
          style={{ padding: '8px 16px' }}
        />
      </div>
      <div className='hidden h-8 w-[1px] bg-slate-200 md:block'></div>
      <Space size='middle' className='w-full flex-wrap md:w-auto md:flex-nowrap' wrap={false}>
        <Select
          allowClear
          placeholder='Trạng thái: Tất cả'
          size='medium'
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
        <div className='hidden h-6 w-[1px] bg-slate-200 md:block'></div>
        <Select
          allowClear
          placeholder='Ngành học: Tất cả'
          size='medium'
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
      render: (name) => (
        <Space>
          <Avatar size={32} className='bg-slate-200 text-slate-700'>
            {name?.[0]}
          </Avatar>
          <span className='font-medium'>{name}</span>
        </Space>
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
        const style = STATUS_STYLES[status] || STATUS_STYLES.unplaced;
        return (
          <span
            className={`rounded-full border px-3 py-1 text-xs ${style.bg} ${style.text} ${style.border}`}
          >
            {style.label}
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
              className='hover:bg-[#d52020]/5 hover:text-[#d52020]'
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
              className='hover:bg-[#d52020]/5 hover:text-[#d52020]'
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
                className='hover:bg-[#d52020]/5 hover:text-[#d52020]'
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
    <div className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]'>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={students}
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
        pagination={false}
        className='custom-antd-table flex-1'
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
      render: (text) => <span className='font-medium text-slate-600'>{text}</span>,
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
            <CheckCircleOutlined className='text-lg text-green-500' />
          </Tooltip>
        ) : (
          <Tooltip title={record.error}>
            <ExclamationCircleOutlined className='text-lg text-[#d52020]' />
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
          className='border-none bg-slate-100 font-bold text-slate-600 hover:!bg-slate-200'
        >
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          shape='round'
          size='large'
          className='border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
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
          className='mb-6 rounded-xl border-[#d52020]/30 bg-[#d52020]/5 p-8 transition-colors hover:border-[#d52020]/50'
        >
          <p className='ant-upload-drag-icon'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d52020]/10'>
              <UploadOutlined className='text-3xl text-[#d52020]' />
            </div>
          </p>
          <p className='ant-upload-text text-lg font-bold text-slate-900'>
            Drag &amp; Drop Excel File
          </p>
          <p className='ant-upload-hint mt-1 text-sm text-slate-500'>
            or click to browse from your computer
          </p>
          <Button shape='round' className='mt-6 border-[#d52020]/20 font-bold text-slate-700'>
            Select File
          </Button>
        </Dragger>
        <div className='relative mb-2 flex items-center py-2'>
          <div className='flex-grow border-t border-[#d52020]/10'></div>
          <span className='mx-4 flex-shrink text-xs font-semibold tracking-wider text-slate-400 uppercase'>
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
          className='custom-antd-table overflow-hidden rounded-lg border border-[#d52020]/10'
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
          <span className='text-xl font-bold tracking-tight'>Add New Student</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={560}
      footer={
        <div className='mt-6 flex items-center justify-end gap-4 px-2 py-2'>
          <Button
            onClick={onClose}
            shape='round'
            size='large'
            className='border-none bg-slate-100 font-semibold text-slate-600 hover:!bg-slate-200'
          >
            Cancel
          </Button>
          <Button
            type='primary'
            shape='round'
            size='large'
            className='flex items-center gap-2 border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
            onClick={onClose}
          >
            <span>Save Student</span>
            <CheckCircleOutlined />
          </Button>
        </div>
      }
      className='custom-add-student-modal'
      closeIcon={<CloseOutlined className='text-slate-500 hover:text-[#d52020]' />}
    >
      <div className='space-y-6 pt-6 pb-2'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Full Name</label>
          <Input
            size='large'
            prefix={<UserOutlined className='mr-2 text-lg text-slate-400' />}
            placeholder='e.g. John Doe'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Student Code</label>
          <Input
            size='large'
            prefix={<IdcardOutlined className='mr-2 text-lg text-slate-400' />}
            placeholder='e.g. STU-2024-001'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Email Address</label>
          <Input
            size='large'
            type='email'
            prefix={<MailOutlined className='mr-2 text-lg text-slate-400' />}
            placeholder='e.g. john@university.edu'
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-semibold text-slate-700'>Phone Number</label>
            <Input
              size='large'
              type='tel'
              prefix={<PhoneOutlined className='mr-2 text-lg text-slate-400' />}
              placeholder='+1 (555) 000-0000'
              className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-semibold text-slate-700'>Date of Birth</label>
            <Input
              size='large'
              type='date'
              prefix={<CalendarOutlined className='mr-2 text-lg text-slate-400' />}
              className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
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
          <div className='inline-flex rounded-lg bg-[#d52020]/10 p-2 text-[#d52020]'>
            <EditOutlined className='text-xl' />
          </div>
          <span className='text-xl font-bold tracking-tight'>Chỉnh sửa Sinh viên</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={560}
      footer={
        <div className='mt-6 flex items-center justify-end gap-4 px-2 py-2'>
          <Button
            onClick={onClose}
            shape='round'
            size='large'
            className='border-none bg-slate-100 font-semibold text-slate-600 hover:!bg-slate-200'
          >
            Cancel
          </Button>
          <Button
            type='primary'
            shape='round'
            size='large'
            className='flex items-center gap-2 border-none bg-[#d52020] font-bold shadow-md shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
            onClick={onClose}
          >
            <span>Save Changes</span>
            <CheckCircleOutlined />
          </Button>
        </div>
      }
      className='custom-add-student-modal'
      closeIcon={<CloseOutlined className='text-slate-500 hover:text-[#d52020]' />}
    >
      <div className='space-y-6 pt-6 pb-2'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Full Name</label>
          <Input
            size='large'
            prefix={<UserOutlined className='mr-2 text-lg text-slate-400' />}
            defaultValue={student.name}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Student Code</label>
          <Input
            size='large'
            prefix={<IdcardOutlined className='mr-2 text-lg text-slate-400' />}
            defaultValue={student.id}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold text-slate-700'>Email Address</label>
          <Input
            size='large'
            type='email'
            prefix={<MailOutlined className='mr-2 text-lg text-slate-400' />}
            defaultValue={`${student.id.toLowerCase()}@university.edu`}
            className='rounded-xl border-slate-200 bg-slate-50 py-3 text-base focus-within:border-[#d52020] focus-within:ring-2 focus-within:ring-[#d52020]/20'
          />
        </div>
      </div>
    </Modal>
  );
});
const StudentDetailsDrawer = memo(function StudentDetailsDrawer({ visible, onClose, student }) {
  if (!student) return null;
  const style = STATUS_STYLES[student.status] || STATUS_STYLES.unplaced;
  return (
    <Drawer
      title={
        <div className='flex items-center gap-4'>
          <div className='rounded-full bg-[#d52020]/10 p-2 text-[#d52020]'>
            <UserOutlined className='text-xl' />
          </div>
          <div>
            <h2 className='m-0 text-xl leading-tight font-bold text-slate-900'>Student Details</h2>
            <p className='m-0 text-xs font-medium tracking-wider text-slate-500 uppercase'>
              Placement Portal
            </p>
          </div>
        </div>
      }
      placement='right'
      onClose={onClose}
      open={visible}
      width={480}
      closeIcon={<CloseOutlined className='text-slate-500 hover:text-[#d52020]' />}
      className='custom-student-drawer'
      styles={{
        header: { borderBottom: '1px solid rgba(213, 32, 32, 0.1)', padding: '24px' },
        body: { padding: 0 },
      }}
      footer={
        <div className='flex gap-4'>
          <Button
            size='large'
            className='flex-1 rounded-xl border-2 border-[#d52020]/10 font-bold text-slate-600'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            size='large'
            className='flex-1 rounded-xl border-none bg-[#d52020] font-bold shadow-lg shadow-[#d52020]/20 hover:!bg-[#d52020]/90'
          >
            Update Details
          </Button>
        </div>
      }
    >
      <div className='h-full space-y-8 bg-[#f8f6f6] p-6'>
        {/* Header Profile Section */}
        <div className='flex items-start gap-6 pt-2'>
          <div
            className='min-h-24 w-24 flex-shrink-0 rounded-xl border-4 border-white bg-cover bg-center bg-no-repeat shadow-sm'
            style={{ backgroundImage: `url("${student.avatar}")`, aspectRatio: '1/1' }}
          />
          <div className='flex flex-col justify-center gap-1'>
            <h3 className='m-0 text-2xl font-bold tracking-tight text-slate-900'>{student.name}</h3>
            <p className='m-0 text-sm font-medium text-slate-500'>
              ID: <span className='text-[#d52020]'>{student.id}</span>
            </p>
            <div className='mt-2 flex'>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${style.bg} ${style.text} ${style.border}`}
              >
                <span className={`size-2 rounded-full ${style.dot} mr-2`}></span>
                {style.label}
              </span>
            </div>
          </div>
        </div>
        {/* Personal Information */}
        <section>
          <div className='mb-4 flex items-center gap-2'>
            <InfoCircleOutlined className='text-xl text-[#d52020]' />
            <h2 className='m-0 text-lg font-bold text-slate-900'>Personal Information</h2>
          </div>
          <div className='rounded-2xl border border-[#d52020]/5 bg-white p-1'>
            <div className='grid grid-cols-3 border-b border-[#d52020]/5 px-4 py-4'>
              <p className='m-0 text-sm font-medium text-slate-500'>Email</p>
              <p className='col-span-2 m-0 text-sm font-medium text-slate-900'>
                {student.id.toLowerCase()}@university.edu
              </p>
            </div>
            <div className='grid grid-cols-3 border-b border-[#d52020]/5 px-4 py-4'>
              <p className='m-0 text-sm font-medium text-slate-500'>Phone</p>
              <p className='col-span-2 m-0 text-sm font-medium text-slate-900'>+1 (555) 012-3456</p>
            </div>
            <div className='grid grid-cols-3 px-4 py-4'>
              <p className='m-0 text-sm font-medium text-slate-500'>Major</p>
              <p className='col-span-2 m-0 text-sm font-medium text-slate-900'>{student.major}</p>
            </div>
          </div>
        </section>
        {/* Placement Settings */}
        <section>
          <div className='mb-4 flex items-center gap-2'>
            <SettingOutlined className='text-xl text-[#d52020]' />
            <h2 className='m-0 text-lg font-bold text-slate-900'>Placement Settings</h2>
          </div>
          <div className='space-y-4'>
            <div>
              <label className='mb-2 block text-sm font-bold text-slate-700'>
                Placement Status
              </label>
              <Select
                defaultValue={student.status}
                size='large'
                className='custom-details-select w-full'
                options={[
                  { value: 'unplaced', label: 'Unplaced' },
                  { value: 'placed', label: 'Placed' },
                  { value: 'withdrawn', label: 'Withdrawn' },
                ]}
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-bold text-slate-700'>Enterprise</label>
              <Input
                size='large'
                prefix={<SearchOutlined className='mr-2 text-lg text-slate-400' />}
                placeholder='Search enterprise...'
                defaultValue={student.status === 'placed' ? 'Global Tech Solutions' : ''}
                className='rounded-xl border-[#d52020]/20 py-3'
              />
            </div>
          </div>
        </section>
        {/* Feedback History */}
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <HistoryOutlined className='text-xl text-[#d52020]' />
              <h2 className='m-0 text-lg font-bold text-slate-900'>Feedback History</h2>
            </div>
            <button className='flex cursor-pointer items-center gap-1 border-none bg-transparent text-sm font-bold text-[#d52020] hover:underline'>
              View All
            </button>
          </div>
          <div className='space-y-3'>
            <div className='rounded-xl border border-[#d52020]/10 bg-white p-4 shadow-sm'>
              <div className='mb-2 flex items-start justify-between'>
                <p className='m-0 text-sm font-bold text-slate-900'>Final Technical Interview</p>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>2 days ago</span>
              </div>
              <p className='m-0 text-xs leading-relaxed text-slate-600'>
                Candidate showed exceptional problem-solving skills and knowledge of distributed
                systems. Highly recommended.
              </p>
              <div className='mt-3 flex items-center gap-2'>
                <div className='flex size-6 items-center justify-center rounded-full bg-[#d52020]/20'>
                  <StarFilled className='text-[12px] text-[#d52020]' />
                </div>
                <span className='text-xs font-bold text-slate-700'>Rating: 4.8/5.0</span>
              </div>
            </div>
            <div className='rounded-xl border border-[#d52020]/10 bg-white p-4 shadow-sm'>
              <div className='mb-2 flex items-start justify-between'>
                <p className='m-0 text-sm font-bold text-slate-900'>HR Culture Fit</p>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>1 week ago</span>
              </div>
              <p className='m-0 text-xs leading-relaxed text-slate-600'>
                Good communication skills and alignment with company values.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
});
export default function StudentEnrollment() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return students.filter(
      (st) =>
        (!s || st.name.toLowerCase().includes(s) || st.id.toLowerCase().includes(s)) &&
        (!statusFilter || st.status === statusFilter) &&
        (!majorFilter || st.major === majorFilter),
    );
  }, [students, searchTerm, statusFilter, majorFilter]);
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleMajorChange = (value) => {
    setMajorFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };
  const paginatedStudents = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, pagination]);

  // useEffect(() => {
  //   setPagination((prev) => ({ ...prev, current: 1 }));
  // }, [searchTerm, statusFilter, majorFilter]);

  const handleTableChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

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
    <div className='flex h-[calc(100vh-48px)] w-full flex-col overflow-hidden'>
      <div className='mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col space-y-6 overflow-hidden'>
        <HeaderActions
          onImport={() => setIsImportModalVisible(true)}
          onAdd={() => setIsAddModalVisible(true)}
        />
        <FiltersAndSearch
          searchTerm={searchTerm}
          // onSearchChange={setSearchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          // onStatusFilterChange={setStatusFilter}
          onStatusFilterChange={handleStatusChange}
          majorFilter={majorFilter}
          // onMajorFilterChange={setMajorFilter}
          onMajorFilterChange={handleMajorChange}
        />
        <DataGrid
          students={paginatedStudents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 px-2 pt-6'>
          <div className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
            Total: {filteredStudents.length}
          </div>
          <Pagination
            {...pagination}
            total={filteredStudents.length}
            showSizeChanger={false}
            onChange={handleTableChange}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined />;
              if (type === 'next') return <RightOutlined />;
              return originalElement;
            }}
          />
        </div>
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


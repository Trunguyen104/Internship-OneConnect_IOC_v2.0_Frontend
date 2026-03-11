'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  notification,
  Avatar,
  Form,
  Dropdown,
  Pagination,
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  UserAddOutlined,
  FilterOutlined,
  MoreOutlined,
  UserOutlined,
  TeamOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MailOutlined,
  IdcardOutlined,
  ProjectOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

// const { Title, Text } = Typography;
// const { Search } = Input;

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'gold', badge: 'warning' },
  ACCEPTED: { label: 'Accepted', color: 'green', badge: 'success' },
  REJECTED: { label: 'Rejected', color: 'red', badge: 'error' },
  REVOKED: { label: 'Revoked', color: 'default', badge: 'default' },
};

const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Senior Architect' },
  { id: 'm2', name: 'Marcus Chen', role: 'Lead Developer' },
  { id: 'm3', name: 'Elena Rodriguez', role: 'Product Manager' },
  { id: 'm4', name: 'James Wilson', role: 'Data Scientist' },
];

const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Web Frontend A',
    mentor: 'Sarah Jenkins',
    project: 'E-commerce Platform',
    memberCount: 12,
  },
  {
    id: 'g2',
    name: 'Mobile App Dev B',
    mentor: 'Marcus Chen',
    project: 'Banking App',
    memberCount: 8,
  },
  {
    id: 'g3',
    name: 'Backend Systems C',
    mentor: 'Elena Rodriguez',
    project: 'Logistics System',
    memberCount: 15,
  },
];

const MOCK_STUDENTS = [
  {
    key: '1',
    id: 1,
    fullName: 'Alex Sterling',
    studentId: 'SV001',
    email: 'alex.s@university.edu',
    major: 'Computer Science',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    avatar: 'AS',
  },
  {
    key: '2',
    id: 2,
    fullName: 'Marcus Chen',
    studentId: 'SV002',
    email: 'm.chen@statepoly.edu',
    major: 'Software Engineering',
    status: 'ACCEPTED',
    groupId: 'g1',
    mentorId: 'm1',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaU9FTU6qNRwJ_VLQVNsjlI5KMYyltjw0mXBvLZWYqHyVr2BxhziIC1287YoOGgEywagsmncipmfU-b_OI5eRpAPbZGVRaGa_z1VLq-soJB72FCBahfmoGVYvApM1QaZqOT3xVrNPlKmo1v_wrg1fVm2N7HtLPu8oPaIPpGYTDxNWUnf1DojH1XbCag9L1aTdiTRA2cEKTEoA6ywVo2KFyGJf-8YeON5kLc5nJWg5FhQOF7eWzm9Gl4yP2RUd_fianSgVV2Km7mBM',
  },
  {
    key: '3',
    id: 3,
    fullName: 'Leila White',
    studentId: 'SV003',
    email: 'leila.w@tech.edu',
    major: 'Data Science',
    status: 'REJECTED',
    groupId: null,
    mentorId: null,
    avatar: 'LW',
  },
  {
    key: '4',
    id: 4,
    fullName: 'Elena Rodriguez',
    studentId: 'SV004',
    email: 'e.rodriguez@university.edu',
    major: 'UX Design',
    status: 'ACCEPTED',
    groupId: null,
    mentorId: null,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdaJzP8B_D0JFlZJB4MCsxYVIAzXEzq12dTkI-sUSiRH7PPHrcEqEJX5T8ExOMnDbjxYg0nqmllhNtAzHk58sC9sBeQXacBlJ-MKSsVsjOVmVlUXIWMXdOXz-uqFA5wvVoy1w2q83W0Vpv2sCoARFgXGKGNwGxaiU09LOBE5XChr63Bh3KmnsJ9nwMPU4ilUhm3AGS4YW0BIdlESP2uAkQ6TTot1u8D6XLr_RHkPByRrXOo93O_5g94EUkpCbTMbcAeH5C5Gvw32I',
  },
  {
    key: '5',
    id: 5,
    fullName: 'David Park',
    studentId: 'SV005',
    email: 'd.park@uni.edu',
    major: 'Computer Science',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    avatar: 'DP',
  },
  {
    key: '6',
    id: 6,
    fullName: 'Sophia Lee',
    studentId: 'SV006',
    email: 's.lee@poly.edu',
    major: 'Software Engineering',
    status: 'ACCEPTED',
    groupId: 'g2',
    mentorId: 'm2',
    avatar: 'SL',
  },
  {
    key: '7',
    id: 7,
    fullName: 'Julian Moore',
    studentId: 'SV007',
    email: 'j.moore@col.edu',
    major: 'UX Design',
    status: 'ACCEPTED',
    groupId: 'g3',
    mentorId: 'm3',
    avatar: 'JM',
  },
  {
    key: '8',
    id: 8,
    fullName: 'Maya Patel',
    studentId: 'SV008',
    email: 'm.patel@ist.edu',
    major: 'Data Science',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    avatar: 'MP',
  },
  {
    key: '9',
    id: 9,
    fullName: 'Lucas Brown',
    studentId: 'SV009',
    email: 'l.brown@univ.edu',
    major: 'Computer Science',
    status: 'REVOKED',
    groupId: null,
    mentorId: null,
    avatar: 'LB',
  },
  {
    key: '10',
    id: 10,
    fullName: 'Emma Wilson',
    studentId: 'SV010',
    email: 'e.wilson@school.edu',
    major: 'Software Engineering',
    status: 'ACCEPTED',
    groupId: 'g1',
    mentorId: 'm1',
    avatar: 'EW',
  },
  {
    key: '11',
    id: 11,
    fullName: 'Noah Garcia',
    studentId: 'SV011',
    email: 'n.garcia@tech.edu',
    major: 'Data Science',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    avatar: 'NG',
  },
  {
    key: '12',
    id: 12,
    fullName: 'Olivia Taylor',
    studentId: 'SV012',
    email: 'o.taylor@uni.edu',
    major: 'UX Design',
    status: 'REJECTED',
    groupId: null,
    mentorId: null,
    avatar: 'OT',
  },
  {
    key: '13',
    id: 13,
    fullName: 'Ethan Davis',
    studentId: 'SV013',
    email: 'e.davis@poly.edu',
    major: 'Computer Science',
    status: 'ACCEPTED',
    groupId: 'g2',
    mentorId: 'm2',
    avatar: 'ED',
  },
  {
    key: '14',
    id: 14,
    fullName: 'Isabella Hernandez',
    studentId: 'SV014',
    email: 'i.hernandez@col.edu',
    major: 'Software Engineering',
    status: 'PENDING',
    groupId: null,
    mentorId: null,
    avatar: 'IH',
  },
  {
    key: '15',
    id: 15,
    fullName: 'Mason Miller',
    studentId: 'SV015',
    email: 'm.miller@ist.edu',
    major: 'Data Science',
    status: 'ACCEPTED',
    groupId: 'g3',
    mentorId: 'm3',
    avatar: 'MM',
  },
];

export default function InternshipManagement() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [rejectModal, setRejectModal] = useState({ open: false, student: null, reason: '' });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, student: null, type: 'ADD' }); // ADD (AC-06) or CHANGE (AC-08)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [groupForm] = Form.useForm();

  const filteredData = useMemo(() => {
    let data = [...students];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(s) ||
          item.email.toLowerCase().includes(s) ||
          item.major.toLowerCase().includes(s),
      );
    }
    if (statusFilter !== 'ALL') data = data.filter((item) => item.status === statusFilter);
    if (mentorFilter) data = data.filter((item) => item.mentorId === mentorFilter);
    return data;
  }, [students, search, statusFilter, mentorFilter]);

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // useEffect(() => {
  //   setPagination((prev) => ({ ...prev, current: 1 }));
  // }, [search, statusFilter, mentorFilter]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleMentorChange = (value) => {
    setMentorFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };
  const handleTableChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const handleAction = (type, student) => {
    if (type === 'ACCEPT') {
      Modal.confirm({
        title: <span className='text-lg font-bold'>Tiếp nhận sinh viên</span>,
        content: `Bạn có chắc muốn tiếp nhận sinh viên ${student.fullName} không?`,
        okText: 'Tiếp nhận',
        cancelText: 'Hủy',
        okButtonProps: {
          className: 'bg-primary hover:bg-red-700 border-none rounded-full px-6 font-bold',
        },
        cancelButtonProps: { className: 'rounded-full px-6 font-bold' },
        onOk: () => {
          setStudents((prev) =>
            prev.map((s) => (s.id === student.id ? { ...s, status: 'ACCEPTED' } : s)),
          );
          notification.success({
            message: 'Thành công',
            description: 'Đã tiếp nhận sinh viên thành công',
          });
        },
      });
    }
  };

  const handleAddStudent = (values) => {
    const newStudent = {
      key: Date.now().toString(),
      id: Date.now(),
      fullName: values.fullName,
      studentId: values.studentId,
      email: values.email,
      major: values.major,
      status: 'PENDING',
      mentorId: null,
      avatar: values.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    };
    setStudents((prev) => [newStudent, ...prev]);
    setIsAddModalOpen(false);
    addForm.resetFields();
    notification.success({ message: 'Đã thêm sinh viên thành công' });
  };

  const handleGroupSubmit = (values) => {
    const { student, type } = groupModal;
    const selectedGroup = MOCK_GROUPS.find((g) => g.id === values.groupId);

    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              groupId: values.groupId,
              mentorId: MOCK_MENTORS.find((m) => m.name === selectedGroup.mentor)?.id || null,
            }
          : s,
      ),
    );

    if (type === 'ADD') {
      notification.success({ message: 'Đã thêm vào nhóm thành công' });
      console.log(
        `Notification to Mentor: ${student.fullName} đã được thêm vào ${selectedGroup.name}`,
      );
      console.log(`Notification to Student: Bạn đã được xếp vào ${selectedGroup.name}`);
    } else {
      notification.success({
        message: 'Đã đổi nhóm thành công',
        description: `Lý do: ${values.reason}`,
      });
      console.log(`Notification to Old Mentor: ${student.fullName} đã được chuyển khỏi nhóm cũ`);
      console.log(
        `Notification to New Mentor: ${student.fullName} đã được thêm vào ${selectedGroup.name}`,
      );
      console.log(`Notification to Student: Bạn đã được chuyển sang ${selectedGroup.name}`);
    }

    setGroupModal({ open: false, student: null, type: 'ADD' });
    groupForm.resetFields();
  };

  const columns = [
    {
      title: 'FULL NAME',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 220,
      render: (text, record) => (
        <div className='flex items-center gap-2'>
          <Avatar
            size='small'
            src={record.avatar.startsWith('http') ? record.avatar : null}
            className={
              !record.avatar.startsWith('http')
                ? 'bg-primary/10 text-primary text-[10px] font-bold'
                : ''
            }
          >
            {!record.avatar.startsWith('http') ? record.avatar : null}
          </Avatar>
          <span className='truncate text-xs font-semibold text-slate-900'>{text}</span>
        </div>
      ),
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 100,
      className: 'text-slate-500 font-mono text-[10px]',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      className: 'text-slate-600 text-xs truncate',
    },
    {
      title: 'MAJOR',
      dataIndex: 'major',
      key: 'major',
      width: 140,
      render: (major) => {
        const colors = {
          'Computer Science': 'blue',
          'Software Engineering': 'indigo',
          'Data Science': 'purple',
          'UX Design': 'pink',
        };
        const color = colors[major] || 'slate';
        return (
          <span
            className={`text-[10px] font-bold text-${color}-600 bg-${color}-50 rounded border px-2 py-0.5 border-${color}-100 whitespace-nowrap`}
          >
            {major}
          </span>
        );
      },
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (status) => {
        const config = STATUS_CONFIG[status];
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-${config.color}-100 text-${config.color}-700 border border-${config.color}-200 whitespace-nowrap`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      title: 'MENTOR',
      dataIndex: 'mentorId',
      key: 'mentor',
      width: 160,
      render: (id) => {
        const mentor = MOCK_MENTORS.find((m) => m.id === id);
        return mentor ? (
          <span className='text-xs font-medium text-slate-600'>{mentor.name}</span>
        ) : (
          <span className='text-xs text-slate-400 italic'>Unassigned</span>
        );
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 80,
      align: 'right',
      render: (_, record) => {
        const items = [];

        if (record.status === 'PENDING') {
          items.push(
            {
              key: 'accept',
              label: 'Accept Student',
              icon: <CheckOutlined className='text-emerald-500' />,
              onClick: () => handleAction('ACCEPT', record),
            },
            {
              key: 'reject',
              label: 'Reject Student',
              icon: <CloseOutlined className='text-rose-500' />,
              onClick: () => handleAction('REJECT', record),
            },
          );
        }

        if (record.status === 'ACCEPTED') {
          items.push(
            {
              key: 'assign',
              label: 'Assign Mentor/Project',
              icon: <UserOutlined className='text-primary' />,
              onClick: () => setAssignModal({ open: true, student: record }),
            },
            {
              key: 'group',
              icon: <TeamOutlined />,
              label: record.groupId ? 'Change Group' : 'Add to Group',
              // icon: <span className="material-symbols-outlined text-[18px] text-slate-500">group</span>,
              onClick: () =>
                setGroupModal({
                  open: true,
                  student: record,
                  type: record.groupId ? 'CHANGE' : 'ADD',
                }),
            },
          );
        }

        items.push(
          { type: 'divider' },
          {
            key: 'details',
            label: 'View Full Bio',
            icon: <EyeOutlined />,
          },
        );

        return (
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement='bottomRight'
            overlayClassName='action-dropdown'
          >
            <Button
              type='text'
              className='hover:text-primary flex size-8 items-center justify-center rounded-lg p-0 text-slate-400 transition-all hover:bg-slate-100'
              icon={<MoreOutlined style={{ fontSize: '20px' }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col overflow-hidden bg-[#f8f6f6] font-['Be_Vietnam_Pro'] text-slate-900">
      <main className='mx-auto flex w-full max-w-[1200px] flex-1 flex-col overflow-hidden px-6 py-8'>
        <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
          <h1 className='text-2xl font-bold text-slate-900'>Internship Students List</h1>
          <Button
            type='primary'
            size='medium'
            icon={<UserAddOutlined />}
            className='!bg-primary hover:!bg-primary-hover cursor-pointer !border-none font-medium !text-white shadow-sm'
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Student
          </Button>
        </div>

        <div className='mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
            <div className='md:col-span-5'>
              <Input
                placeholder='Search students by name, email or major...'
                prefix={<SearchOutlined className='text-slate-400' />}
                className='h-12 rounded-xl border-none bg-slate-100 transition-all hover:bg-slate-200 focus:bg-white'
                allowClear
                // onChange={(e) => setSearch(e.target.value)}
                onChange={handleSearchChange}
              />
            </div>
            <div className='flex flex-wrap gap-3 md:col-span-7'>
              <Select
                placeholder='Status: All Statuses'
                className='h-12 min-w-[140px] flex-1'
                // onChange={setStatusFilter}
                onChange={handleStatusChange}
                defaultValue='ALL'
                options={[
                  { label: 'Status: All Statuses', value: 'ALL' },
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'Accepted', value: 'ACCEPTED' },
                  { label: 'Rejected', value: 'REJECTED' },
                  { label: 'Revoked', value: 'REVOKED' },
                ]}
              />
              <Select
                placeholder='Mentor: All Mentors'
                className='h-12 min-w-[140px] flex-1'
                // onChange={setMentorFilter}
                onChange={handleMentorChange}
                allowClear
                options={[
                  { label: 'Mentor: All Mentors', value: null },
                  ...MOCK_MENTORS.map((m) => ({ label: m.name, value: m.id })),
                ]}
              />
              <Button
                icon={<FilterOutlined />}
                className='bg-primary/10 text-primary hover:bg-primary/20 flex h-12 items-center justify-center rounded-xl border-none px-4 font-bold transition-all'
              >
                Filters
              </Button>
            </div>
          </div>

          <div className='no-scrollbar flex gap-2 overflow-x-auto pb-1'>
            <Button
              className={`h-8 rounded-full px-4 text-xs font-bold ${statusFilter === 'ALL' ? 'bg-primary border-none text-white' : 'border-none bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Students
            </Button>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                className={`flex h-8 items-center gap-2 rounded-full border-none px-4 text-xs font-bold ${statusFilter === key ? `bg-slate-200 text-slate-800` : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={() => setStatusFilter(key)}
              >
                <div className={`size-2 rounded-full bg-${config.color}-500`}></div>
                {config.label}
              </Button>
            ))}
          </div>
        </div>

        <div className='flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <Table
            columns={columns}
            dataSource={paginatedData}
            styles={{ body: { minHeight: 'calc(100vh - 440px)' } }}
            scroll={{ y: 'calc(100vh - 440px)' }}
            pagination={false}
            rowClassName='hover:bg-slate-50/50 transition-colors cursor-default'
            locale={{ emptyText: 'Chưa có sinh viên nào khớp với tìm kiếm' }}
          />
        </div>

        <div className='mt-auto flex items-center justify-between border-t border-slate-100 px-2 pt-6'>
          <div className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
            Total: {filteredData.length}
          </div>
          <Pagination
            {...pagination}
            total={filteredData.length}
            showSizeChanger={false}
            onChange={handleTableChange}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined />;
              if (type === 'next') return <RightOutlined />;
              return originalElement;
            }}
          />
        </div>
      </main>

      <Modal
        title={null}
        open={rejectModal.open}
        footer={null}
        closable={false}
        onCancel={() => setRejectModal({ open: false, student: null, reason: '' })}
        width={520}
        className='reject-modal'
      >
        <div className='border-primary/10 relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-2xl'>
          <div className='flex flex-col items-center justify-center px-6 pt-8 pb-4 text-center'>
            <ExclamationCircleOutlined className='text-4xl' />
            <h3 className='text-xl font-bold text-slate-900'>Reject Student Application</h3>
          </div>

          <div className='px-8 py-2'>
            <div className='bg-primary/5 border-primary mb-6 rounded-r-lg border-l-4 p-4'>
              <p className='text-sm leading-relaxed text-slate-700'>
                You are about to reject student{' '}
                <span className='font-bold text-slate-900'>{rejectModal.student?.fullName}</span>.
                This action cannot be undone and the student will be notified immediately.
              </p>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>
                Reason for Rejection <span className='text-primary'>*</span>
              </label>
              <Input.TextArea
                className='focus:ring-primary min-h-[140px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-transparent focus:ring-2'
                placeholder='Please provide a detailed reason for the rejection (e.g., missing qualifications, poor interview performance)...'
                required
                value={rejectModal.reason}
                onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          </div>

          <div className='mt-8 flex flex-col gap-3 px-8 pb-8 sm:flex-row'>
            <Button
              className='order-2 h-12 flex-1 rounded-full border-2 border-slate-200 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 sm:order-1'
              onClick={() => setRejectModal({ visible: false, student: null, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              className='bg-primary shadow-primary/20 order-1 flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-none text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700 sm:order-2'
              onClick={() => {
                if (!rejectModal.reason.trim())
                  return notification.error({ message: 'Vui lòng nhập lý do từ chối' });
                setStudents((prev) =>
                  prev.map((s) =>
                    s.id === rejectModal.student.id ? { ...s, status: 'REJECTED' } : s,
                  ),
                );
                setRejectModal({ open: false, student: null, reason: '' });
                notification.warning({ message: 'Đã từ chối tiếp nhận sinh viên' });
              }}
            >
              <span className='truncate'>Confirm Reject</span>
            </Button>
          </div>

          <div className='absolute top-4 right-4'>
            <button
              className='text-slate-400 transition-colors hover:text-slate-600'
              onClick={() => setRejectModal({ open: false, student: null, reason: '' })}
            >
              {/* <span className="material-symbols-outlined">close</span> */}
              <TeamOutlined />
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={null}
        open={assignModal.open}
        footer={null}
        closable={false}
        onCancel={() => setAssignModal({ open: false, student: null })}
        width={560}
        className='assign-modal'
      >
        <div className='flex items-start justify-between border-b border-slate-100 p-6'>
          <div>
            <h2 className='text-2xl leading-tight font-bold text-slate-900'>
              Assign Mentor & Project
            </h2>
            <div className='mt-1 flex items-center gap-2'>
              <UserOutlined className='text-primary text-sm' />
              <p className='text-sm font-medium text-slate-500'>
                Student:{' '}
                <span className='font-semibold text-slate-900'>
                  {assignModal.student?.fullName}
                </span>
              </p>
            </div>
          </div>
          <button
            className='text-slate-400 transition-colors hover:text-slate-600'
            onClick={() => setAssignModal({ open: false, student: null })}
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>

        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => {
            setStudents((prev) =>
              prev.map((s) =>
                s.id === assignModal.student.id ? { ...s, mentorId: values.mentorId } : s,
              ),
            );
            notification.success({ message: 'Đã gán Mentor & Dự án thành công' });
            setAssignModal({ open: false, student: null });
            form.resetFields();
          }}
          className='space-y-6 p-6'
        >
          <Form.Item
            label={<span className='text-sm font-semibold text-slate-700'>Select Mentor</span>}
            name='mentorId'
            className='!mb-0'
          >
            <Select
              showSearch
              placeholder='Search and select a mentor'
              className='custom-select-v2 h-12 w-full'
              suffixIcon={null}
              prefix={<SearchOutlined className='text-slate-400' />}
              options={MOCK_MENTORS.map((m) => ({ label: `${m.name} - ${m.role}`, value: m.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <p className='-mt-4 px-1 text-[11px] text-slate-400 italic'>
            Tip: You can search by name or expertise
          </p>

          <Form.Item
            label={
              <span className='text-sm font-semibold text-slate-700'>Project Name / Position</span>
            }
            name='project'
            className='!mb-0'
          >
            <Input
              placeholder='Enter project name or role'
              className='hover:border-primary focus:border-primary h-12 rounded-xl border-slate-200 bg-slate-50 transition-all'
              prefix={<ProjectOutlined className='text-xl text-slate-400' />}
            />
          </Form.Item>

          <div className='bg-primary/5 border-primary/10 flex gap-3 rounded-xl border p-4'>
            <InfoCircleOutlined className='text-primary text-xl' />
            <p className='text-xs leading-relaxed text-slate-600'>
              Assigning a mentor will notify both the student and the mentor via email. The project
              dashboard will be updated immediately upon confirmation.
            </p>
          </div>

          <div className='-mx-6 flex flex-col justify-end gap-3 border-t border-slate-100 px-6 pt-6 sm:flex-row'>
            <Button
              className='h-11 rounded-full border-slate-200 px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50'
              onClick={() => setAssignModal({ open: false, student: null })}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary shadow-primary/20 h-11 rounded-full border-none px-8 text-sm font-bold shadow-lg transition-all hover:bg-red-700 active:scale-95'
            >
              Assign Mentor
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={null}
        open={isAddModalOpen}
        footer={null}
        closable={false}
        width={560}
        className='add-student-modal'
      >
        <div className='flex items-start justify-between border-b border-slate-100 p-6'>
          <div className='flex items-center gap-3'>
            <h2 className='text-2xl leading-tight font-bold text-slate-900'>Add New Student</h2>
          </div>
          <button
            className='text-slate-400 transition-colors hover:text-slate-600'
            onClick={() => setIsAddModalOpen(false)}
          >
            <CloseOutlined className='text-rose-500' />
          </button>
        </div>

        <Form
          form={addForm}
          layout='vertical'
          onFinish={handleAddStudent}
          className='space-y-4 p-6'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Form.Item
              label={<span className='text-sm font-semibold text-slate-700'>Full Name</span>}
              name='fullName'
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input
                placeholder='e.g. Alex Sterling'
                className='h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white'
                prefix={<UserOutlined className='text-slate-400' />}
              />
            </Form.Item>
            <Form.Item
              label={<span className='text-sm font-semibold text-slate-700'>Student ID</span>}
              name='studentId'
              rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
            >
              <Input
                placeholder='e.g. SV001'
                className='h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white'
                prefix={<IdcardOutlined className='text-xl text-slate-400' />}
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className='text-sm font-semibold text-slate-700'>Email Address</span>}
            name='email'
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input
              placeholder='e.g. alex.s@university.edu'
              className='h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white'
              prefix={<MailOutlined className='text-slate-400' />}
            />
          </Form.Item>

          <Form.Item
            label={<span className='text-sm font-semibold text-slate-700'>Major</span>}
            name='major'
            rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành' }]}
          >
            <Select
              placeholder='Select Major'
              className='custom-details-select h-12 w-full'
              options={[
                { label: 'Computer Science', value: 'Computer Science' },
                { label: 'Software Engineering', value: 'Software Engineering' },
                { label: 'Data Science', value: 'Data Science' },
                { label: 'UX Design', value: 'UX Design' },
              ]}
            />
          </Form.Item>

          <div className='-mx-6 flex flex-col justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 pt-6 sm:flex-row'>
            <Button
              className='h-11 rounded-full border-slate-200 px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100'
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary shadow-primary/20 h-11 rounded-full border-none px-8 text-sm font-bold shadow-lg transition-all hover:bg-red-700 active:scale-95'
            >
              Save Student
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={null}
        open={groupModal.open}
        footer={null}
        closable={false}
        width={560}
        className='group-modal'
      >
        <div className='flex items-start justify-between border-b border-slate-100 p-6'>
          <div>
            <h2 className='text-2xl leading-tight font-bold text-slate-900'>
              {groupModal.type === 'ADD' ? 'Add to Existing Group' : 'Change Student Group'}
            </h2>
            <p className='mt-1 text-sm font-medium text-slate-500'>
              Student:{' '}
              <span className='font-semibold text-slate-900'>{groupModal.student?.fullName}</span>
            </p>
          </div>
          <button
            className='text-slate-400 transition-colors hover:text-slate-600'
            onClick={() => setGroupModal({ open: false, student: null, type: 'ADD' })}
          >
            <CloseOutlined className='text-rose-500' />
          </button>
        </div>

        <Form
          form={groupForm}
          layout='vertical'
          className='space-y-4 p-6'
          onFinish={handleGroupSubmit}
        >
          <Form.Item
            label={
              <span className='text-sm font-semibold text-slate-700'>Select Target Group</span>
            }
            name='groupId'
            rules={[{ required: true, message: 'Vui lòng chọn nhóm' }]}
          >
            <Select
              placeholder='Search groups...'
              className='custom-details-select h-12 w-full'
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={MOCK_GROUPS.map((g) => ({
                label: `${g.name} — ${g.mentor} — ${g.project} — ${g.memberCount} SV`,
                value: g.id,
              }))}
            />
          </Form.Item>

          {groupModal.type === 'CHANGE' && (
            <Form.Item
              label={
                <span className='text-sm font-semibold text-slate-700'>Reason for Change</span>
              }
              name='reason'
              rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
            >
              <Input.TextArea
                placeholder='Reason for switching groups (mandatory)...'
                rows={4}
                className='rounded-xl border-slate-200 bg-slate-50 focus:bg-white'
              />
            </Form.Item>
          )}

          <div className='-mx-6 flex flex-col justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 pt-6 sm:flex-row'>
            <Button
              className='h-11 rounded-full border-slate-200 px-6 font-bold text-slate-600'
              onClick={() => setGroupModal({ open: false, student: null, type: 'ADD' })}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary shadow-primary/20 h-11 rounded-full border-none px-8 font-bold shadow-lg'
            >
              Confirm {groupModal.type === 'ADD' ? 'Add' : 'Change'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}


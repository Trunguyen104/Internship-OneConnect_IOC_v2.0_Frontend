'use client';

import React, { useState, useMemo } from 'react';
import {
  App,
  Card,
  Button,
  Avatar,
  Tag,
  Typography,
  Input,
  Modal,
  Form,
  Select,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CodeOutlined,
  UserOutlined,
  ProjectOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Senior Architect' },
  { id: 'm2', name: 'Marcus Chen', role: 'Lead Developer' },
  { id: 'm3', name: 'Elena Rodriguez', role: 'Product Manager' },
  { id: 'm4', name: 'Alex Rivera', role: 'UI/UX Lead' },
];

const MOCK_PROJECTS = [
  { id: 'p1', name: 'E-commerce Platform Redesign' },
  { id: 'p2', name: 'Banking Mobile App' },
  { id: 'p3', name: 'Logistics Optimization System' },
  { id: 'p4', name: 'AI Customer Service Bot' },
];

const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Web Frontend A',
    track: 'FRONTEND',
    status: 'ACTIVE',
    mentorId: null,
    memberCount: 12,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATqR4DnE7BW83jfqS9GCSMXkHttS7Nihm7lymbN2VKAmtAOobdJ9gjcHtdtu4bBk4Z_0HtR306vxB9WE3QHPlaPKX17_yApfIKzXa2_k8hjNV6wr-dGyiAsla-fSTP6jN1Ru9xZRNeOQ3EAdwtr4pWwE1ADQ6gdAtHtXX4IxWx-hgDWaD5V05X-fgdO86v2fLEQnIeXZl1BvLymg0hUR_Al3WTtxaQXmsDRqs4gYo8xiNdpHlW65vyquluPfWu3s7vzs-l_twpCMw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-idaxAHlMSCrDvoeFbYh-wTieBNnpepiLhz9r_WDvgDukQyOi7zjPrlTV0EMQyReOV9AbsyYwv60QpbuCcrAMwc470QOCtyihjzaICul4ZDV8r6qOtubEj1Q9eZOOGTeqFWqqIapEYK3opwaQoch4ysEpee7iZeXp3JDx0RA334Vc5E2AjpODoXJXy4mTW-VoJ6xCXf4lXuxYlwkzdwbtnD0ewZ4s9Cq3Gn6QkLS0kR0XcGzJe73GchVUn4ICBQ3omPcU6le32oU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAToJMMbeeGAgVy1OoUfhvDdhXVmhhg_T8R-bPdtFGGaZDueLOYCa_ta-p6KijqIl1mgSzF5KWYY30lu9Bz01LZfufUJUtAhmVBEsF2UHqZzfEkYGc6EgoMBK1zcPuFVZRr6bwNn30sHp3c4Yg36afVp4RX_52BkVZbnhmmaZ6JC4dCg4NMU1aAKzPqIkTM4KJOElL7j1vwofpsvhi1j6TWygQKU7NJK7AlFRAacObgRTDZzCP_9gyp9g22KQC3hOT6w7jT1mdKsdE',
    ],
  },
  {
    id: 'g2',
    name: 'Mobile App Dev B',
    track: 'MOBILE',
    status: 'ACTIVE',
    mentorId: 'm1',
    memberCount: 8,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDrHfUkufJgcat9DX5QqbyhObSoA27tfypUZAGRNGylaO_lRaSRcBJipRdqXl-ucg7RRqO7-xBstUkGQ2I5rWWi4gDmGv4srneqqS6Yq_yKNW4dT-TcQuG2oPCTHso1xOoMWL3P4ZcLmWP-DUIF7cxuOLZITklMJj2Zcjw6Sfa0lSTHy3bmT9BHkFm-MHzboEi9h0-Ny6Ac5NAw8-tByT8Eet8EUww_FdUvGfmCztmhdRfmoyrM5b8h_ZV_UR7hqYupByhS6ix0pqk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkeaf2fFDUkF6MtvdTXSXnLplC3fYQKzmb7BhMN9V9isyae4HwJw06skDmyrsu9pww7lk5UAKVh6YuPYSjdC_f3HGUB3QcHyvByFDTYI40bDGZhwbyfnRSMmBCxjHsHOpEA13iq44csoM6Irjk-Oc9oFjGplopNq9s0DSzM0sUUJV2LC4PXazEIDZ_tnjlTY69hnKW_Fo-7iKr1FWbrwxWy1UbW6cMPq59o4s1sftEVjO_b2LVRjWJ90QVOUkb0D9gUIWO96-KPRo',
    ],
  },
  {
    id: 'g3',
    name: 'Backend Systems C',
    track: 'BACKEND',
    status: 'ACTIVE',
    mentorId: null,
    memberCount: 0,
    avatars: [],
  },
  {
    id: 'g4',
    name: 'QA Testing E',
    track: 'BACKEND',
    status: 'ARCHIVED',
    mentorId: null,
    memberCount: 10,
    avatars: [],
  },
];

function GroupManagementContent() {
  const { notification, modal } = App.useApp();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [viewModal, setViewModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState(false);
  const [form] = Form.useForm();

  const filteredGroups = useMemo(() => {
    let data = [...groups];
    if (activeTab === 'ACTIVE') data = data.filter((g) => g.status === 'ACTIVE');
    if (activeTab === 'ARCHIVED') data = data.filter((g) => g.status === 'ARCHIVED');
    if (search) {
      data = data.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    return data;
  }, [groups, activeTab, search]);

  const handleAssignSubmit = (values) => {
    const { group } = assignModal;
    const isChangingMentor = group.mentorId && group.mentorId !== values.mentorId;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? {
              ...g,
              mentorId: values.mentorId,
              project: values.projectId,
            }
          : g,
      ),
    );

    setAssignModal({ open: false, group: null });

    if (isChangingMentor) {
      notification.success({
        message: 'Đã đổi Mentor thành công',
        description: `Lý do: ${values.reason}`,
      });
      console.log(`Notification to old mentor: Bạn đã được gỡ khỏi ${group.name}`);
      console.log(`Notification to new mentor: Bạn được assign phụ trách ${group.name}`);
    } else {
      notification.success({ message: 'Đã gán Mentor & Dự án thành công' });
    }

    const projectName = MOCK_PROJECTS.find((p) => p.id === values.projectId)?.name;
    console.log(`Notification to students: Nhóm bạn đã được assign vào dự án ${projectName}`);

    form.resetFields();
  };

  const handleDeleteGroup = (group) => {
    if (group.memberCount > 0) {
      notification.error({
        message: 'Thao tác thất bại',
        description:
          'Không thể xóa nhóm còn sinh viên. Vui lòng chuyển toàn bộ sinh viên sang nhóm khác trước.',
        placement: 'top',
      });
      return;
    }

    modal.confirm({
      title: <span className='text-lg font-bold'>Xóa nhóm</span>,
      content: `Bạn có chắc muốn xóa [${group.name}] không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk() {
        setGroups((prev) => prev.filter((g) => g.id !== group.id));
        notification.success({ message: 'Đã giải thể nhóm thành công' });
        console.log(`Notification to mentor: ${group.name} đã bị giải thể`);
      },
    });
  };

  const handleCreateGroup = (values) => {
    const newGroup = {
      id: `g${Date.now()}`,
      name: values.name,
      track: values.track || 'FRONTEND',
      status: 'ACTIVE',
      mentorId: null,
      memberCount: 0,
      avatars: [],
    };
    setGroups((prev) => [newGroup, ...prev]);
    setCreateModal(false);
    form.resetFields();
    notification.success({ message: 'Đã tạo nhóm thành công' });
  };

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col overflow-hidden bg-[#fcfafa] font-['Be_Vietnam_Pro'] text-slate-900">
      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col overflow-hidden px-10 pt-10'>
        <div className='mb-10 flex flex-wrap items-center justify-between gap-6'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Internship Group Management
            </h1>
            <p className='font-medium text-slate-500'>
              Manage and organize internship teams with ease.
            </p>
          </div>
          <Button
            type='primary'
            size='large'
            icon={<PlusOutlined />}
            className='from-primary shadow-primary/25 flex h-12 min-w-[180px] items-center gap-2 rounded-full border-none bg-gradient-to-r to-orange-600 px-8 font-bold shadow-lg transition-all hover:scale-105 active:scale-95'
            onClick={() => setCreateModal(true)}
          >
            Create New Group
          </Button>
        </div>

        <div className='mb-8 flex flex-col items-center justify-between gap-6 md:flex-row'>
          <div className='flex w-full rounded-2xl bg-slate-200/50 p-1.5 md:w-auto'>
            <button
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === 'ALL' ? 'text-primary bg-white shadow-sm' : 'hover:text-primary text-slate-500'}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Groups ({groups.length})
            </button>
            <button
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === 'ACTIVE' ? 'text-primary bg-white shadow-sm' : 'hover:text-primary text-slate-500'}`}
              onClick={() => setActiveTab('ACTIVE')}
            >
              Active
            </button>
            <button
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === 'ARCHIVED' ? 'text-primary bg-white shadow-sm' : 'hover:text-primary text-slate-500'}`}
              onClick={() => setActiveTab('ARCHIVED')}
            >
              Archived
            </button>
          </div>

          <Input
            placeholder='Search groups...'
            prefix={<SearchOutlined className='text-primary mr-2' />}
            className='hover:border-primary focus:border-primary h-12 max-w-72 rounded-2xl border-slate-200 bg-white shadow-sm transition-all'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='premium-scrollbar flex-1 overflow-y-auto pb-10'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredGroups.map((group) => {
              const mentor = MOCK_MENTORS.find((m) => m.id === group.mentorId);
              return (
                <Card
                  key={group.id}
                  className={`group rounded-[32px] border-none shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${group.status === 'ARCHIVED' ? 'bg-white/60 grayscale' : 'bg-white'}`}
                  styles={{ body: { padding: 32 } }}
                >
                  <div className='mb-6 flex items-start justify-between'>
                    <div
                      className={`rounded-2xl p-4 ${group.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-400' : 'bg-primary/5 text-primary'}`}
                    >
                      <CodeOutlined className='text-xl' />
                    </div>
                    <div className='flex items-center gap-3'>
                      <Tag
                        className={`rounded-full border-none px-4 py-1.5 text-[11px] font-extrabold tracking-widest uppercase ${group.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {group.status}
                      </Tag>
                      <Tooltip title='Delete Group'>
                        <Button
                          type='text'
                          shape='circle'
                          icon={
                            <DeleteOutlined className='text-slate-300 transition-colors hover:text-rose-500' />
                          }
                          onClick={() => handleDeleteGroup(group)}
                          className='flex items-center justify-center border-none bg-slate-50 hover:bg-rose-50'
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className='mb-8'>
                    <Title
                      level={4}
                      className={`!mb-2 !text-xl !font-extrabold ${group.status === 'ARCHIVED' ? 'text-slate-500' : 'text-slate-900'}`}
                    >
                      {group.name}
                    </Title>
                    <div className='flex items-center gap-2.5 font-medium text-slate-500'>
                      {mentor ? (
                        <UserOutlined className='text-primary' />
                      ) : (
                        <PlusOutlined className='text-slate-300' />
                      )}
                      <span className='text-sm'>
                        Mentor:{' '}
                        <span
                          className={`${mentor ? 'decoration-primary/30 text-slate-900 underline' : 'text-slate-400 italic'}`}
                        >
                          {mentor?.name || 'Not Assigned'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Avatar.Group
                        maxCount={4}
                        size='large'
                        className={group.status === 'ARCHIVED' ? 'opacity-50 grayscale' : ''}
                      >
                        {group.avatars.map((url, i) => (
                          <Avatar key={i} src={url} />
                        ))}
                      </Avatar.Group>
                      <span
                        className={`text-sm font-medium ${group.status === 'ARCHIVED' ? 'text-slate-300' : 'text-slate-400'}`}
                      >
                        {group.memberCount} members
                      </span>
                    </div>

                    <div className='flex flex-col gap-4 pt-6'>
                      <Button
                        className={`h-14 w-full rounded-2xl border-none py-3 text-sm font-extrabold shadow-sm transition-all ${group.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-red-700 hover:shadow-lg active:scale-[0.98]'}`}
                        onClick={() =>
                          group.status !== 'ARCHIVED' && setAssignModal({ open: true, group })
                        }
                      >
                        {mentor ? 'Change Mentor' : 'Assign Mentor'}
                      </Button>
                      <button
                        className={`hover:letter-spacing-[0.25em] cursor-pointer text-center text-[11px] font-extrabold tracking-[0.2em] uppercase transition-all ${group.status === 'ARCHIVED' ? 'text-slate-300' : 'hover:text-primary text-slate-400 hover:tracking-[0.3em]'}`}
                        onClick={() => setViewModal({ open: true, group })}
                      >
                        {group.status === 'ARCHIVED' ? 'View Archive' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={assignModal.open}
        footer={null}
        closable={false}
        onCancel={() => setAssignModal({ open: false, group: null })}
        width={560}
        centered
        className='assign-modal'
      >
        <div className='flex items-start justify-between border-b border-slate-100 p-6'>
          <div>
            <h2 className='text-2xl leading-tight font-bold text-slate-900'>
              Assign Mentor & Project
            </h2>
            <div className='mt-1 flex items-center gap-2'>
              <span className="material-symbols-outlined text-primary font-variation-settings-['FILL'_0,'wght'_400] text-sm">
                group
              </span>
              <p className='text-sm font-medium text-slate-500'>
                Assigning for:{' '}
                <span className='font-semibold text-slate-900'>{assignModal.group?.name}</span>
              </p>
            </div>
          </div>
          <button
            className='text-slate-400 transition-colors hover:text-slate-600'
            onClick={() => setAssignModal({ open: false, group: null })}
          >
            <span className='material-symbols-outlined'>close</span>
          </button>
        </div>

        <div className='space-y-6 p-6'>
          <Form form={form} layout='vertical' onFinish={handleAssignSubmit}>
            <div className='mb-6 space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>Select Mentor</label>
              <Form.Item name='mentorId' className='!mb-0'>
                <Select
                  showSearch
                  placeholder='Search and select a mentor'
                  className='custom-select-v2 h-12 w-full'
                  suffixIcon={null}
                  prefix={<SearchOutlined className='text-slate-400' />}
                  options={MOCK_MENTORS.map((m) => ({
                    label: `${m.name} - ${m.role}`,
                    value: m.id,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
              <p className='px-1 text-[11px] text-slate-400 italic'>
                Tip: You can search by name or expertise
              </p>
            </div>

            <div className='mb-6 space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>Select Project</label>
              <Form.Item
                name='projectId'
                className='!mb-0'
                rules={[{ required: true, message: 'Vui lòng chọn dự án' }]}
              >
                <Select
                  placeholder='Select a project'
                  className='custom-select-v2 h-12 w-full'
                  options={MOCK_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
                  suffixIcon={<ProjectOutlined className='text-slate-400' />}
                />
              </Form.Item>
            </div>

            {assignModal.group?.mentorId && (
              <div className='mb-6 space-y-2'>
                <label className='block text-sm font-semibold text-slate-700'>
                  Reason for Change
                </label>
                <Form.Item
                  name='reason'
                  className='!mb-0'
                  rules={[{ required: true, message: 'Vui lòng nhập lý do thay đổi' }]}
                >
                  <Input.TextArea
                    placeholder='e.g. Schedule conflict, project reorganization'
                    className='hover:border-primary focus:border-primary rounded-xl border-slate-200 bg-slate-50 transition-all'
                    rows={3}
                  />
                </Form.Item>
              </div>
            )}

            <div className='bg-primary/5 border-primary/10 mb-6 flex gap-3 rounded-xl border p-4'>
              <span className='material-symbols-outlined text-primary'>info</span>
              <p className='text-xs leading-relaxed text-slate-600'>
                Assigning a mentor will notify all students in the group and the mentor via email.
                The project dashboard will be updated immediately upon confirmation.
              </p>
            </div>

            <div className='-mx-6 flex flex-col justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 pt-6 sm:flex-row'>
              <Button
                className='h-11 rounded-full border-slate-200 px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100'
                onClick={() => setAssignModal({ open: false, group: null })}
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
        </div>
      </Modal>

      <Modal
        title={null}
        open={viewModal.open}
        footer={null}
        closable={false}
        onCancel={() => setViewModal({ open: false, group: null })}
        width={640}
        centered
        className='view-modal'
      >
        <div className='flex items-start justify-between border-b border-slate-100 bg-slate-50/50 p-5'>
          <div>
            <h2 className='mb-1 text-xl leading-none font-bold text-slate-900'>
              {viewModal.group?.name}
            </h2>
            <p className='font-medium tracking-wide text-[xs] text-slate-400 uppercase'>
              {viewModal.group?.track} • {viewModal.group?.status}
            </p>
          </div>
          <button
            onClick={() => setViewModal({ open: false, group: null })}
            className='text-slate-400 transition-colors hover:text-rose-500'
          >
            <CloseOutlined className='text-lg' />
          </button>
        </div>

        <div className='p-5 pt-4'>
          <div className='mb-5 grid grid-cols-2 gap-4'>
            <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
              <p className='mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                Mentor
              </p>
              <p className='truncate font-bold text-slate-700'>
                {MOCK_MENTORS.find((m) => m.id === viewModal.group?.mentorId)?.name ||
                  'Not Assigned'}
              </p>
            </div>
            <div className='rounded-xl border border-slate-100 bg-slate-50 p-3'>
              <p className='mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase'>
                Current Members
              </p>
              <p className='font-bold text-slate-700'>{viewModal.group?.memberCount} students</p>
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='pl-1 text-[11px] font-black tracking-widest text-slate-400 uppercase'>
              Student List
            </h3>
            <div className='custom-scrollbar max-h-[320px] space-y-1.5 overflow-y-auto pr-2'>
              {viewModal.group?.avatars.length > 0 ? (
                Array.from({ length: viewModal.group.memberCount }).map((_, i) => (
                  <div
                    key={i}
                    className='group flex items-center justify-between rounded-xl border border-transparent p-2.5 transition-all hover:border-slate-100 hover:bg-slate-50'
                  >
                    <div className='flex items-center gap-3 overflow-hidden'>
                      <Avatar
                        src={viewModal.group.avatars[i % viewModal.group.avatars.length]}
                        size='large'
                        className='flex-shrink-0 border-2 border-white shadow-sm'
                      />
                      <div className='min-w-0'>
                        <p className='mb-1 truncate text-sm leading-none font-bold text-slate-900'>
                          Student Name {i + 1}
                        </p>
                        <p className='text-[10px] font-medium text-slate-400'>
                          Software Engineering
                        </p>
                      </div>
                    </div>
                    <Button
                      type='text'
                      size='small'
                      className='text-primary text-[10px] font-bold opacity-0 transition-all group-hover:opacity-100'
                    >
                      View Bio
                    </Button>
                  </div>
                ))
              ) : (
                <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center'>
                  <span className='material-symbols-outlined mb-1 text-3xl text-slate-300'>
                    group_off
                  </span>
                  <p className='text-xs font-medium text-slate-400'>No students assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 p-4'>
          <Button
            className='h-10 rounded-full border-slate-200 px-6 font-bold text-slate-600 hover:bg-white'
            onClick={() => setViewModal({ open: false, group: null })}
          >
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        title='Create New Internship Group'
        open={createModal}
        centered
        onCancel={() => setCreateModal(false)}
        onOk={() => form.submit()}
        okText='Create Group'
      >
        <Form form={form} layout='vertical' onFinish={handleCreateGroup}>
          <Form.Item
            label='Group Name'
            name='name'
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder='e.g., Web Frontend A' />
          </Form.Item>
          <Form.Item label='Track' name='track' initialValue='FRONTEND'>
            <Select
              options={[
                { label: 'Frontend', value: 'FRONTEND' },
                { label: 'Backend', value: 'BACKEND' },
                { label: 'Mobile', value: 'MOBILE' },
                { label: 'UI/UX Design', value: 'DESIGN' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-card {
          border-radius: 2rem !important;
        }
        .ant-btn-primary {
          background-color: #d52020 !important;
        }
        .ant-input,
        .ant-select-selector {
          border-radius: 0.75rem !important;
        }
        .ant-modal-content {
          border-radius: 32px !important;
          overflow: hidden !important;
          border: 1px solid #f1f5f9 !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
        }
        .assign-modal .ant-modal-content {
          padding: 0 !important;
        }
        .custom-select-v2 .ant-select-selector {
          padding-left: 44px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: #f8fafc !important;
        }
        .assign-modal .ant-form-item-label label {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #334155 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        /* Premium scrollbar class */
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 1px solid transparent;
          background-clip: content-box;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .premium-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          opacity: 1;
        }
      `}</style>

      {/* Material Symbols Link for the icons in the modal */}
      <link
        href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
        rel='stylesheet'
      />
    </div>
  );
}

export default function GroupManagement() {
  return (
    <App>
      <GroupManagementContent />
    </App>
  );
}


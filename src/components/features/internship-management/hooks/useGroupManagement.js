'use client';

import { useState, useMemo } from 'react';
import { App } from 'antd';

export const MOCK_MENTORS = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Senior Architect' },
  { id: 'm2', name: 'Marcus Chen', role: 'Lead Developer' },
  { id: 'm3', name: 'Elena Rodriguez', role: 'Product Manager' },
  { id: 'm4', name: 'Alex Rivera', role: 'UI/UX Lead' },
];

export const MOCK_PROJECTS = [
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

export function useGroupManagement() {
  const { notification, modal } = App.useApp();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [viewModal, setViewModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState(false);

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
    } else {
      notification.success({ message: 'Đã gán Mentor & Dự án thành công' });
    }
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
    notification.success({ message: 'Đã tạo nhóm thành công' });
  };

  return {
    groups,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filteredGroups,
    assignModal,
    setAssignModal,
    viewModal,
    setViewModal,
    createModal,
    setCreateModal,
    handleAssignSubmit,
    handleDeleteGroup,
    handleCreateGroup,
  };
}

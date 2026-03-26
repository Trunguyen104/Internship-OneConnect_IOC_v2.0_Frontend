'use client';

import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  LinkOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Divider, Drawer, Input, List, Space, Table, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { USER_ROLE } from '@/constants/common/enums';
import {
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
} from '@/constants/project-management/project-management';

import { ProjectService } from '../services/project.service';

export default function ProjectDetailDrawer({ visible, onClose, project, groups = [], onRefresh }) {
  const {
    TABS = {},
    STUDENT_STATUS = {},
    MESSAGES = {},
    MODALS = {},
    DETAIL = {},
    VIEW: FORM_VIEW = {},
  } = PROJECT_MANAGEMENT;
  const { ASSIGN = {} } = MODALS;

  const { userInfo } = useProfile();

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentProject = projectDetail || project;

  const isHR = useMemo(() => {
    const userRoleId = userInfo?.roleId || userInfo?.RoleId;
    return userRoleId === USER_ROLE.HR || userRoleId === USER_ROLE.ENTERPRISE_ADMIN;
  }, [userInfo]);

  const fetchProjectDetail = useCallback(async () => {
    if (!project?.projectId || !visible) return;
    try {
      setDetailLoading(true);
      const res = await ProjectService.getById(project.projectId);
      if (res?.data) {
        setProjectDetail(res.data);
      }
    } catch (err) {
      console.error('Error fetching project detail:', err);
    } finally {
      setDetailLoading(false);
    }
  }, [project?.projectId, visible]);

  const fetchAssignedStudents = useCallback(async () => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const groupId = currentProject?.internshipId || currentProject?.groupInfo?.internshipId;

    if (!groupId || !guidRegex.test(groupId) || !visible) return;

    try {
      setLoading(true);
      const res = await ProjectService.getStudentsByGroup(groupId);
      const groupInfo = res?.data || res;
      if (groupInfo?.members) {
        setAssignedStudents(groupInfo.members);
      } else if (Array.isArray(groupInfo)) {
        setAssignedStudents(groupInfo);
      }
    } catch (err) {
      console.error('Error fetching group students:', err);
    } finally {
      setLoading(false);
    }
  }, [currentProject?.internshipId, currentProject?.groupInfo?.internshipId, visible]);

  useEffect(() => {
    if (visible) {
      fetchProjectDetail();
      setActiveTab('details');
    } else {
      setProjectDetail(null);
      setActiveTab('details');
    }
  }, [visible, project?.projectId, fetchProjectDetail]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchAssignedStudents();
    }
  }, [activeTab, fetchAssignedStudents]);

  const handleUnassign = async (studentId) => {
    try {
      setLoading(true);
      await ProjectService.unassignStudent(currentProject.projectId, studentId);
      toast.success(MESSAGES.UNASSIGN_SUCCESS);
      fetchAssignedStudents();
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.message || MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignGroup = async () => {
    if (!selectedGroupId || !currentProject?.projectId) return;
    try {
      setLoading(true);
      const group = groups.find(
        (g) => (g.id || g.internshipGroupId || g.internshipId) === selectedGroupId
      );
      await ProjectService.assignGroup(currentProject.projectId, selectedGroupId);

      const count = group?.studentCount || 0;
      toast.success(MESSAGES.ASSIGN_SUCCESS.replace('{count}', count));

      if (onRefresh) onRefresh();
      fetchAssignedStudents();
      fetchProjectDetail();
      setActiveTab('students');
    } catch (err) {
      toast.error(err.message || MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const studentColumns = [
    {
      title: DETAIL.STUDENTS.COLUMNS?.NAME || 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-semibold text-sm">{text}</div>
            <div className="text-[11px] text-gray-400">{record.studentCode}</div>
          </div>
        </Space>
      ),
    },
    {
      title: DETAIL.STUDENTS.COLUMNS?.UNIVERSITY || 'University',
      dataIndex: 'universityName',
      key: 'universityName',
      render: (text, record) =>
        record.universityName || record.university || record.schoolName || record.school || '-',
      responsive: ['md'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
    },
    {
      title: DETAIL.STUDENTS.COLUMNS?.STATUS || 'Status',
      dataIndex: 'termStatus',
      key: 'termStatus',
      render: (status) => {
        let color = 'blue';
        if (status === 'Ended') color = 'default';
        if (status === 'Active') color = 'success';
        return (
          <Tag color={color} className="rounded-md font-medium">
            {status || 'Active'}
          </Tag>
        );
      },
    },
  ];

  const filteredStudents = assignedStudents.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {detailLoading ? <SearchOutlined className="animate-spin" /> : <FileOutlined />}
          </div>
          <div>
            <h3 className="mb-0 text-base font-bold text-gray-800">
              {currentProject?.projectName || DETAIL.TITLE}
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-widest">
              {currentProject?.projectCode || currentProject?.code || DETAIL.NO_CODE}
            </span>
          </div>
        </div>
      }
      open={visible}
      onClose={onClose}
      size={640}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="project-detail-tabs"
        items={[
          {
            key: 'details',
            label: TABS.DETAIL || 'Details',
            children: (
              <div className="space-y-6 pt-4">
                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] tracking-widest">
                    {DETAIL.SECTIONS.DESCRIPTION}
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                    {currentProject?.description || DETAIL.SECTIONS.DESCRIPTION_EMPTY}
                  </p>
                </section>

                <div className="flex flex-wrap gap-x-8 gap-y-6 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                  <section className="min-w-[120px]">
                    <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
                      {DETAIL.SECTIONS.MENTOR}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        src={currentProject?.mentorAvatar}
                        icon={<UserOutlined />}
                        className="bg-primary/10 text-primary border-none"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {currentProject?.mentorName ||
                          currentProject?.groupInfo?.mentorName ||
                          'N/A'}
                      </span>
                    </div>
                  </section>
                  <section className="min-w-[140px]">
                    <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
                      {DETAIL.SECTIONS.FIELD_TEMPLATE}
                    </h4>
                    <div className="flex flex-col gap-1">
                      <Tag
                        color="blue"
                        className="w-fit m-0 border-none font-bold text-[10px] rounded-md px-2"
                      >
                        {currentProject?.field || 'N/A'}
                      </Tag>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        Template:{' '}
                        <span className="text-primary">
                          {FORM_VIEW.FIELD_OPTIONS?.TEMPLATE?.[
                            { 0: 'SCRUM', 1: 'KANBAN', 2: 'NONE' }[currentProject?.template]
                          ] || 'None'}
                        </span>
                      </span>
                    </div>
                  </section>
                  <section className="min-w-[180px]">
                    <h4 className="mb-2 font-bold text-slate-400 text-[9px] uppercase tracking-widest">
                      {DETAIL.SECTIONS.TIMELINE}
                    </h4>
                    <div className="text-sm font-bold text-slate-700 flex items-center whitespace-nowrap">
                      {currentProject?.startDate
                        ? dayjs(currentProject.startDate).format('DD/MM/YYYY')
                        : 'TBA'}
                      <ArrowRightOutlined className="mx-2 text-[10px] text-slate-300" />
                      {currentProject?.endDate
                        ? dayjs(currentProject.endDate).format('DD/MM/YYYY')
                        : 'TBA'}
                    </div>
                  </section>
                </div>

                <Divider className="my-2 opacity-50" />

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] tracking-widest">
                    {DETAIL.SECTIONS.GROUP_INFO}
                  </h4>
                  {currentProject?.groupInfo?.groupName ||
                  currentProject?.groupName ||
                  currentProject?.internshipGroup?.groupName ? (
                    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div>
                          <div className="text-lg font-bold text-slate-800">
                            {currentProject?.groupInfo?.groupName ||
                              currentProject.groupName ||
                              currentProject.internshipGroup?.groupName}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-widest font-bold">
                            {DETAIL.GROUP.ID}:{' '}
                            {currentProject.groupInfo?.internshipId ||
                              currentProject.internshipId ||
                              'N/A'}
                          </div>
                        </div>
                        {isHR &&
                          (currentProject.internshipId ||
                            currentProject.groupInfo?.internshipId) && (
                            <Link
                              href={`/internship-groups/${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                              className="text-[10px] bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wide"
                            >
                              <ArrowRightOutlined className="rotate-180" />{' '}
                              {DETAIL.GROUP.MANAGE_LINK}
                            </Link>
                          )}
                      </div>
                      <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="flex flex-col bg-slate-50 border border-slate-100/50 rounded-lg p-3">
                          <span className="text-[9px] uppercase text-slate-400 font-bold mb-1.5 tracking-widest">
                            {DETAIL.GROUP.MENTOR}
                          </span>
                          <div className="flex items-center gap-2">
                            <Avatar
                              size={20}
                              icon={<UserOutlined />}
                              className="bg-blue-50 text-blue-500 border-none"
                            />
                            <span className="text-xs font-bold text-slate-700">
                              {currentProject.groupInfo?.mentorName ||
                                currentProject.internshipGroup?.mentorName ||
                                'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col bg-slate-50 border border-slate-100/50 rounded-lg p-3">
                          <span className="text-[9px] uppercase text-slate-400 font-bold mb-1.5 tracking-widest">
                            {DETAIL.GROUP.STUDENT_COUNT}
                          </span>
                          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {currentProject.groupInfo?.studentCount ||
                              currentProject.internshipGroup?.studentCount ||
                              assignedStudents.length ||
                              0}{' '}
                            {DETAIL.GROUP.STUDENTS_SUFFIX}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                        <ExclamationCircleOutlined />
                        {currentProject?.status === PROJECT_STATUS.DRAFT
                          ? DETAIL.GROUP.NOT_ASSIGNED
                          : DETAIL.GROUP.DELETED}
                      </div>
                      <span className="text-[11px] text-red-400 font-medium">
                        {currentProject?.status === PROJECT_STATUS.DRAFT
                          ? DETAIL.GROUP.NOT_ASSIGNED_HINT
                          : DETAIL.GROUP.DELETED_HINT}
                      </span>
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-amber-400 pl-3 uppercase text-[10px] tracking-widest">
                    {DETAIL.SECTIONS.REQUIREMENTS}
                  </h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl text-sm border border-slate-100/50">
                    {currentProject?.requirements || DETAIL.SECTIONS.REQUIREMENTS_EMPTY}
                  </p>
                </section>

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 uppercase text-[10px] tracking-widest">
                    {DETAIL.SECTIONS.DELIVERABLES}
                  </h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl text-sm border border-slate-100/50">
                    {currentProject?.deliverables || DETAIL.SECTIONS.DELIVERABLES_EMPTY}
                  </p>
                </section>
              </div>
            ),
          },
          {
            key: 'students',
            label: TABS.STUDENTS || 'Students',
            children: (
              <div className="pt-2">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder={DETAIL.STUDENTS.SEARCH_PLACEHOLDER}
                      prefix={<SearchOutlined className="text-slate-400" />}
                      className="w-64 rounded-xl bg-slate-50 border-slate-100 shadow-sm"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isHR &&
                      (currentProject.internshipId || currentProject.groupInfo?.internshipId) && (
                        <Link
                          href={`/internship-groups/${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary-hover bg-primary/5 px-3 py-2 rounded-lg transition-all uppercase tracking-wide border border-primary/10 shadow-sm"
                        >
                          <ArrowRightOutlined className="rotate-180" /> {DETAIL.GROUP.MANAGE_LINK}
                        </Link>
                      )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200/50 shadow-sm">
                    {DETAIL.STUDENTS.COUNT_LABEL} {assignedStudents.length}{' '}
                    {DETAIL.GROUP.STUDENTS_SUFFIX}
                  </span>
                </div>
                <Table
                  columns={studentColumns}
                  dataSource={filteredStudents}
                  loading={loading}
                  rowKey="studentId"
                  size="small"
                  pagination={{ pageSize: 8 }}
                  className="custom-table"
                  locale={{
                    emptyText: (
                      <div className="py-12 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 mt-2">
                        <p className="text-slate-400 italic mb-1 text-sm font-medium">
                          {DETAIL.STUDENTS.EMPTY_MESSAGE}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          {DETAIL.STUDENTS.EMPTY_HINT}
                        </p>
                      </div>
                    ),
                  }}
                />
              </div>
            ),
          },
          {
            key: 'resources',
            label: TABS.RESOURCES || 'Resources',
            children: (
              <div className="space-y-8 pt-4">
                <section>
                  <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] flex items-center justify-between tracking-widest">
                    {DETAIL.SECTIONS.RESOURCES}
                    <span className="text-[9px] font-bold text-slate-400 normal-case italic uppercase tracking-tighter">
                      {DETAIL.SECTIONS.RESOURCES_HINT}
                    </span>
                  </h4>
                  {currentProject?.projectResources?.length > 0 ||
                  currentProject?.resources?.attachments?.length > 0 ? (
                    <List
                      size="small"
                      dataSource={
                        currentProject.projectResources ||
                        currentProject.resources?.attachments ||
                        []
                      }
                      renderItem={(item) => (
                        <List.Item
                          className="hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 px-4 transition-all mb-2 bg-slate-50/30"
                          extra={
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              onClick={() => window.open(item.resourceUrl || item.url, '_blank')}
                              className="rounded-lg font-bold text-[10px] uppercase tracking-widest h-8"
                            >
                              {DETAIL.RESOURCES.ACCESS}
                            </Button>
                          }
                        >
                          <List.Item.Meta
                            avatar={
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <FileOutlined className="text-lg text-primary" />
                              </div>
                            }
                            title={
                              <span className="text-sm font-bold text-slate-700">
                                {item.resourceName || item.name}
                              </span>
                            }
                            description={
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {item.resourceType === 1
                                  ? DETAIL.RESOURCES.INTERNAL
                                  : DETAIL.RESOURCES.EXTERNAL}
                              </span>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-10 text-slate-400 italic text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                      {DETAIL.SECTIONS.NO_RESOURCES}
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 uppercase text-[10px] tracking-widest">
                    {DETAIL.SECTIONS.LINKS}
                  </h4>
                  {currentProject?.resources?.links?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {currentProject.resources.links.map((link, idx) => (
                        <Tag
                          key={idx}
                          icon={<LinkOutlined />}
                          color="processing"
                          className="cursor-pointer py-2 px-4 hover:scale-105 transition-all rounded-xl border-none font-bold shadow-sm bg-blue-50 text-blue-600"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          {link.title || link.url}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 italic text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                      {DETAIL.SECTIONS.NO_LINKS}
                    </div>
                  )}
                </section>
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
}

'use client';

import {
  ArrowRightOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  LinkOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Divider, Drawer, Form, Input, List, Space, Table, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { USER_ROLE } from '@/constants/common/enums';
import {
  INTERNSHIP_MANAGEMENT_UI,
  PROJECT_STATUS,
} from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { Select } from '../../backlog/components/TaskFields';
import { ProjectService } from '../services/project.service';

export default function ProjectDetailDrawer({ visible, onClose, project, groups = [], onRefresh }) {
  const toast = useToast();
  const { PROJECT_MANAGEMENT = {} } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE || {};
  const { TABS = {}, STUDENT_STATUS = {}, MESSAGES = {}, MODALS = {} } = PROJECT_MANAGEMENT;
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
    } else {
      setProjectDetail(null);
      setActiveTab('details');
    }
  }, [visible, fetchProjectDetail]);

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
      title: 'Họ và tên',
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
      title: 'Trường đại học',
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
      title: 'Trạng thái kỳ',
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-surface text-primary">
            {detailLoading ? <SearchOutlined className="animate-spin" /> : <SearchOutlined />}
          </div>
          <div>
            <h3 className="mb-0 text-base font-bold text-gray-800">
              {currentProject?.projectName || 'Chi tiết dự án'}
            </h3>
            <span className="text-xs font-medium text-primary bg-primary-surface px-2 py-0.5 rounded">
              {currentProject?.projectCode || currentProject?.code || 'NO-CODE'}
            </span>
          </div>
        </div>
      }
      open={visible}
      onClose={onClose}
      size={800}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="project-detail-tabs"
        items={[
          {
            key: 'details',
            label: TABS.DETAILS,
            children: (
              <div className="space-y-6 pt-4">
                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-xs">
                    Project Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {currentProject?.description || 'Chưa cập nhật mô tả.'}
                  </p>
                </section>

                <div className="grid grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <section>
                    <h4 className="mb-2 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                      Project Mentor
                    </h4>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        src={currentProject?.mentorAvatar}
                        icon={<UserOutlined />}
                        className="bg-primary-surface text-primary"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {currentProject?.mentorName ||
                          currentProject?.groupInfo?.mentorName ||
                          'Admin'}
                      </span>
                    </div>
                  </section>
                  <section>
                    <h4 className="mb-2 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                      Lĩnh vực & Framework
                    </h4>
                    <div className="flex flex-col gap-1">
                      <Tag color="blue" className="w-fit m-0 border-none font-medium">
                        {currentProject?.field || 'N/A'}
                      </Tag>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Template:{' '}
                        <span className="text-primary">
                          {{ 0: 'Scrum', 1: 'Kanban', 2: 'None' }[currentProject?.template] ||
                            'None'}
                        </span>
                      </span>
                    </div>
                  </section>
                  <section>
                    <h4 className="mb-2 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                      Thời gian thực hiện
                    </h4>
                    <div className="text-sm font-semibold text-gray-700 flex items-center">
                      {currentProject?.startDate
                        ? dayjs(currentProject.startDate).format('DD/MM/YYYY')
                        : 'TBA'}
                      <ArrowRightOutlined className="mx-2 text-[10px] text-gray-400" />
                      {currentProject?.endDate
                        ? dayjs(currentProject.endDate).format('DD/MM/YYYY')
                        : 'TBA'}
                    </div>
                  </section>
                </div>

                <Divider className="my-2 opacity-50" />

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-xs tracking-widest">
                    Thông tin Intern Group
                  </h4>
                  {currentProject?.groupInfo?.groupName ||
                  currentProject?.groupName ||
                  currentProject?.internshipGroup?.groupName ? (
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div>
                          <div className="text-xl font-bold text-gray-800">
                            {currentProject?.groupInfo?.groupName ||
                              currentProject.groupName ||
                              currentProject.internshipGroup?.groupName ||
                              'Chưa gán nhóm'}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1 font-mono uppercase tracking-tighter">
                            {currentProject.groupInfo?.internshipId || currentProject.internshipId
                              ? `Group ID: ${currentProject.groupInfo?.internshipId || currentProject.internshipId}`
                              : 'Chưa có thông tin Group ID'}
                          </div>
                        </div>
                        {isHR &&
                          (currentProject.internshipId ||
                            currentProject.groupInfo?.internshipId) && (
                            <Link
                              href={`/internship-groups/${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                              className="text-xs bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-md active:scale-95"
                            >
                              <ArrowRightOutlined className="rotate-180" /> Quản lý nhóm
                            </Link>
                          )}
                      </div>
                      <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="flex flex-col bg-gray-50 rounded-xl p-3">
                          <span className="text-[9px] uppercase text-gray-400 font-black mb-1.5 tracking-widest">
                            Group Mentor
                          </span>
                          <div className="flex items-center gap-2">
                            <Avatar
                              size={20}
                              icon={<UserOutlined />}
                              className="bg-blue-100 text-blue-600"
                            />
                            <span className="text-sm font-bold text-gray-700">
                              {currentProject.groupInfo?.mentorName ||
                                currentProject.internshipGroup?.mentorName ||
                                'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col bg-gray-50 rounded-xl p-3">
                          <span className="text-[9px] uppercase text-gray-400 font-black mb-1.5 tracking-widest">
                            Sĩ số sinh viên
                          </span>
                          <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {currentProject.groupInfo?.studentCount ||
                              currentProject.internshipGroup?.studentCount ||
                              assignedStudents.length ||
                              0}{' '}
                            sinh viên
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                        <ExclamationCircleOutlined />
                        {currentProject?.status === PROJECT_STATUS.DRAFT
                          ? 'Chưa gán nhóm'
                          : 'Nhóm đã bị xóa'}
                      </div>
                      <span className="text-xs text-red-400">
                        {currentProject?.status === PROJECT_STATUS.DRAFT
                          ? 'Vui lòng vào Edit để chọn Intern Group trước khi Publish.'
                          : 'Dự án cần được gán lại nhóm mới để tiếp tục.'}
                      </span>
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-warning pl-3 uppercase text-xs tracking-widest">
                    Yêu cầu kỹ thuật (Requirements)
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50/30 p-4 rounded-xl text-sm">
                    {currentProject?.requirements || 'Chưa cập nhật yêu cầu kỹ thuật.'}
                  </p>
                </section>

                <section>
                  <h4 className="mb-3 font-bold text-gray-800 border-l-4 border-success pl-3 uppercase text-xs tracking-widest">
                    Sản phẩm đầu ra (Deliverables)
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50/30 p-4 rounded-xl text-sm">
                    {currentProject?.deliverables || 'Chưa cập nhật sản phẩm đầu ra.'}
                  </p>
                </section>
              </div>
            ),
          },
          {
            key: 'students',
            label: 'Sinh viên trong Nhóm',
            children: (
              <div className="pt-2">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="Tìm kiếm sinh viên..."
                      prefix={<SearchOutlined className="text-gray-400" />}
                      className="w-64 rounded-xl"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isHR &&
                      (currentProject.internshipId || currentProject.groupInfo?.internshipId) && (
                        <Link
                          href={`/internship-groups/${currentProject.groupInfo?.internshipId || currentProject.internshipId}`}
                          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover bg-primary/5 px-3 py-2 rounded-lg transition-all"
                        >
                          <ArrowRightOutlined className="rotate-180" /> Quản lý nhóm
                        </Link>
                      )}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Sĩ số: {assignedStudents.length} sinh viên
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
                      <div className="py-12 text-center">
                        <p className="text-gray-400 italic mb-2">Nhóm hiện chưa có sinh viên.</p>
                        <p className="text-xs text-gray-400">
                          HR cần thêm sinh viên vào nhóm (Issue-77 AC-G05).
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
            label: 'Tài liệu & Links',
            children: (
              <div className="space-y-8 pt-4">
                <section>
                  <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-info pl-3 uppercase text-xs flex items-center justify-between tracking-widest">
                    Tài liệu đính kèm
                    <span className="text-[10px] font-normal text-gray-400 normal-case italic">
                      Xem và tải xuống các tệp tin của dự án
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
                          className="hover:bg-primary-surface/50 rounded-xl border border-transparent hover:border-primary/10 px-4 transition-all mb-2"
                          extra={
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              onClick={() => window.open(item.resourceUrl || item.url, '_blank')}
                              className="rounded-lg font-bold"
                            >
                              Truy cập
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
                              <span className="text-sm font-bold text-gray-700">
                                {item.resourceName || item.name}
                              </span>
                            }
                            description={
                              <span className="text-[11px] text-gray-400 font-medium italic">
                                {item.resourceType === 1 ? 'Internal Doc' : 'External Link'}
                              </span>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <div className="text-center py-10 text-gray-400 italic text-sm bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                      Chưa có tài liệu đính kèm cho dự án này.
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-success pl-3 uppercase text-xs tracking-widest">
                    Liên kết nhanh (Quick Links)
                  </h4>
                  {currentProject?.resources?.links?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {currentProject.resources.links.map((link, idx) => (
                        <Tag
                          key={idx}
                          icon={<LinkOutlined />}
                          color="processing"
                          className="cursor-pointer py-2 px-4 hover:scale-105 transition-all rounded-xl border-none font-bold shadow-sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          {link.title || link.url}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400 italic text-sm bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                      Chưa có liên kết bên ngoài.
                    </div>
                  )}
                </section>
              </div>
            ),
          },
          {
            key: 'assign_group',
            label: 'Cấp phát nhóm',
            children: (
              <div className="pt-6 px-4">
                <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-100 italic text-blue-700 text-sm">
                  Notice: You can assign an internship group to take over this project. All students
                  in the group will be automatically assigned to the project.
                </div>

                <Form layout="vertical">
                  <Form.Item
                    label="Select internship group"
                    required
                    tooltip="Only active groups you manage are shown"
                  >
                    <Select
                      placeholder="Search and select group..."
                      className="w-full"
                      size="large"
                      onChange={(v) => setSelectedGroupId(v)}
                      value={selectedGroupId}
                    >
                      {groups.map((g) => (
                        <Select.Option
                          key={g.id || g.internshipId || g.internshipGroupId}
                          value={g.id || g.internshipId || g.internshipGroupId}
                        >
                          {g.groupName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div className="mt-8 flex justify-center">
                    <Button
                      type="primary"
                      size="large"
                      icon={<SearchOutlined />}
                      onClick={handleAssignGroup}
                      loading={loading}
                      disabled={!selectedGroupId}
                      className="min-w-[200px]"
                    >
                      Assign Group to Project
                    </Button>
                  </div>
                </Form>

                {(currentProject?.internshipGroup || currentProject?.groupInfo) && (
                  <div className="mt-12 border-t pt-8 text-center text-gray-400">
                    Project is currently assigned to:{' '}
                    <span className="font-bold text-gray-700">
                      {currentProject.groupInfo?.groupName ||
                        currentProject.groupName ||
                        currentProject.internshipGroup?.groupName}
                    </span>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
}

'use client';

import { FileOutlined, SearchOutlined } from '@ant-design/icons';
import { Drawer, Tabs } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { USER_ROLE } from '@/constants/common/enums';
import {
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
} from '@/constants/project-management/project-management';

import { ProjectService } from '../services/project.service';
import ProjectDetailsTab from './sub-components/ProjectDetailsTab';
import ProjectResourcesTab from './sub-components/ProjectResourcesTab';
import ProjectStudentsTab from './sub-components/ProjectStudentsTab';

export default function ProjectDetailDrawer({ visible, onClose, project, groups = [], onRefresh }) {
  const { FORM = {}, TABS = {}, MESSAGES = {}, MODALS = {}, DETAIL = {} } = PROJECT_MANAGEMENT;

  const { userInfo } = useProfile();

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]);
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
      if (project?.projectId) {
        setProjectDetail(null);
        setAssignedStudents([]);
        setSearchTerm('');
        fetchProjectDetail();
      }
      setActiveTab('details');
    } else {
      setProjectDetail(null);
      setAssignedStudents([]);
      setSearchTerm('');
      setActiveTab('details');
    }
  }, [visible, project?.projectId, fetchProjectDetail]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchAssignedStudents();
    }
  }, [activeTab, fetchAssignedStudents]);

  const filteredStudents = assignedStudents.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const projectResources = currentProject?.projectResources || [];
  const internalDocs = projectResources.filter((item) => item.resourceType === 1);
  const quickLinks = projectResources.filter((item) => item.resourceType === 10);
  const legacyAttachments = currentProject?.resources?.attachments || [];
  const legacyLinks = currentProject?.resources?.links || [];

  const hasDocs = internalDocs.length > 0 || legacyAttachments.length > 0;
  const hasLinks = quickLinks.length > 0 || legacyLinks.length > 0;

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
              <ProjectDetailsTab
                currentProject={currentProject}
                DETAIL={DETAIL}
                FORM={FORM}
                PROJECT_STATUS={PROJECT_STATUS}
                isHR={isHR}
              />
            ),
          },
          {
            key: 'students',
            label: TABS.STUDENTS || 'Students',
            children: (
              <ProjectStudentsTab
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                assignedStudents={assignedStudents}
                filteredStudents={filteredStudents}
                DETAIL={DETAIL}
                currentProject={currentProject}
                isHR={isHR}
              />
            ),
          },
          {
            key: 'resources',
            label: TABS.RESOURCES || 'Resources',
            children: (
              <ProjectResourcesTab
                internalDocs={internalDocs}
                legacyAttachments={legacyAttachments}
                quickLinks={quickLinks}
                legacyLinks={legacyLinks}
                hasDocs={hasDocs}
                hasLinks={hasLinks}
                DETAIL={DETAIL}
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}

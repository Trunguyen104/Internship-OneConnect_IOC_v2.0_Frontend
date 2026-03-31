'use client';

import { FileOutlined, SearchOutlined } from '@ant-design/icons';
import { Drawer, Tabs, Tag } from 'antd';
import React, { useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import {
  getOperationalStatus,
  getVisibilityStatus,
  OPERATIONAL_LABELS,
  OPERATIONAL_STATUS,
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
  VISIBILITY_LABELS,
  VISIBILITY_STATUS,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

import { useProjectDetail } from '../hooks/useProjectDetail';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectResourcesTab from './ProjectResourcesTab';
import ProjectStudentsTab from './ProjectStudentsTab';

export default function ProjectDetailDrawer({ visible, onClose, project, onAssign }) {
  const { FORM = {}, DETAIL = {} } = PROJECT_MANAGEMENT;

  const { userInfo } = useProfile();

  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');

  // Use the new hook for fetching
  const {
    project: projectDetail,
    loading: detailLoading,
    students: assignedStudents,
  } = useProjectDetail(
    project?.projectId || project?.id,
    project?.internshipId || project?.groupInfo?.internshipId,
    visible
  );

  const currentProject = projectDetail || project;

  const isHR = useMemo(() => {
    if (!userInfo) return false;
    const r = userInfo.roleId || userInfo.RoleId || userInfo.role || userInfo.Role;
    const roleName = userInfo.roleName || userInfo.RoleName || (typeof r === 'string' ? r : '');

    // Check numeric IDs 1-5 (All Admin/HR roles)
    const num = Number(r);
    if (!isNaN(num) && num >= 1 && num <= 5) return true;

    // Check string patterns
    const str = String(roleName || r).toLowerCase();
    return str.includes('hr') || str.includes('admin') || str.includes('enterprise');
  }, [userInfo]);

  const filteredStudents = assignedStudents.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toast = useToast();

  const handleViewResource = async (item) => {
    const url = item.resourceUrl || item.url;
    if (!url) {
      toast.error(PROJECT_MANAGEMENT.MESSAGES.ERROR_RESOURCE_ACCESS);
      return;
    }

    // For Cloudinary API download URLs, probe first to catch "Resource not found" before opening a broken tab
    if (url.includes('api.cloudinary.com')) {
      try {
        const res = await fetch(url, { method: 'GET', mode: 'no-cors' });
        // no-cors always returns opaque response; we open it and let Cloudinary handle it
        // If the URL is clearly invalid we catch below
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch {
        toast.error(PROJECT_MANAGEMENT.MESSAGES.ERROR_RESOURCE_ACCESS);
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const LINK_TYPES = ['8', 'LINK'];
  const allResources = currentProject?.projectResources || [];
  const internalDocs = allResources.filter(
    (r) =>
      !LINK_TYPES.includes(
        String(r.resourceType || '')
          .toUpperCase()
          .trim()
      )
  );
  const quickLinks = allResources.filter((r) =>
    LINK_TYPES.includes(
      String(r.resourceType || '')
        .toUpperCase()
        .trim()
    )
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
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase tracking-widest">
                {currentProject?.projectCode || currentProject?.code || DETAIL.NO_CODE}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none mb-0.5">
                    {DETAIL.LABELS?.VISIBILITY}
                  </span>
                  <Tag
                    color={
                      getVisibilityStatus(currentProject?.visibilityStatus) ===
                      VISIBILITY_STATUS.PUBLISHED
                        ? 'blue'
                        : 'orange'
                    }
                    className="m-0 border-none font-bold text-[9px] rounded-md px-1.5 uppercase leading-none h-4 flex items-center"
                  >
                    {VISIBILITY_LABELS[getVisibilityStatus(currentProject?.visibilityStatus)]}
                  </Tag>
                </div>
                <div className="flex flex-col gap-0 border-l border-slate-100 pl-2 ml-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none mb-0.5">
                    {DETAIL.LABELS?.OPERATIONAL}
                  </span>
                  <Tag
                    color={
                      getOperationalStatus(currentProject?.operationalStatus) ===
                      OPERATIONAL_STATUS.ACTIVE
                        ? 'processing'
                        : getOperationalStatus(currentProject?.operationalStatus) ===
                            OPERATIONAL_STATUS.COMPLETED
                          ? 'success'
                          : 'default'
                    }
                    className="m-0 border-none font-bold text-[9px] rounded-md px-1.5 uppercase leading-none h-4 flex items-center"
                  >
                    {OPERATIONAL_LABELS[getOperationalStatus(currentProject?.operationalStatus)]}
                  </Tag>
                </div>
              </div>
            </div>
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
            label: DETAIL.TITLE,
            children: (
              <ProjectDetailsTab
                currentProject={currentProject}
                DETAIL={DETAIL}
                FORM={FORM}
                PROJECT_STATUS={PROJECT_STATUS}
                isHR={isHR}
                onAssign={onAssign}
              />
            ),
          },
          {
            key: 'students',
            label: DETAIL.STUDENTS.TITLE,
            children: (
              <ProjectStudentsTab
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                assignedStudents={assignedStudents}
                filteredStudents={filteredStudents}
                DETAIL={DETAIL}
                FORM={FORM}
                currentProject={currentProject}
                isHR={isHR}
              />
            ),
          },
          {
            key: 'resources',
            label: DETAIL.SECTIONS.RESOURCES,
            children: (
              <ProjectResourcesTab
                DETAIL={DETAIL}
                internalDocs={internalDocs}
                legacyAttachments={[]}
                quickLinks={quickLinks}
                legacyLinks={[]}
                hasDocs={internalDocs.length > 0}
                hasLinks={quickLinks.length > 0}
                onView={handleViewResource}
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}

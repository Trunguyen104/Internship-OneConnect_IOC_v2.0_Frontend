'use client';

import { FileOutlined, SearchOutlined } from '@ant-design/icons';
import { Drawer, Tabs, Tag } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getProjectResources,
  readProjectResource,
} from '@/components/features/project/services/projectResources';
import { useProfile } from '@/components/features/user/hooks/useProfile';
import {
  OPERATIONAL_LABELS,
  OPERATIONAL_STATUS,
  PROJECT_MANAGEMENT,
  PROJECT_STATUS,
  VISIBILITY_LABELS,
  VISIBILITY_STATUS,
} from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';
import { resolveResourceUrl } from '@/utils/resolveUrl';

import { ProjectService } from '../services/project.service';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectResourcesTab from './ProjectResourcesTab';
import ProjectStudentsTab from './ProjectStudentsTab';

export default function ProjectDetailDrawer({
  visible,
  onClose,
  project,
  groups = [],
  onRefresh,
  onAssign,
}) {
  const { FORM = {}, TABS = {}, MESSAGES = {}, MODALS = {}, DETAIL = {} } = PROJECT_MANAGEMENT;

  const { userInfo } = useProfile();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState(null);
  const [resources, setResources] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchProjectDetail = useCallback(async () => {
    const id = project?.projectId || project?.id;
    if (!id || !visible) return;

    try {
      setDetailLoading(true);
      const res = await ProjectService.getById(id);

      if (res?.data) {
        // Normalize string statuses from API to numeric constants for labels
        const p = res.data;
        let op = p.operationalStatus ?? p.status ?? 0;
        if (typeof op === 'string') {
          const opMap = { unstarted: 0, active: 1, completed: 2, archived: 3 };
          op = opMap[op.toLowerCase()] ?? 0;
        }
        let vis = p.visibilityStatus ?? p.visibility ?? (op === 0 ? 0 : 1);
        if (typeof vis === 'string') {
          const visMap = { draft: 0, published: 1 };
          vis = visMap[vis.toLowerCase()] ?? 0;
        }

        // AC-16: Orphaned Detection
        const gid = p.internshipId || p.internshipGroupId || p.groupId;
        const isEmptyGuid = gid === '00000000-0000-0000-0000-000000000000';
        const isMissing = !gid || isEmptyGuid;
        const isOrphaned = (op === 1 || op === 2) && isMissing;

        if (isOrphaned) {
          op = 0; // Forced Unstarted
        }

        setProjectDetail({
          ...p,
          projectId: id, // Ensure consistency
          operationalStatus: op,
          visibilityStatus: vis,
          status: op,
          isOrphaned,
          startDate: isOrphaned ? null : p.startDate || p.internPhaseStart,
          endDate: isOrphaned ? null : p.endDate || p.internPhaseEnd,
        });

        // AC-14/16: Fetch full resource details slowly/resiliently
        try {
          const resRes = await getProjectResources(id);
          const resourceItems = resRes?.data?.items || resRes?.data || [];
          if (Array.isArray(resourceItems)) {
            setResources(resourceItems);
          }
        } catch (rErr) {
          console.warn(
            'Resource fetch failed (usually permission or missing endpoint):',
            rErr.message
          );
          // Fallback to embedded resources if available
          setResources(p.projectResources || []);
        }
      }
    } catch (err) {
      console.error('Error fetching project detail:', err);
      // Don't toast 401/403 as they trigger global redirects
      if (err.status !== 401 && err.status !== 403) {
        toast.error(MESSAGES.ERROR_FETCH_DETAIL || 'Không thể tải chi tiết dự án.');
      }
    } finally {
      setDetailLoading(false);
    }
  }, [project?.projectId, project?.id, visible, toast, MESSAGES.ERROR_FETCH_DETAIL]);

  const fetchAssignedStudents = useCallback(async () => {
    const id = project?.projectId || project?.id;
    if (!id || !visible) return;

    try {
      setLoading(true);
      // Use project-specific endpoint instead of group-specific to avoid 403 for HR/Admin
      const res = await ProjectService.getAssignedStudents(id);
      const students = res?.data || res || [];

      if (Array.isArray(students)) {
        setAssignedStudents(students);
      } else if (students?.members) {
        setAssignedStudents(students.members);
      }
    } catch (err) {
      console.error('Error fetching project students:', err);
    } finally {
      setLoading(false);
    }
  }, [project?.projectId, project?.id, visible]);

  useEffect(() => {
    const pId = project?.projectId || project?.id;
    if (visible && pId) {
      setProjectDetail(null);
      setResources([]);
      setAssignedStudents([]);
      setSearchTerm('');
      fetchProjectDetail();
      setActiveTab('details');
    } else if (!visible) {
      setProjectDetail(null);
      setAssignedStudents([]);
      setSearchTerm('');
      setActiveTab('details');
    }
  }, [visible, project?.projectId, project?.id, fetchProjectDetail]);

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

  const handleViewResource = useCallback(
    async (resource) => {
      const id = resource.projectResourceId || resource.id;
      if (!id) {
        // Fallback to direct URL if ID is missing (for legacy or external links)
        window.open(resource.resourceUrl || resource.url, '_blank');
        return;
      }

      try {
        const type = String(resource.resourceType || '').toUpperCase();
        const isLink = type === '8' || type === 'LINK';

        const result = await readProjectResource(id);
        if (result.success && result.data?.resourceUrl) {
          const fullUrl = isLink
            ? result.data.resourceUrl
            : resolveResourceUrl(result.data.resourceUrl);
          window.open(fullUrl, '_blank');
        } else {
          throw new Error(result.message || 'Failed to get file URL');
        }
      } catch (err) {
        console.error('Error viewing resource:', err);
        toast.error(
          MESSAGES.ERROR_RESOURCE_ACCESS || 'Could not open file. Access denied or file removed.'
        );
        // Final fallback
        window.open(resource.resourceUrl || resource.url, '_blank');
      }
    },
    [toast]
  );

  const projectResources =
    resources.length > 0 ? resources : currentProject?.projectResources || [];
  const internalDocs = projectResources.filter((item) => {
    const type = String(item.resourceType || '').toUpperCase();
    return type !== '8' && type !== 'LINK';
  });
  const quickLinks = projectResources.filter((item) => {
    const type = String(item.resourceType || '').toUpperCase();
    return type === '8' || type === 'LINK';
  });
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
                      currentProject?.visibilityStatus === VISIBILITY_STATUS.PUBLISHED
                        ? 'blue'
                        : 'orange'
                    }
                    className="m-0 border-none font-bold text-[9px] rounded-md px-1.5 uppercase leading-none h-4 flex items-center"
                  >
                    {VISIBILITY_LABELS[currentProject?.visibilityStatus ?? VISIBILITY_STATUS.DRAFT]}
                  </Tag>
                </div>
                <div className="flex flex-col gap-0 border-l border-slate-100 pl-2 ml-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none mb-0.5">
                    {DETAIL.LABELS?.OPERATIONAL}
                  </span>
                  <Tag
                    color={
                      currentProject?.operationalStatus === OPERATIONAL_STATUS.ACTIVE
                        ? 'processing'
                        : currentProject?.operationalStatus === OPERATIONAL_STATUS.COMPLETED
                          ? 'success'
                          : 'default'
                    }
                    className="m-0 border-none font-bold text-[9px] rounded-md px-1.5 uppercase leading-none h-4 flex items-center"
                  >
                    {
                      OPERATIONAL_LABELS[
                        currentProject?.operationalStatus ?? OPERATIONAL_STATUS.UNSTARTED
                      ]
                    }
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
            label: TABS.DETAIL || 'Details',
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
            label: TABS.STUDENTS || 'Students',
            children: (
              <ProjectStudentsTab
                loading={loading}
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
                onView={handleViewResource}
              />
            ),
          },
        ]}
      />
    </Drawer>
  );
}

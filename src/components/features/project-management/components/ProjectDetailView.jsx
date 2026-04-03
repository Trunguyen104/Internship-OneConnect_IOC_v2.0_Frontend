'use client';

import {
  ArrowLeftOutlined,
  FileOutlined,
  GlobalOutlined,
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Tabs } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import Badge from '@/components/ui/badge';
import PageLayout from '@/components/ui/pagelayout';
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
import { cn } from '@/lib/cn';

import { useProjectActions } from '../hooks/useProjectActions';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { ProjectService } from '../services/project.service';
import ProjectAssignGroupModal from './ProjectAssignGroupModal';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectResourcesTab from './ProjectResourcesTab';
import ProjectStudentsTab from './ProjectStudentsTab';

export default function ProjectDetailView({ id }) {
  const router = useRouter();
  const { userInfo } = useProfile();
  const { DETAIL = {}, FORM = {} } = PROJECT_MANAGEMENT;

  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');

  // Group Assignment State
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assigningProject, setAssigningProject] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Determine if user is HR/Admin
  const isHR = useMemo(() => {
    if (!userInfo) return false;
    const r = userInfo.roleId || userInfo.RoleId || userInfo.role || userInfo.Role;
    const roleName = String(userInfo.roleName || userInfo.RoleName || r || '').toLowerCase();
    const num = Number(r);
    return (
      (num >= 1 && num <= 5) ||
      roleName.includes('hr') ||
      roleName.includes('admin') ||
      roleName.includes('enterprise')
    );
  }, [userInfo]);

  // Fetch Supporting Data (Groups)
  const { data: groups = [] } = useQuery({
    queryKey: ['groups-for-mentor'],
    queryFn: async () => {
      try {
        const res = await ProjectService.getGroupsForMentor();
        if (res?.data?.items) {
          return res.data.items.filter(
            (g) =>
              g.status === 1 ||
              g.groupStatus === 1 ||
              g.status === 'Active' ||
              g.groupStatus === 'Active'
          );
        }
        return [];
      } catch {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch project details
  const { project, loading: projectLoading, refresh } = useProjectDetail(id, null, true);

  const { handleAssignGroup } = useProjectActions({
    fetchData: refresh,
    groups,
    userInfo,
  });

  // Handle assign button click
  const handleOnAssign = (record) => {
    setAssigningProject(record);
    setSelectedGroupId(record.internshipId || record.internshipGroupId || record.groupId || null);
    setAssignModalVisible(true);
  };

  // Once project is loaded, we can get the effective groupId
  const effectiveGroupId = useMemo(() => {
    return project?.internshipId || project?.internshipGroupId || project?.groupId;
  }, [project]);

  // Re-fetch students if groupId changes
  const { students: studentsData, loading: studentsLoading } = useProjectDetail(
    id,
    effectiveGroupId,
    !!effectiveGroupId
  );

  const currentProject = project || {};
  const filteredStudents = (studentsData || []).filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewResource = (item) => {
    const url = item.resourceUrl || item.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const LINK_TYPES = ['8', 'LINK'];
  const allResources = currentProject?.projectResources || [];
  const internalDocs = allResources.filter(
    (r) => !LINK_TYPES.includes(String(r.resourceType || '').toUpperCase())
  );
  const quickLinks = allResources.filter((r) =>
    LINK_TYPES.includes(String(r.resourceType || '').toUpperCase())
  );

  const items = [
    {
      key: 'details',
      label: (
        <span className="flex items-center gap-2">
          <SolutionOutlined />
          {DETAIL.TITLE}
        </span>
      ),
      children: (
        <ProjectDetailsTab
          currentProject={currentProject}
          DETAIL={DETAIL}
          FORM={FORM}
          PROJECT_STATUS={PROJECT_STATUS}
          isHR={isHR}
          onAssign={handleOnAssign}
        />
      ),
    },
    {
      key: 'students',
      label: (
        <span className="flex items-center gap-2">
          <TeamOutlined />
          {DETAIL.STUDENTS.TITLE}
        </span>
      ),
      children: (
        <ProjectStudentsTab
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          assignedStudents={studentsData}
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
      label: (
        <span className="flex items-center gap-2">
          <FileOutlined />
          {DETAIL.SECTIONS.RESOURCES}
        </span>
      ),
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
  ];

  return (
    <PageLayout className="gap-0! pt-0! flex-none! h-fit! min-h-fit! block! overflow-visible!">
      {/* Header Card */}
      <div className="bg-white rounded-[32px] transition-all duration-500 shadow-xl shadow-slate-200/40 h-auto! min-h-fit!">
        <div className="p-8 pb-4 relative">
          <div className="mb-6">
            <Button
              type="text"
              icon={<ArrowLeftOutlined className="text-[10px]" />}
              onClick={() => router.back()}
              className="group !inline-flex items-center gap-2.5 !bg-slate-50 hover:!bg-primary hover:!text-white !text-slate-500 !font-black !text-[8px] !tracking-[0.2em] !uppercase !px-4 !py-1 !h-8 !rounded-xl !transition-all !duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {PROJECT_MANAGEMENT.COMMON.BACK_TO_LIST}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="size-20 rounded-[24px] bg-white border border-slate-100 flex items-center justify-center text-primary overflow-visible group-hover:scale-105 transition-transform duration-500 shadow-inner">
                  <FileOutlined className="text-3xl" />
                </div>
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 size-6 rounded-lg border-2 border-white shadow-sm',
                    getOperationalStatus(currentProject?.operationalStatus) ===
                      OPERATIONAL_STATUS.ACTIVE
                      ? 'bg-green-500'
                      : 'bg-slate-400'
                  )}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                    {currentProject?.projectName || DETAIL.TITLE}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        getVisibilityStatus(currentProject?.visibilityStatus) ===
                        VISIBILITY_STATUS.PUBLISHED
                          ? 'info'
                          : 'warning'
                      }
                      className="font-medium text-[3px] uppercase tracking-widest px-3 py-1"
                    >
                      {VISIBILITY_LABELS[getVisibilityStatus(currentProject?.visibilityStatus)]}
                    </Badge>
                    <Badge
                      variant={
                        getOperationalStatus(currentProject?.operationalStatus) ===
                        OPERATIONAL_STATUS.ACTIVE
                          ? 'primary'
                          : 'default'
                      }
                      className="font-bold text-[9px] uppercase tracking-widest px-3 py-1"
                    >
                      {OPERATIONAL_LABELS[getOperationalStatus(currentProject?.operationalStatus)]}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/50">
                    <GlobalOutlined className="text-[10px] text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      {currentProject?.projectCode || DETAIL.NO_CODE}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/50">
                    <HomeOutlined className="text-[10px] text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      {currentProject?.enterpriseName || PROJECT_MANAGEMENT.COMMON.ENTERPRISE}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/50">
                    <SolutionOutlined className="text-[10px] text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      {currentProject?.field || PROJECT_MANAGEMENT.TABLE.COLUMNS.FIELD}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-100 px-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items.map(({ children, ...item }) => item)}
            className="project-detail-tabs"
          />
        </div>

        <div className="p-8 pt-8 bg-slate-50/20">
          <div className="max-w-[1600px] mx-auto">
            {items.find((item) => item.key === activeTab)?.children}
          </div>
        </div>
      </div>

      <ProjectAssignGroupModal
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onConfirm={() =>
          handleAssignGroup(assigningProject, selectedGroupId, setAssignLoading, () =>
            setAssignModalVisible(false)
          )
        }
        loading={assignLoading}
        assigningProject={assigningProject}
        groups={groups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
      />
    </PageLayout>
  );
}

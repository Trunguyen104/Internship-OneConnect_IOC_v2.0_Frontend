'use client';

import { Tabs } from 'antd';
import React from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { Skeleton } from '@/components/ui/skeleton';

import { useProject } from '../hooks/useProject';
import ProjectOverview from './ProjectOverview';
import ProjectResources from './ProjectResources';

export default function ProjectPage({ projectId: manualProjectId = null }) {
  const {
    projectId,
    setProjectId,
    projectInfo,
    projectList,
    isReadOnly,
    resources,
    loading,
    uploading,
    fileList,
    setFileList,
    form,
    editForm,
    isEditModalVisible,
    setIsEditModalVisible,
    handleUpload,
    handleDelete,
    openEditModal,
    handleUpdate,
    handleDownload,
    handleView,
  } = useProject(manualProjectId);

  const showList = projectList.length > 1;

  return (
    <PageLayout className="overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center justify-between gap-4 mb-2">
        <PageLayout.Header title="Project Information" className="mb-0" />
        {showList && (
          <div className="flex-1 max-w-md">
            <Tabs
              activeKey={projectId}
              onChange={setProjectId}
              className="project-selector-tabs"
              items={projectList.map((p) => ({
                key: p.projectId || p.id,
                label: p.projectName,
              }))}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-8 pb-8">
        <PageLayout.Card className="flex-none h-fit transition-all duration-500 hover:shadow-md">
          {loading && !projectInfo ? (
            <div className="space-y-6 py-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-3 gap-6">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            </div>
          ) : (
            <ProjectOverview project={projectInfo} />
          )}
        </PageLayout.Card>

        <PageLayout.Card className="flex min-h-0 flex-1 flex-col transition-all duration-500">
          <ProjectResources
            resources={resources}
            loading={loading}
            uploading={uploading}
            fileList={fileList}
            setFileList={setFileList}
            form={form}
            onUpload={handleUpload}
            onDelete={handleDelete}
            openEditModal={openEditModal}
            isEditModalVisible={isEditModalVisible}
            setIsEditModalVisible={setIsEditModalVisible}
            onUpdate={handleUpdate}
            editForm={editForm}
            onDownload={handleDownload}
            onView={handleView}
            isReadOnly={isReadOnly}
          />
        </PageLayout.Card>
      </div>
    </PageLayout>
  );
}

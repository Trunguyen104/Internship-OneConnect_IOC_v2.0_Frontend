'use client';

import React from 'react';
import { Spin as AntdSpin } from 'antd';
import { useProject } from '../hooks/useProject';
import ProjectOverview from './ProjectOverview';
import ProjectResources from './ProjectResources';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/Card';

export default function ProjectPage() {
  const {
    projectId,
    projectInfo,
    resources,
    fileList,
    setFileList,
    loading,
    uploading,
    form,
    isEditModalVisible,
    setIsEditModalVisible,
    editForm,
    handleUpload,
    handleDelete,
    openEditModal,
    handleUpdate,
    handleDownload,
    handleView,
  } = useProject();

  return (
    <div className={'animate-in fade-in mx-auto w-full max-w-7xl space-y-6 duration-700'}>
      <StudentPageHeader title={'Project Information'} />
      <AntdSpin spinning={loading && !projectId} size={'large'}>
        <div className={'flex flex-col gap-6'}>
          <Card>
            <ProjectOverview project={projectInfo} />
          </Card>

          <Card>
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
            />
          </Card>
        </div>
      </AntdSpin>
    </div>
  );
}

'use client';

import React from 'react';
import { Spin } from 'antd';
import { useProject } from '../hooks/useProject';
import ProjectOverview from './ProjectOverview';
import ProjectResources from './ProjectResources';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { PROJECT_UI } from '@/constants/project/uiText';

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
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader
        title={PROJECT_UI.TITLE.PROJECT_INFO}
        description='Xem thông tin chi tiết và tài liệu hướng dẫn của dự án'
      />

      <div className='mx-auto w-full max-w-[1440px] flex-1'>
        <Spin spinning={loading && !projectId} size='large' tip='Đang tải thông tin dự án...'>
          <div className='flex flex-col gap-6 pb-8'>
            <ProjectOverview project={projectInfo} />

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
          </div>
        </Spin>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Spin as AntdSpin, Space as AntdSpace } from 'antd';
import { useProject } from './hooks/useProject';
import ProjectOverview from './components/ProjectOverview';
import ProjectResources from './components/ProjectResources';

// const { Title, Text } = AntdTypography;

export default function ProjectPage() {
  const {
    projectId,
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
  } = useProject();

  return (
    <div
      style={{ paddingBottom: 40, maxWidth: 1200, margin: '0 auto', width: '100%' }}
      className='animate-in fade-in duration-700'
    >
      <AntdSpace direction='vertical' size='large' style={{ width: '100%' }}>
        <h1 className='text-2xl font-bold text-slate-900'>Thông tin dự án</h1>

        <AntdSpin spinning={loading && !projectId} size='large'>
          <ProjectOverview />

          <div style={{ marginTop: 24 }}>
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
            />
          </div>
        </AntdSpin>
      </AntdSpace>
    </div>
  );
}


'use client';

import { Skeleton } from 'antd';
import { useProject } from '../hooks/useProject';
import ProjectOverview from './ProjectOverview';
import ProjectResources from './ProjectResources';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/Card';

export default function ProjectPage({ projectId = null }) {
  const {
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
  } = useProject(projectId);

  return (
    <div className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto pr-1 duration-700'>
      <StudentPageHeader title='Project Information' />

      <div className='flex flex-1 flex-col gap-6'>
        <Card className='shrink-0 !p-4 sm:!p-8'>
          {loading && !projectInfo ? (
            <div className='py-4'>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : (
            <ProjectOverview project={projectInfo} />
          )}
        </Card>

        <Card className='flex min-h-0 flex-1 flex-col !p-4 sm:!p-8'>
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
    </div>
  );
}

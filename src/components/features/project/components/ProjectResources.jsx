'use client';

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react';

import { EmptyState } from '@/components/ui/atoms';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import SkeletonTable from '@/components/ui/skeletontable';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { PROJECT_UI } from '@/constants/project/uiText';

import ProjectResourceEditModal from './ProjectResourceEditModal';
import ProjectResourceUpload from './ProjectResourceUpload';

export default function ProjectResources({
  resources,
  loading,
  uploading,
  fileList,
  setFileList,
  form,
  onUpload,
  onDelete,
  openEditModal,
  isEditModalVisible,
  setIsEditModalVisible,
  onUpdate,
  editForm,
  onDownload,
  onView,
  isReadOnly = false,
}) {
  const [isUploadModalVisible, setIsUploadModalVisible] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenUpload = () => {
    form.resetFields();
    setFileList([]);
    setIsUploadModalVisible(true);
  };

  const handleCloseUpload = () => {
    setIsUploadModalVisible(false);
  };

  const handleUploadFinish = async (values) => {
    const success = await onUpload(values);
    if (success) {
      handleCloseUpload();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-900 m-0 text-lg font-black tracking-tight">
            {PROJECT_UI.TITLE.RESOURCE_LIST}
          </h3>
          <Badge variant="info" size="sm" className="px-3 py-1 font-black shadow-sm">
            {resources.length} {PROJECT_UI.LABEL_FILES || 'FILES'}
          </Badge>
        </div>
        {!isReadOnly && (
          <Button
            onClick={handleOpenUpload}
            className="rounded-2xl px-6 font-black"
            icon={<PlusCircleOutlined />}
          >
            {PROJECT_UI.BUTTON.ADD_RESOURCE || 'Add Resource'}
          </Button>
        )}
      </div>

      <div className="custom-scrollbar max-h-[400px] w-full overflow-x-hidden overflow-y-auto pr-2 pb-4">
        <div className="flex min-w-[500px] flex-col gap-3">
          {loading && resources.length === 0 ? (
            <SkeletonTable rows={4} columns={2} />
          ) : resources.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <EmptyState description={PROJECT_UI.EMPTY.NO_RESOURCE} />
            </div>
          ) : (
            resources.map((item) => (
              <div
                key={item.projectResourceId || item.id}
                className="group bg-white border-gray-100 hover:border-primary/20 hover:bg-gray-50 flex items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="bg-primary-surface text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <FileTextOutlined className="text-2xl" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="text-gray-900 block truncate text-[15px] font-black tracking-tight"
                      title={item.resourceName}
                    >
                      {item.resourceName || PROJECT_UI.VALUES.UNTITLED || 'Untitled Resource'}
                    </span>
                    <span className="text-gray-400 mt-1 text-[10px] font-black tracking-widest uppercase">
                      {RESOURCE_TYPES.find(
                        (t) => t.value === item.resourceType || t.key === item.resourceType
                      )?.label || PROJECT_UI.VALUES.OTHER}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<EyeOutlined />}
                    onClick={() => onView(item)}
                    className="text-gray-400 hover:text-primary"
                    title={PROJECT_UI.BUTTON.VIEW}
                  />
                  {Number(item.resourceType) !== 8 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<DownloadOutlined />}
                      onClick={() => onDownload(item)}
                      className="text-gray-400 hover:text-primary"
                      title={PROJECT_UI.BUTTON.DOWNLOAD}
                    />
                  ) : null}
                  {!isReadOnly && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(item)}
                        className="text-gray-400 hover:text-primary"
                        title={PROJECT_UI.BUTTON.EDIT}
                      />
                      <Button
                        variant="danger-ghost"
                        size="sm"
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          showDeleteConfirm({
                            title: PROJECT_UI.CONFIRM.DELETE_TITLE || 'Delete Resource',
                            content: PROJECT_UI.CONFIRM.DELETE_RESOURCE,
                            onOk: () => onDelete(item.projectResourceId),
                          })
                        }
                        className="text-gray-300 hover:text-danger"
                        title={PROJECT_UI.BUTTON.DELETE}
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!mounted ? null : (
        <>
          <Modal
            title={
              <span className="text-lg font-black tracking-tight">
                {PROJECT_UI.TITLE.ADD_RESOURCE}
              </span>
            }
            open={isUploadModalVisible}
            onCancel={handleCloseUpload}
            footer={null}
            width={520}
            centered
            className="modern-modal"
          >
            <ProjectResourceUpload
              form={form}
              onUpload={handleUploadFinish}
              uploading={uploading}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Modal>

          <ProjectResourceEditModal
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            onUpdate={onUpdate}
            form={editForm}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

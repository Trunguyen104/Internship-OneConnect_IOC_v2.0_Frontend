'use client';

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Empty, Modal, Tag, Typography } from 'antd';
import React from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { PROJECT_UI } from '@/constants/project/uiText';

import ProjectResourceEditModal from './ProjectResourceEditModal';
import ProjectResourceUpload from './ProjectResourceUpload';

const { Title, Text } = Typography;

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
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Title level={5} className="m-0 font-bold!">
              {PROJECT_UI.TITLE.RESOURCE_LIST}
            </Title>
            <Tag className="bg-info-surface text-info rounded-full border-none px-3 text-[10px] font-bold">
              {resources.length} {PROJECT_UI.LABEL_FILES || 'FILES'}
            </Tag>
          </div>
          <Button
            type="primary"
            onClick={handleOpenUpload}
            className="flex items-center gap-2 rounded-full"
          >
            <span>{PROJECT_UI.BUTTON.ADD_RESOURCE || 'Add Resource'}</span>
            <PlusCircleOutlined className="text-base" />
          </Button>
        </div>

        <div className="custom-scrollbar max-h-[350px] w-full overflow-x-hidden overflow-y-auto pr-2 pb-4">
          <div className="flex min-w-[500px] flex-col gap-2">
            {loading && resources.length === 0 ? (
              <SkeletonTable rows={4} columns={2} />
            ) : resources.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <Empty description={PROJECT_UI.EMPTY.NO_RESOURCE} />
              </div>
            ) : (
              resources.map((item) => (
                <div
                  key={item.projectResourceId || item.id}
                  className="group border-border/50 hover:bg-bg-surface flex items-center justify-between rounded-xl border px-4 py-3 transition-all"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bg-info-surface text-info flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                      <FileTextOutlined className="text-xl" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Text
                        strong
                        className="text-text block truncate text-sm"
                        title={item.resourceName}
                      >
                        {item.resourceName || PROJECT_UI.VALUES.UNTITLED || 'Untitled Resource'}
                      </Text>
                      <Text type="secondary" className="mt-1 text-[11px] leading-none font-medium">
                        {RESOURCE_TYPES.find(
                          (t) => t.value === item.resourceType || t.key === item.resourceType
                        )?.label || PROJECT_UI.VALUES.OTHER}
                      </Text>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => onView(item)}
                      className="text-muted hover:text-info transition-colors"
                      title={PROJECT_UI.BUTTON.VIEW}
                      aria-label={PROJECT_UI.BUTTON.VIEW}
                    />
                    {Number(item.resourceType) !== 8 ? (
                      <Button
                        type="text"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => onDownload(item)}
                        className="text-muted hover:text-info transition-colors"
                        title={PROJECT_UI.BUTTON.DOWNLOAD}
                        aria-label={PROJECT_UI.BUTTON.DOWNLOAD}
                      />
                    ) : null}
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(item)}
                      className="text-muted hover:text-text transition-colors"
                      title={PROJECT_UI.BUTTON.EDIT}
                      aria-label={PROJECT_UI.BUTTON.EDIT}
                    />
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        showDeleteConfirm({
                          title: PROJECT_UI.CONFIRM.DELETE_TITLE || 'Delete Resource',
                          content: PROJECT_UI.CONFIRM.DELETE_RESOURCE,
                          onOk: () => onDelete(item.projectResourceId),
                        })
                      }
                      className="text-muted/50 hover:text-danger transition-colors"
                      title={PROJECT_UI.BUTTON.DELETE}
                      aria-label={PROJECT_UI.BUTTON.DELETE}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {!mounted ? null : (
        <>
          <Modal
            title={PROJECT_UI.TITLE.ADD_RESOURCE}
            open={isUploadModalVisible}
            onCancel={handleCloseUpload}
            footer={null}
            destroyOnHidden
            width={480}
            centered
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

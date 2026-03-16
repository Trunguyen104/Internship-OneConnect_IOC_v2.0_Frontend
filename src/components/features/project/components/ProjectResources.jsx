'use client';

import React from 'react';
import { Typography, Row, Col, Button, Tag, Empty } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import ProjectResourceUpload from './ProjectResourceUpload';
import ProjectResourceEditModal from './ProjectResourceEditModal';
import { resolveResourceUrl } from '@/utils/resolveUrl';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

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
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto pr-2'>
        <div className='space-y-6'>
          <Row gutter={[24, 16]}>
            <Col xs={24} lg={9} xl={8}>
              <div className='lg:sticky lg:top-0'>
                <ProjectResourceUpload
                  form={form}
                  onUpload={onUpload}
                  uploading={uploading}
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </div>
            </Col>

            <Col xs={24} lg={15} xl={16}>
              <div className='mb-6 flex items-center gap-3'>
                <Title level={5} className='!m-0'>
                  {PROJECT_UI.TITLE.RESOURCE_LIST}
                </Title>
                <Tag className='bg-info-surface text-info rounded-full border-none px-3 text-[10px] font-bold'>
                  {resources.length} {PROJECT_UI.LABEL_FILES || 'FILES'}
                </Tag>
              </div>

              <div className='w-full overflow-x-auto pb-4'>
                <div className='flex min-w-[500px] flex-col gap-2'>
                  {loading && resources.length === 0 ? (
                    <div className='text-muted py-8 text-center'>
                      {PROJECT_UI.LOADING || 'Loading…'}
                    </div>
                  ) : resources.length === 0 ? (
                    <div className='flex flex-1 items-center justify-center py-8'>
                      <Empty description={PROJECT_UI.EMPTY.NO_RESOURCE} />
                    </div>
                  ) : (
                    resources.map((item) => (
                      <div
                        key={item.projectResourceId || item.id}
                        className='group border-border/50 hover:bg-bg-surface flex items-center justify-between rounded-xl border px-4 py-3 transition-all'
                      >
                        <div className='flex min-w-0 flex-1 items-center gap-3'>
                          <div className='bg-info-surface text-info flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110'>
                            <FileTextOutlined className='text-xl' />
                          </div>
                          <div className='flex min-w-0 flex-1 flex-col'>
                            <Text
                              strong
                              className='text-text block truncate text-sm'
                              title={item.resourceName}
                            >
                              {item.resourceName ||
                                PROJECT_UI.VALUES.UNTITLED ||
                                'Untitled Resource'}
                            </Text>
                            <Text
                              type='secondary'
                              className='mt-1 text-[11px] leading-none font-medium'
                            >
                              {RESOURCE_TYPES.find(
                                (t) => t.value === item.resourceType || t.key === item.resourceType,
                              )?.label || 'Other'}
                            </Text>
                          </div>
                        </div>

                        <div className='flex shrink-0 items-center gap-1'>
                          <Button
                            type='text'
                            size='small'
                            icon={<EyeOutlined />}
                            onClick={() => onView(item)}
                            className='text-muted hover:text-info transition-colors'
                            title={PROJECT_UI.BUTTON.VIEW}
                            aria-label={PROJECT_UI.BUTTON.VIEW}
                          />
                          <Button
                            type='text'
                            size='small'
                            icon={<DownloadOutlined />}
                            onClick={() => onDownload(item)}
                            className='text-muted hover:text-info transition-colors'
                            title={PROJECT_UI.BUTTON.DOWNLOAD}
                            aria-label={PROJECT_UI.BUTTON.DOWNLOAD}
                          />
                          <Button
                            type='text'
                            size='small'
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(item)}
                            className='text-muted hover:text-text transition-colors'
                            title={PROJECT_UI.BUTTON.EDIT}
                            aria-label={PROJECT_UI.BUTTON.EDIT}
                          />
                          <Button
                            type='text'
                            size='small'
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              showDeleteConfirm({
                                title: PROJECT_UI.CONFIRM.DELETE_TITLE || 'Delete Resource',
                                content: PROJECT_UI.CONFIRM.DELETE_RESOURCE,
                                onOk: () => onDelete(item.projectResourceId),
                              })
                            }
                            className='text-muted/50 hover:text-danger transition-colors'
                            title={PROJECT_UI.BUTTON.DELETE}
                            aria-label={PROJECT_UI.BUTTON.DELETE}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <ProjectResourceEditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onUpdate={onUpdate}
        form={editForm}
        loading={loading}
      />
    </div>
  );
}

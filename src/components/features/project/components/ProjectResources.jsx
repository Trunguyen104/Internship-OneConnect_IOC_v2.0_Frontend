'use client';

import React, { memo } from 'react';
import { Typography, Row, Col, List, Button, Tag, Divider, Avatar } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  CloudUploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import ProjectResourceUpload from './ProjectResourceUpload';
import ProjectResourceEditModal from './ProjectResourceEditModal';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import Card from '@/components/ui/Card';

const { Title, Text } = Typography;

const ProjectResources = memo(function ProjectResources({
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
    <div className='flex flex-col gap-6 pt-4'>
      <Row gutter={[24, 24]}>
        {/* Left Column: Upload */}
        <Col xs={24} lg={9} xl={8}>
          <div className='sticky top-6'>
            <Card className='bg-surface border-border overflow-hidden rounded-2xl border p-0 shadow-sm'>
              <div className='bg-muted/5 border-border flex items-center gap-2 border-b px-6 py-4'>
                <CloudUploadOutlined className='text-primary' />
                <Text className='text-text text-xs font-bold tracking-widest uppercase'>
                  Tải lên tài liệu
                </Text>
              </div>
              <div className='p-6'>
                <ProjectResourceUpload
                  form={form}
                  onUpload={onUpload}
                  uploading={uploading}
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </div>
            </Card>
          </div>
        </Col>

        {/* Right Column: List */}
        <Col xs={24} lg={15} xl={16}>
          <Card className='bg-surface border-border overflow-hidden rounded-2xl border p-0 shadow-sm'>
            <div className='bg-muted/5 border-border flex items-center justify-between border-b px-6 py-4'>
              <div className='flex items-center gap-2'>
                <FolderOpenOutlined className='text-primary' />
                <Text className='text-text text-xs font-bold tracking-widest uppercase'>
                  {PROJECT_UI.TITLE.RESOURCE_LIST}
                </Text>
              </div>
              <Tag
                color='processing'
                variant='filled'
                className='m-0 rounded-full px-4 py-0.5 text-[10px] font-black tracking-widest uppercase'
              >
                {resources.length} Tài liệu
              </Tag>
            </div>

            <div className='premium-scrollbar max-h-[600px] overflow-y-auto px-2 py-4 lg:max-h-[65vh]'>
              <List
                itemLayout='horizontal'
                dataSource={resources}
                loading={loading}
                locale={{
                  emptyText: (
                    <div className='py-20 text-center'>
                      <SearchOutlined className='text-muted mb-4 text-4xl opacity-20' />
                      <Text className='text-muted block text-sm italic'>
                        {PROJECT_UI.EMPTY.NO_RESOURCE}
                      </Text>
                    </div>
                  ),
                }}
                renderItem={(item) => (
                  <List.Item
                    className='group hover:bg-muted/5 mb-2 rounded-2xl border-none p-4 transition-all duration-300'
                    actions={[
                      <div key='actions' className='flex gap-1'>
                        <Tooltip title='Xem chi tiết'>
                          <Button
                            type='text'
                            icon={<EyeOutlined />}
                            onClick={() => onView(item)}
                            className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                        <Tooltip title='Tải xuống'>
                          <Button
                            type='text'
                            icon={<DownloadOutlined />}
                            onClick={() => onDownload(item)}
                            className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                        <Tooltip title='Sửa thông tin'>
                          <Button
                            type='text'
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(item)}
                            className='hover:bg-primary/10 hover:text-primary text-muted flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                        <Tooltip title='Xóa tài liệu'>
                          <Button
                            type='text'
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              showDeleteConfirm({
                                title: 'Xóa tài liệu',
                                content: PROJECT_UI.CONFIRM.DELETE_RESOURCE,
                                onOk: () => onDelete(item.projectResourceId),
                              })
                            }
                            className='hover:bg-danger/10 flex size-9 items-center justify-center rounded-xl p-0 transition-all'
                          />
                        </Tooltip>
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className='bg-primary/10 flex size-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110'>
                          <FileTextOutlined className='text-primary text-2xl' />
                        </div>
                      }
                      title={
                        <Text strong className='text-text block truncate text-[15px]'>
                          {item.resourceName || 'Tài liệu không tên'}
                        </Text>
                      }
                      description={
                        <div className='mt-1 flex items-center gap-2'>
                          <Tag className='m-0 border-none bg-slate-100 text-[10px] font-bold text-slate-500 uppercase'>
                            {RESOURCE_TYPES.find(
                              (t) => t.value === item.resourceType || t.key === item.resourceType,
                            )?.label || 'Khác'}
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <ProjectResourceEditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onUpdate={onUpdate}
        form={editForm}
        loading={loading}
      />
    </div>
  );
});

import { Tooltip } from 'antd';

export default ProjectResources;

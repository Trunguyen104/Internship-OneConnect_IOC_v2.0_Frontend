'use client';

import React from 'react';
import { Typography, Row, Col, List, Button, Tag } from 'antd';
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
    <div className={'space-y-6'}>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={9} xl={8}>
          <div className={'sticky top-6'}>
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
          <div className={'mb-6 flex items-center gap-3'}>
            <Title level={5} className={'!m-0'}>
              {PROJECT_UI.TITLE.RESOURCE_LIST}
            </Title>
            <Tag
              color={'geekblue'}
              className={
                'rounded-full border-none bg-blue-50 px-3 text-[10px] font-bold text-blue-600'
              }
            >
              {resources.length} {'FILES'}
            </Tag>
          </div>

          <div className={'custom-scrollbar max-h-[450px] overflow-y-auto pr-2 lg:max-h-[50vh]'}>
            <List
              itemLayout={'horizontal'}
              dataSource={resources}
              loading={loading}
              locale={{ emptyText: PROJECT_UI.EMPTY.NO_RESOURCE }}
              renderItem={(item) => (
                <List.Item
                  className={
                    'group mb-2 rounded-xl border-slate-100 px-4 transition-all hover:bg-slate-50/80'
                  }
                  actions={[
                    <Button
                      key={'view'}
                      type={'text'}
                      size={'small'}
                      icon={<EyeOutlined />}
                      onClick={() => onView(item)}
                      className={'hover:text-primary text-slate-400 transition-colors'}
                      title={PROJECT_UI.BUTTON.VIEW}
                    />,
                    <Button
                      key={'download'}
                      type={'text'}
                      size={'small'}
                      icon={<DownloadOutlined />}
                      onClick={() => onDownload(item)}
                      className={'text-slate-400 transition-colors hover:text-blue-600'}
                      title={PROJECT_UI.BUTTON.DOWNLOAD}
                    />,
                    <Button
                      key={'edit'}
                      type={'text'}
                      size={'small'}
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(item)}
                      className={'text-slate-400 transition-colors hover:text-slate-800'}
                      title={PROJECT_UI.BUTTON.EDIT}
                    />,
                    <Button
                      key={'delete'}
                      type={'text'}
                      size={'small'}
                      danger
                      icon={<DeleteOutlined />}
                      className={'text-slate-300 transition-colors hover:text-red-500'}
                      title={PROJECT_UI.BUTTON.DELETE}
                      onClick={() =>
                        showDeleteConfirm({
                          title: 'Delete Resource',
                          content: PROJECT_UI.CONFIRM.DELETE_RESOURCE,
                          onOk: () => onDelete(item.projectResourceId),
                        })
                      }
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className={
                          'bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110'
                        }
                      >
                        <FileTextOutlined className={'text-xl'} />
                      </div>
                    }
                    title={
                      <Text
                        strong
                        className={
                          'block max-w-[200px] truncate text-sm text-slate-800 sm:max-w-[300px]'
                        }
                        title={item.resourceName}
                      >
                        {item.resourceName || 'Untitled Resource'}
                      </Text>
                    }
                    description={
                      <Text type={'secondary'} className={'text-[11px] font-medium'}>
                        {RESOURCE_TYPES.find(
                          (t) => t.value === item.resourceType || t.key === item.resourceType,
                        )?.label || 'Other'}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
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
}

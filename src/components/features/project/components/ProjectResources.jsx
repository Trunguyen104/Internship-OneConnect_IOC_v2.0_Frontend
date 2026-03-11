'use client';

import React from 'react';
import { Card, Typography, Row, Col, List, Button, Popconfirm, Tag, Space } from 'antd';
import {
  FileTextOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import ProjectResourceUpload from './ProjectResourceUpload';
import ProjectResourceEditModal from './ProjectResourceEditModal';

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
}) {
  return (
    <Card
      variant='borderless'
      title={
        <Title level={4} style={{ margin: 0 }}>
          Tài liệu dự án
        </Title>
      }
      className='shadow-sm'
      style={{ borderRadius: 12 }}
    >
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={9} xl={8}>
          <ProjectResourceUpload
            form={form}
            onUpload={onUpload}
            uploading={uploading}
            fileList={fileList}
            setFileList={setFileList}
          />
        </Col>

        <Col xs={24} lg={15} xl={16}>
          <Space style={{ marginBottom: 16 }} size='small' align='center'>
            <Title level={5} style={{ margin: 0 }}>
              {PROJECT_UI.TITLE.RESOURCE_LIST}
            </Title>
            <Tag color='geekblue'>{resources.length} files</Tag>
          </Space>

          <List
            itemLayout='horizontal'
            dataSource={resources}
            loading={loading}
            locale={{ emptyText: PROJECT_UI.EMPTY.NO_RESOURCE }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key='download'
                    type='link'
                    icon={<DownloadOutlined />}
                    href={item.resourceUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {PROJECT_UI.BUTTON.DOWNLOAD}
                  </Button>,
                  <Button
                    key='edit'
                    type='link'
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(item)}
                  >
                    {PROJECT_UI.BUTTON.EDIT}
                  </Button>,
                  <Popconfirm
                    key='delete'
                    title={PROJECT_UI.CONFIRM.DELETE_RESOURCE}
                    onConfirm={() => onDelete(item.projectResourceId)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button type='link' danger icon={<DeleteOutlined />}>
                      {PROJECT_UI.BUTTON.DELETE}
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <FileTextOutlined
                      style={{
                        fontSize: 28,
                        color: '#1890ff',
                        marginTop: 4,
                      }}
                    />
                  }
                  title={<Text strong>{item.resourceName || 'Untitled Resource'}</Text>}
                  description={`Type: ${RESOURCE_TYPES.find((t) => t.value === item.resourceType)?.label || 'Other'}`}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <ProjectResourceEditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onUpdate={onUpdate}
        form={editForm}
        loading={loading}
      />
    </Card>
  );
}


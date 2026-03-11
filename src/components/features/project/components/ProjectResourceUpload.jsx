'use client';

import React from 'react';
import { Card, Form, Input, Select, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';

export default function ProjectResourceUpload({
  form,
  onUpload,
  uploading,
  fileList,
  setFileList,
}) {
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const allowedExtensions = [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'png',
        'jpg',
        'jpeg',
        'zip',
        'rar',
        'mp4',
      ];
      const currentExt = file.name.split('.').pop().toLowerCase();
      const isAllowed = allowedExtensions.includes(currentExt);
      if (!isAllowed) {
        message.error(PROJECT_MESSAGES.ERROR.INVALID_FILE_TYPE);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        message.error(PROJECT_MESSAGES.ERROR.FILE_TOO_LARGE);
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Card
      type='inner'
      title={PROJECT_UI.TITLE.ADD_RESOURCE}
      variant='borderless'
      style={{ background: '#fafafa' }}
    >
      <Form form={form} layout='vertical' onFinish={onUpload}>
        <Form.Item
          label={PROJECT_UI.FORM.RESOURCE_NAME}
          name='resourceName'
          tooltip='Nếu để trống sẽ sử dụng tên file đính kèm'
        >
          <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
        </Form.Item>

        <Form.Item
          label={PROJECT_UI.FORM.RESOURCE_TYPE}
          name='resourceType'
          initialValue={1}
          required
        >
          <Select options={RESOURCE_TYPES} />
        </Form.Item>

        <Form.Item label={PROJECT_UI.FORM.ATTACH_FILE} required>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{PROJECT_UI.BUTTON.SELECT_FILE}</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type='primary'
            htmlType='submit'
            loading={uploading}
            disabled={fileList.length === 0}
            block
          >
            {PROJECT_UI.BUTTON.UPLOAD}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}


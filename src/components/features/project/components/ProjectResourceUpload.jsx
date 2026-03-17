'use client';

import React from 'react';
import { Form, Input, Select, Button, Upload } from 'antd';
import { useToast } from '@/providers/ToastProvider';
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
  const toast = useToast();
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const allowedExtensions = ['pdf', 'docx', 'pptx', 'png', 'jpg', 'jpeg', 'zip', 'rar'];
      const currentExt = file.name.split('.').pop().toLowerCase();
      const isAllowed = allowedExtensions.includes(currentExt);
      if (!isAllowed) {
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_FILE_TYPE);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 <= 30;
      if (!isLt10M) {
        toast.error(PROJECT_MESSAGES.ERROR.FILE_TOO_LARGE);
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: '.pdf,.docx,.pptx,.png,.jpg,.jpeg,.zip,.rar',
  };

  return (
    <div className='pt-2'>
      <Form form={form} layout={'vertical'} onFinish={onUpload} className={'space-y-4'}>
        <Form.Item
          label={PROJECT_UI.FORM.RESOURCE_NAME}
          name={'resourceName'}
          tooltip={{ title: PROJECT_UI.TOOLTIP.RESOURCE_NAME }}
        >
          <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
        </Form.Item>

        <Form.Item
          label={PROJECT_UI.FORM.RESOURCE_TYPE}
          name={'resourceType'}
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
            type={'primary'}
            htmlType={'submit'}
            loading={uploading}
            disabled={fileList.length === 0}
            block
          >
            {PROJECT_UI.BUTTON.UPLOAD}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

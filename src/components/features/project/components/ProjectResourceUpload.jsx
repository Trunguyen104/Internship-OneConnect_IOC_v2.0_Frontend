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
  const selectedType = Form.useWatch('resourceType', form);
  const isLinkType = selectedType === 8;

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
          rules={[
            {
              required: true,
              message: PROJECT_MESSAGES.ERROR.RESOURCE_NAME_REQUIRED || 'Resource name is required',
            },
            { max: 100, message: PROJECT_MESSAGES.ERROR.MAX_LENGTH || 'Max length exceeded' },
          ]}
        >
          <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
        </Form.Item>

        <Form.Item
          label={PROJECT_UI.FORM.RESOURCE_TYPE}
          name={'resourceType'}
          initialValue={1}
          required
          rules={[
            {
              required: true,
              message: PROJECT_MESSAGES.ERROR.RESOURCE_TYPE_REQUIRED || 'Resource type is required',
            },
          ]}
        >
          <Select options={RESOURCE_TYPES} />
        </Form.Item>

        {isLinkType ? (
          <Form.Item
            label='External URL'
            name='externalUrl'
            rules={[
              { required: true, message: 'Please enter link URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <Input placeholder='https://docs.google.com/... or https://figma.com/...' />
          </Form.Item>
        ) : null}

        {!isLinkType ? (
          <Form.Item label={PROJECT_UI.FORM.ATTACH_FILE} required>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>{PROJECT_UI.BUTTON.SELECT_FILE}</Button>
            </Upload>
          </Form.Item>
        ) : null}

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type={'primary'}
            htmlType={'submit'}
            loading={uploading}
            disabled={!isLinkType && fileList.length === 0}
            block
          >
            {PROJECT_UI.BUTTON.UPLOAD}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

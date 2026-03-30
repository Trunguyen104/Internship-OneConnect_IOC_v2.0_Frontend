'use client';

import { UploadOutlined } from '@ant-design/icons';
import { Form, Input, Select, Upload } from 'antd';
import React from 'react';

import { Button } from '@/components/ui/button';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { PROJECT_UI } from '@/constants/project/uiText';
import { useToast } from '@/providers/ToastProvider';

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
    <div className="animate-in fade-in py-4 duration-500">
      <Form form={form} layout="vertical" onFinish={onUpload} className="space-y-6">
        <Form.Item
          label={
            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
              {PROJECT_UI.FORM.RESOURCE_NAME}
            </span>
          }
          name="resourceName"
          rules={[
            {
              required: true,
              message: PROJECT_MESSAGES.ERROR.RESOURCE_NAME_REQUIRED,
            },
            { max: 100, message: PROJECT_MESSAGES.ERROR.MAX_LENGTH },
          ]}
        >
          <Input
            placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME}
            className="h-11 rounded-xl border-gray-100 font-bold"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
              {PROJECT_UI.FORM.RESOURCE_TYPE}
            </span>
          }
          name="resourceType"
          initialValue={1}
          required
          rules={[
            {
              required: true,
              message: PROJECT_MESSAGES.ERROR.RESOURCE_TYPE_REQUIRED,
            },
          ]}
        >
          <Select options={RESOURCE_TYPES} className="h-11 modern-select" />
        </Form.Item>

        {isLinkType ? (
          <Form.Item
            label={
              <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
                {PROJECT_UI.FORM.EXTERNAL_URL}
              </span>
            }
            name="externalUrl"
            rules={[
              { required: true, message: PROJECT_MESSAGES.ERROR.ENTER_LINK },
              { type: 'url', message: PROJECT_MESSAGES.ERROR.INVALID_URL },
            ]}
          >
            <Input
              placeholder={PROJECT_UI.PLACEHOLDER.URL_PLACEHOLDER}
              className="h-11 rounded-xl border-gray-100 font-bold"
            />
          </Form.Item>
        ) : null}

        {!isLinkType ? (
          <Form.Item
            label={
              <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
                {PROJECT_UI.FORM.ATTACH_FILE}
              </span>
            }
            required
          >
            <Upload {...uploadProps} className="w-full">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-dashed border-gray-200 py-6"
                icon={<UploadOutlined />}
              >
                {fileList.length > 0 ? fileList[0].name : PROJECT_UI.BUTTON.SELECT_FILE}
              </Button>
            </Upload>
          </Form.Item>
        ) : null}

        <div className="pt-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-2xl font-black"
            loading={uploading}
            disabled={!isLinkType && fileList.length === 0}
          >
            {PROJECT_UI.BUTTON.UPLOAD}
          </Button>
        </div>
      </Form>
    </div>
  );
}

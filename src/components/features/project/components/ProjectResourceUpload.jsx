'use client';

import React, { memo } from 'react';
import { Form, Input, Select, Button, Upload, Typography, Divider } from 'antd';
import { useToast } from '@/providers/ToastProvider';
import {
  UploadOutlined,
  InfoCircleOutlined,
  TagOutlined,
  FileAddOutlined,
} from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';

const { Text } = Typography;

const ProjectResourceUpload = memo(function ProjectResourceUpload({
  form,
  onUpload,
  uploading,
  fileList,
  setFileList,
}) {
  const toast = useToast();
  const { FORM, BUTTON, PLACEHOLDER } = PROJECT_UI;

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
        toast.error(PROJECT_MESSAGES.ERROR.INVALID_FILE_TYPE);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 <= 10;
      if (!isLt10M) {
        toast.error(PROJECT_MESSAGES.ERROR.FILE_TOO_LARGE);
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip,.rar,.mp4',
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onUpload}
      className='space-y-5'
      autoComplete='off'
    >
      <Form.Item
        label={<span className='text-text font-semibold'>{FORM.RESOURCE_NAME}</span>}
        name='resourceName'
        tooltip={{
          title: 'Nếu bỏ trống, tên tệp tin sẽ được sử dụng làm tên tài liệu',
          icon: <InfoCircleOutlined className='text-muted' />,
        }}
      >
        <Input
          prefix={<FileAddOutlined className='text-muted' />}
          placeholder={PLACEHOLDER.RESOURCE_NAME}
          className='bg-surface border-border hover:border-primary h-11 rounded-xl transition-all'
        />
      </Form.Item>

      <Form.Item
        label={<span className='text-text font-semibold'>{FORM.RESOURCE_TYPE}</span>}
        name='resourceType'
        initialValue={1}
        rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu' }]}
      >
        <Select
          options={RESOURCE_TYPES}
          suffixIcon={<TagOutlined className='text-muted' />}
          className='h-11'
        />
      </Form.Item>

      <Form.Item
        label={<span className='text-text font-semibold'>{FORM.ATTACH_FILE}</span>}
        required
        className='mb-6'
      >
        <Upload {...uploadProps} className='premium-upload'>
          <Button
            icon={<UploadOutlined />}
            className='border-border text-muted hover:text-primary hover:border-primary h-11 w-full rounded-xl border-dashed bg-slate-50 font-medium transition-all hover:bg-white'
          >
            {BUTTON.SELECT_FILE}
          </Button>
        </Upload>
        <div className='mt-2'>
          <Text className='text-muted text-[10px] leading-tight'>
            * Hỗ trợ: PDF, Word, Excel, PowerPoint, Image, Zip, MP4. Tối đa 10MB.
          </Text>
        </div>
      </Form.Item>

      <Button
        type='primary'
        htmlType='submit'
        loading={uploading}
        disabled={fileList.length === 0}
        block
        className='bg-primary h-12 rounded-xl border-none font-bold shadow-md transition-all hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400'
      >
        {BUTTON.UPLOAD}
      </Button>
    </Form>
  );
});

export default ProjectResourceUpload;

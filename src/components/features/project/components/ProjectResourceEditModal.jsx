'use client';

import React, { memo } from 'react';
import { Modal, Form, Input, Select, Typography, Divider, Space, Button } from 'antd';
import { EditOutlined, FileTextOutlined, TagOutlined, SaveOutlined } from '@ant-design/icons';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';

const { Title, Text } = Typography;

const ProjectResourceEditModal = memo(function ProjectResourceEditModal({
  visible,
  onCancel,
  onUpdate,
  form,
  loading,
}) {
  const { TITLE, FORM, BUTTON, PLACEHOLDER } = PROJECT_UI;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <EditOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {TITLE.EDIT_RESOURCE}
          </Title>
          <Text className='text-muted text-xs italic'>
            Cập nhật thông tin chi tiết của tài liệu dự án
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <Form
        form={form}
        layout='vertical'
        onFinish={onUpdate}
        autoComplete='off'
        className='mt-8 space-y-4 px-2'
      >
        <Form.Item
          name='resourceName'
          label={<span className='text-text font-semibold'>{FORM.RESOURCE_NAME}</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
        >
          <Input
            prefix={<FileTextOutlined className='text-muted' />}
            placeholder={PLACEHOLDER.RESOURCE_NAME}
            className='bg-surface border-border hover:border-primary h-11 rounded-xl transition-all'
          />
        </Form.Item>

        <Form.Item
          name='resourceType'
          label={<span className='text-text font-semibold'>{FORM.RESOURCE_TYPE}</span>}
          rules={[{ required: true, message: 'Vui lòng chọn loại tài liệu!' }]}
        >
          <Select
            options={RESOURCE_TYPES}
            suffixIcon={<TagOutlined className='text-muted' />}
            className='h-11'
          />
        </Form.Item>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onCancel}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {BUTTON.CANCEL}
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            icon={<SaveOutlined />}
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {BUTTON.UPDATE}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
});

export default ProjectResourceEditModal;

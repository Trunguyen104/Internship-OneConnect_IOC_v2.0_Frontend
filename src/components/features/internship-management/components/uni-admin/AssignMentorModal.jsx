'use client';

import React from 'react';
import { Modal, Form, Select, Input, Button } from 'antd';
import { SearchOutlined, ProjectOutlined } from '@ant-design/icons';
import { MOCK_MENTORS, MOCK_PROJECTS } from '../../hooks/useGroupManagement';

export function AssignMentorModal({ open, group, onCancel, onFinish }) {
  const [form] = Form.useForm();

  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      closable={false}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      width={560}
      centered
      className='assign-modal'
    >
      <div className='flex items-start justify-between border-b border-slate-100 p-6'>
        <div>
          <h2 className='text-2xl leading-tight font-bold text-slate-900'>
            Assign Mentor & Project
          </h2>
          <div className='mt-1 flex items-center gap-2'>
            <span className="material-symbols-outlined text-primary font-variation-settings-['FILL'_0,'wght'_400] text-sm">
              group
            </span>
            <p className='text-sm font-medium text-slate-500'>
              Assigning for: <span className='font-semibold text-slate-900'>{group?.name}</span>
            </p>
          </div>
        </div>
        <button
          className='text-slate-400 transition-colors hover:text-slate-600'
          onClick={() => {
            onCancel();
            form.resetFields();
          }}
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>

      <div className='space-y-6 p-6'>
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => {
            onFinish(values);
            form.resetFields();
          }}
        >
          <div className='mb-6 space-y-2'>
            <label className='block text-sm font-semibold text-slate-700'>Select Mentor</label>
            <Form.Item name='mentorId' className='!mb-0'>
              <Select
                showSearch
                placeholder='Search and select a mentor'
                className='custom-select-v2 h-12 w-full'
                suffixIcon={null}
                prefix={<SearchOutlined className='text-slate-400' />}
                options={MOCK_MENTORS.map((m) => ({
                  label: `${m.name} - ${m.role}`,
                  value: m.id,
                }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <p className='px-1 text-[11px] text-slate-400 italic'>
              Tip: You can search by name or expertise
            </p>
          </div>

          <div className='mb-6 space-y-2'>
            <label className='block text-sm font-semibold text-slate-700'>Select Project</label>
            <Form.Item
              name='projectId'
              className='!mb-0'
              rules={[{ required: true, message: 'Vui lòng chọn dự án' }]}
            >
              <Select
                placeholder='Select a project'
                className='custom-select-v2 h-12 w-full'
                options={MOCK_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
                suffixIcon={<ProjectOutlined className='text-slate-400' />}
              />
            </Form.Item>
          </div>

          {group?.mentorId && (
            <div className='mb-6 space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>
                Reason for Change
              </label>
              <Form.Item
                name='reason'
                className='!mb-0'
                rules={[{ required: true, message: 'Vui lòng nhập lý do thay đổi' }]}
              >
                <Input.TextArea
                  placeholder='e.g. Schedule conflict, project reorganization'
                  className='hover:border-primary focus:border-primary rounded-xl border-slate-200 bg-slate-50 transition-all'
                  rows={3}
                />
              </Form.Item>
            </div>
          )}

          <div className='bg-primary/5 border-primary/10 mb-6 flex gap-3 rounded-xl border p-4'>
            <span className='material-symbols-outlined text-primary text-[20px]'>info</span>
            <p className='text-xs leading-relaxed text-slate-600'>
              Assigning a mentor will notify all students in the group and the mentor via email. The
              project dashboard will be updated immediately upon confirmation.
            </p>
          </div>

          <div className='-mx-6 flex flex-col justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 pt-6 sm:flex-row'>
            <Button
              className='h-11 rounded-full border-slate-200 px-6 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100'
              onClick={() => {
                onCancel();
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary shadow-primary/20 h-11 rounded-full border-none px-8 text-sm font-bold shadow-lg transition-all hover:bg-red-700 active:scale-95'
            >
              Assign Mentor
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

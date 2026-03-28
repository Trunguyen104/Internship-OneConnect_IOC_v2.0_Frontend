'use client';

import { DeleteOutlined, LinkOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Space, Upload } from 'antd';
import React from 'react';

export default function ProjectResourceFields({ FORM, PROJECT_MANAGEMENT }) {
  return (
    <>
      <Divider className="my-6" />

      <section>
        <h4 className="mb-4 font-bold text-gray-800 uppercase text-xs flex items-center gap-2">
          <UploadOutlined className="text-primary" />
          {FORM.SECTIONS?.RESOURCES}
        </h4>

        <Form.Item
          name="attachments"
          label={PROJECT_MANAGEMENT.TABS?.RESOURCES}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload.Dragger name="Files" multiple beforeUpload={() => false} listType="text">
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text text-sm">{FORM.PLACEHOLDER?.UPLOAD_PRIMARY}</p>
            <p className="ant-upload-hint text-xs font-normal opacity-50">
              {FORM.PLACEHOLDER?.UPLOAD_HINT}
            </p>
          </Upload.Dragger>
        </Form.Item>

        <div className="mt-6">
          <h5 className="text-[11px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <LinkOutlined />
            {FORM.LABEL?.QUICK_LINKS || 'Quick Links'}
          </h5>
          <Form.List name="links">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[
                        {
                          required: true,
                          message: FORM.VALIDATION?.MISSING_LINK_TITLE || 'Missing title',
                        },
                      ]}
                    >
                      <Input
                        placeholder={FORM.PLACEHOLDER?.LINK_TITLE || 'Link Title (e.g. Figma, PRD)'}
                        className="w-40"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      rules={[
                        { required: true, message: FORM.VALIDATION?.MISSING_URL || 'Missing URL' },
                      ]}
                    >
                      <Input placeholder={FORM.PLACEHOLDER?.URL || 'URL'} className="w-64" />
                    </Form.Item>
                    <DeleteOutlined
                      onClick={() => remove(name)}
                      className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    {FORM.LABEL?.ADD_LINK || 'Add Link'}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </section>
    </>
  );
}

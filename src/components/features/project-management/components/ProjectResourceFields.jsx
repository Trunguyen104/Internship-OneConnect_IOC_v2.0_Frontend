'use client';

import {
  DeleteOutlined,
  FileOutlined,
  LinkOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Space, Upload } from 'antd';
import React from 'react';

/**
 * @param {object} FORM - PROJECT_MANAGEMENT.FORM constants
 * @param {object} PROJECT_MANAGEMENT - full constants
 * @param {Array}  existingResources - array of projectResources from API (for edit mode)
 * @param {Function} onDeleteExisting - called with resourceId when user removes an existing file
 * @param {Array}  deletedResourceIds - list of resource IDs pending deletion
 */
export default function ProjectResourceFields({
  FORM,
  PROJECT_MANAGEMENT,
  existingResources = [],
  onDeleteExisting,
  deletedResourceIds = [],
}) {
  const LINK_TYPES = [10, 8, '8', 'LINK', '10'];
  const activeExisting = existingResources.filter((r) => {
    const rid = r.projectResourceId ?? r.resourceId ?? r.id;
    const rType = String(r.resourceType || '').toUpperCase().trim();
    const isLink = LINK_TYPES.map(String).includes(rType);

    if (isLink) return false; // Filter out links from the top list
    if (!rid) return true;
    return !deletedResourceIds.includes(rid);
  });

  return (
    <>
      <Divider className="my-6" />

      <section>
        <h4 className="mb-4 font-bold text-gray-800 uppercase text-xs flex items-center gap-2">
          <UploadOutlined className="text-primary" />
          {FORM.SECTIONS?.RESOURCES}
        </h4>

        {/* Existing resources (edit mode) */}
        {activeExisting.length > 0 && (
          <div className="mb-4 grid gap-2">
            {activeExisting.map((r) => {
              const rid = r.projectResourceId ?? r.resourceId ?? r.id;
              // Use resourceUrl as a unique key for display if no ID field exists
              const displayKey = rid ?? r.resourceUrl ?? r.resourceName;
              return (
                <div
                  key={displayKey}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileOutlined className="text-primary shrink-0" />
                    <span className="truncate text-slate-700 font-medium max-w-[300px]">
                      {r.resourceName}
                    </span>
                  </div>
                  {onDeleteExisting && rid && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        if (rid) onDeleteExisting(rid);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upload new files */}
        <Form.Item
          name="attachments"
          label={PROJECT_MANAGEMENT.TABS.RESOURCES}
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

        {/* Quick Links */}
        <div className="mt-6">
          <h5 className="text-[11px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <LinkOutlined />
            {FORM.PLACEHOLDER.QUICK_LINKS}
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
                          message: FORM.VALIDATION.MISSING_LINK_TITLE,
                        },
                      ]}
                    >
                      <Input
                        placeholder={FORM.PLACEHOLDER.LINK_TITLE}
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
                      <Input placeholder={FORM.PLACEHOLDER.URL} className="w-64" />
                    </Form.Item>
                    <DeleteOutlined
                      onClick={() => remove(name)}
                      className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    {FORM.LABEL.ADD_LINK}
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

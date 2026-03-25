'use client';

import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { TextArea } = Input;
const { Option } = Select;

export default function ProjectFormModal({
  visible,
  onCancel,
  onSave,
  editingRecord,
  loading,
  viewOnly,
  groups,
}) {
  const [form] = Form.useForm();
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { FORM } = PROJECT_MANAGEMENT.MODALS;

  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.setFieldsValue({
          ...editingRecord,
          startDate: editingRecord.startDate ? dayjs(editingRecord.startDate) : null,
          endDate: editingRecord.endDate ? dayjs(editingRecord.endDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = (isDraft = true) => {
    form.validateFields().then((values) => {
      onSave(values, isDraft);
    });
  };

  return (
    <Modal
      title={editingRecord ? (viewOnly ? 'Project Details' : FORM.TITLE_EDIT) : FORM.TITLE_ADD}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        viewOnly
          ? null
          : [
              <Button key="cancel" onClick={onCancel}>
                Cancel
              </Button>,
              <Button key="draft" onClick={() => handleSubmit(true)} loading={loading}>
                Save Draft
              </Button>,
              <Button
                key="publish"
                type="primary"
                onClick={() => handleSubmit(false)}
                loading={loading}
              >
                Publish Project
              </Button>,
            ]
      }
    >
      <div className="mb-6 text-gray-500">{FORM.DESC}</div>
      <Form form={form} layout="vertical" disabled={viewOnly} initialValues={{ template: 'None' }}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label={FORM.NAME_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION.NAME_REQUIRED }]}
            >
              <Input placeholder={FORM.PLACEHOLDERS.NAME} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="code"
              label={FORM.CODE_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION.CODE_REQUIRED }]}
            >
              <Input placeholder={FORM.PLACEHOLDERS.CODE} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="field"
              label={FORM.FIELD_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION.FIELD_REQUIRED }]}
            >
              <Input placeholder={FORM.PLACEHOLDERS.FIELD} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="internshipGroupId"
              label={FORM.GROUP_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION.GROUP_REQUIRED }]}
            >
              <Select placeholder={FORM.PLACEHOLDERS.GROUP}>
                {groups.map((g) => (
                  <Option key={g.id || g.internshipGroupId} value={g.id || g.internshipGroupId}>
                    {g.internshipGroupName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="template" label={FORM.TEMPLATE_LABEL}>
              <Select>
                <Option value="Scrum">Scrum</Option>
                <Option value="Kanban">Kanban</Option>
                <Option value="None">None</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="startDate" label={FORM.START_DATE}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="endDate" label={FORM.END_DATE}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={FORM.DESCRIPTION}
          rules={[{ required: true, message: FORM.VALIDATION.DESC_REQUIRED }]}
        >
          <TextArea rows={4} placeholder={FORM.PLACEHOLDERS.DESC} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label={FORM.REQUIREMENTS}
          rules={[{ required: true, message: FORM.VALIDATION.REQ_REQUIRED }]}
        >
          <TextArea rows={3} placeholder={FORM.PLACEHOLDERS.REQ} />
        </Form.Item>

        <Form.Item name="deliverables" label={FORM.DELIVERABLES}>
          <TextArea rows={2} placeholder={FORM.PLACEHOLDERS.DEL} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

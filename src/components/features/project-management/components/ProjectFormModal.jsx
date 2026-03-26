'use client';

import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
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
  groups = [],
}) {
  const [form] = Form.useForm();
  const { PROJECT_MANAGEMENT = {} } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE || {};
  const { FORM = {} } = PROJECT_MANAGEMENT.MODALS || {};
  const { userInfo } = useProfile();

  const enterpriseName = useMemo(() => {
    const name = userInfo?.enterpriseName || userInfo?.EnterpriseName || 'ENT';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }, [userInfo]);

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

  const handleValuesChange = (changedValues, allValues) => {
    // AC-02: Auto-generate project code
    if (!editingRecord && (changedValues.name || changedValues.internshipGroupId)) {
      const projectName = allValues.name || '';
      const groupId = allValues.internshipGroupId;
      const group = groups.find((g) => (g.id || g.internshipGroupId) === groupId);

      // Extract term from group name if possible, or fallback
      let termPart = 'TERM';
      if (group?.internshipGroupName) {
        const matches = group.internshipGroupName.match(/SPRING|SUMMER|FALL/i);
        if (matches) {
          termPart = matches[0].toUpperCase();
          const yearMatch = group.internshipGroupName.match(/\d{4}/);
          if (yearMatch) termPart += `_${yearMatch[0]}`;
        }
      }

      const namePart = projectName
        .trim()
        .split(' ')
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();

      if (projectName && groupId) {
        form.setFieldsValue({
          code: `PRJ-${enterpriseName}_${termPart}_${namePart}`,
        });
      }
    }
  };

  const handleSubmit = (isDraft = true) => {
    form
      .validateFields()
      .then((values) => {
        onSave(values, isDraft);
      })
      .catch(() => {
        // Validation errors are handled by Ant Design UI
      });
  };

  return (
    <Drawer
      title={
        <div>
          <h3 className="mb-0 text-lg font-bold">
            {editingRecord ? (viewOnly ? 'Project Details' : FORM.TITLE_EDIT) : FORM.TITLE_ADD}
          </h3>
          {!viewOnly && <p className="mt-1 text-xs font-normal text-gray-400">{FORM.DESC}</p>}
        </div>
      }
      open={visible}
      onClose={onCancel}
      size={640}
      footer={
        !viewOnly && (
          <div className="flex justify-between px-4 py-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Space>
              <Button onClick={() => handleSubmit(true)} loading={loading}>
                Save Draft
              </Button>
              <Button type="primary" onClick={() => handleSubmit(false)} loading={loading}>
                Publish Project
              </Button>
            </Space>
          </div>
        )
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={viewOnly}
        initialValues={{ template: 'None' }}
        onValuesChange={handleValuesChange}
        className="pb-10"
      >
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="name"
              label={FORM.NAME_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION?.NAME_REQUIRED || 'Bắt buộc' }]}
            >
              <Input placeholder={FORM.PLACEHOLDERS?.NAME} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="code"
              label={FORM.CODE_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION?.CODE_REQUIRED || 'Bắt buộc' }]}
            >
              <Input placeholder={FORM.PLACEHOLDERS?.CODE} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="field"
              label={FORM.FIELD_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION?.FIELD_REQUIRED || 'Bắt buộc' }]}
            >
              <Select placeholder={FORM.PLACEHOLDERS?.FIELD}>
                <Option value="CNTT">Công nghệ thông tin</Option>
                <Option value="Kinh tế">Kinh tế</Option>
                <Option value="Truyền thông">Truyền thông</Option>
                <Option value="Ngôn ngữ">Ngôn ngữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="internshipGroupId"
              label={FORM.GROUP_LABEL}
              rules={[{ required: true, message: FORM.VALIDATION?.GROUP_REQUIRED || 'Bắt buộc' }]}
            >
              <Select placeholder={FORM.PLACEHOLDERS?.GROUP}>
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
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="endDate" label={FORM.END_DATE}>
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={FORM.DESCRIPTION}
          rules={[{ required: true, message: FORM.VALIDATION?.DESC_REQUIRED || 'Bắt buộc' }]}
        >
          <TextArea rows={6} placeholder={FORM.PLACEHOLDERS?.DESC} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label={FORM.REQUIREMENTS}
          rules={[{ required: true, message: FORM.VALIDATION?.REQ_REQUIRED || 'Bắt buộc' }]}
        >
          <TextArea rows={4} placeholder={FORM.PLACEHOLDERS?.REQ} />
        </Form.Item>

        <Form.Item name="deliverables" label={FORM.DELIVERABLES}>
          <TextArea rows={3} placeholder={FORM.PLACEHOLDERS?.DEL} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

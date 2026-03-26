'use client';

import { DeleteOutlined, LinkOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
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
          name: editingRecord.projectName || editingRecord.name,
          code: editingRecord.projectCode || editingRecord.code,
          internshipGroupId: editingRecord.internshipId || editingRecord.internshipGroupId,
          startDate: editingRecord.startDate ? dayjs(editingRecord.startDate) : null,
          endDate: editingRecord.endDate ? dayjs(editingRecord.endDate) : null,
          attachments: editingRecord.resources?.attachments || [],
          links: editingRecord.resources?.links || [],
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingRecord, form]);

  const handleValuesChange = (changedValues, allValues) => {
    // AC-02: Auto-generate project code: PRJ-[Enterprise]_[Term]_[Tên]
    if (!editingRecord && (changedValues.name || changedValues.internshipGroupId)) {
      const projectName = allValues.name || '';
      const groupId = allValues.internshipGroupId;
      const group = groups.find((g) => (g.internshipId || g.id) === groupId);

      // Extract term from group name or metadata
      let termPart = 'TERM';
      if (group?.groupName) {
        // Try to find Spring/Summer/Fall + year
        const termMatch = group.groupName.match(/(SPRING|SUMMER|FALL)\D*(\d{4})/i);
        if (termMatch) {
          termPart = `${termMatch[1].toUpperCase()}${termMatch[2]}`;
        }
      }

      // Project Name initials or similar
      const namePart = projectName
        .trim()
        .split(' ')
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();

      if (projectName) {
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
              rules={[{ required: false }]} // AC-02: Optional during creation
              extra="Bắt buộc chọn trước khi Publish"
            >
              <Select placeholder={FORM.PLACEHOLDERS?.GROUP} allowClear>
                {groups
                  .filter((g) => {
                    // Filter: Active (status 1)
                    const isActive = g.status === 1 || g.groupStatus === 1;
                    if (!isActive) return false;

                    // Filter by Mentor ONLY if the user is a Mentor AND g.mentorId exists
                    const userRoleId = userInfo?.roleId || userInfo?.RoleId;
                    const isMentor = userRoleId === 6; // MENTOR_ROLE
                    if (isMentor) {
                      const mid = g.mentorId || g.MentorId;
                      if (mid) return mid === (userInfo?.userId || userInfo?.Id);
                      // If mid is missing from API, we can't filter correctly, so we show it anyway to be safe
                    }

                    return true;
                  })
                  .map((g) => (
                    <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
                      {g.groupName}
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

        <Divider className="my-6" />

        <section>
          <h4 className="mb-4 font-bold text-gray-800 uppercase text-xs flex items-center gap-2">
            <UploadOutlined className="text-primary" />
            Resources & Attachments
          </h4>

          <Form.Item
            name="attachments"
            label="Project Documents"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload.Dragger
              name="files"
              multiple
              action="/api/v1/media/upload" // Placeholder API
              listType="picture-card"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text text-sm">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint text-xs font-normal opacity-50">
                Support for PDF, DOCX, ZIP, etc.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <div className="mt-6">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <LinkOutlined />
              Quick Links
            </h5>
            <Form.List name="links">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        rules={[{ required: true, message: 'Missing title' }]}
                      >
                        <Input placeholder="Link Title (e.g. Figma, PRD)" className="w-40" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        rules={[{ required: true, message: 'Missing URL' }]}
                      >
                        <Input placeholder="URL" className="w-64" />
                      </Form.Item>
                      <DeleteOutlined
                        onClick={() => remove(name)}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Link
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </section>
      </Form>
    </Drawer>
  );
}

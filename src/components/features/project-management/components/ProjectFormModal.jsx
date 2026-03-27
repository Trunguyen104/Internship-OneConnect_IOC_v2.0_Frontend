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
import { PROJECT_MANAGEMENT } from '@/constants/project-management/project-management';
import { useToast } from '@/providers/ToastProvider';

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
  const { FORM = {} } = PROJECT_MANAGEMENT;
  const { userInfo } = useProfile();
  const toast = useToast();

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
        const groupId = editingRecord.internshipId || editingRecord.internshipGroupId;
        const isEmptyGuid = groupId === '00000000-0000-0000-0000-000000000000';

        form.setFieldsValue({
          ...editingRecord,
          name: editingRecord.projectName || editingRecord.name,
          code: editingRecord.projectCode || editingRecord.code,
          internshipGroupId: isEmptyGuid ? null : groupId,
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
        // Block saving if assigned group is archived (AC-11)
        const selectedGroupId = values.internshipGroupId;
        const selectedGroup = groups.find((g) => (g.internshipId || g.id) === selectedGroupId);
        const groupStatus = selectedGroup?.status || selectedGroup?.groupStatus;
        if (groupStatus === 3 || groupStatus === 2) {
          // Archived or Finished
          toast.warning(PROJECT_MANAGEMENT.MESSAGES.ERROR_INACTIVE_GROUP);
          return;
        }
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
            {editingRecord ? (viewOnly ? FORM.TITLE_DETAIL : FORM.TITLE_EDIT) : FORM.TITLE_ADD}
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
            <Button onClick={onCancel}>{FORM.CANCEL_BTN}</Button>
            <Space>
              <Button onClick={() => handleSubmit(true)} loading={loading}>
                {FORM.SAVE_DRAFT}
              </Button>
              <Button type="primary" onClick={() => handleSubmit(false)} loading={loading}>
                {FORM.PUBLISH}
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
              label={FORM.LABEL.NAME}
              rules={[{ required: true, message: FORM.VALIDATION.NAME_REQUIRED }]}
            >
              <Input placeholder={FORM.PLACEHOLDER.NAME} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="code"
              label={FORM.LABEL.CODE}
              rules={[{ required: true, message: FORM.VALIDATION.CODE_REQUIRED }]}
            >
              <Input placeholder={FORM.PLACEHOLDER.CODE} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="field"
              label={FORM.LABEL.FIELD}
              rules={[{ required: true, message: FORM.VALIDATION.FIELD_REQUIRED }]}
            >
              <Select placeholder={FORM.PLACEHOLDER.FIELD}>
                {Object.entries(FORM.FIELD_OPTIONS.FIELD).map(([key, label]) => (
                  <Option key={key} value={label}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="internshipGroupId"
              label={FORM.LABEL.GROUP}
              rules={[{ required: false }]}
              extra={FORM.VALIDATION.GROUP_MUST_SELECT}
            >
              <Select placeholder={FORM.PLACEHOLDER.GROUP} allowClear>
                {groups
                  .filter((g) => {
                    // Filter: Active (status 1)
                    const gStatus = g.status || g.groupStatus;
                    const isActive = gStatus === 1; // ACTIVE_STATUS

                    // If we are EDITING and this is the current group of the project,
                    // we show it even if it's archived (but we'll block saving later)
                    const isCurrentGroup =
                      editingRecord?.internshipGroupId === g.id ||
                      editingRecord?.internshipId === g.id;

                    if (!isActive && !isCurrentGroup) return false;

                    // Filter by Mentor ONLY if the user is a Mentor AND g.mentorId exists
                    const userRoleId = userInfo?.roleId || userInfo?.RoleId;
                    const isMentor = userRoleId === 6; // MENTOR_ROLE
                    if (isMentor) {
                      const mid = g.mentorId || g.MentorId;
                      // AC-11 Case 3: Current mentor of the group can manage, regardless of project creator
                      if (mid) return mid === (userInfo?.userId || userInfo?.Id);
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
            <Form.Item name="template" label={FORM.LABEL.TEMPLATE}>
              <Select>
                {Object.entries(FORM.FIELD_OPTIONS.TEMPLATE).map(([key, label]) => (
                  <Option key={key} value={label}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="startDate" label={FORM.LABEL.START_DATE}>
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder={FORM.PLACEHOLDER.DATE}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="endDate" label={FORM.LABEL.END_DATE}>
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder={FORM.PLACEHOLDER.DATE}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={FORM.LABEL.DESCRIPTION}
          rules={[{ required: true, message: FORM.VALIDATION.DESC_REQUIRED }]}
        >
          <TextArea rows={6} placeholder={FORM.PLACEHOLDER.DESCRIPTION} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label={FORM.LABEL.REQUIREMENTS}
          rules={[{ required: true, message: FORM.VALIDATION.REQ_REQUIRED }]}
        >
          <TextArea rows={4} placeholder={FORM.PLACEHOLDER.REQUIREMENTS} />
        </Form.Item>

        <Form.Item name="deliverables" label={FORM.LABEL.DELIVERABLES}>
          <TextArea rows={3} placeholder={FORM.PLACEHOLDER.DELIVERABLES} />
        </Form.Item>

        <Divider className="my-6" />

        <section>
          <h4 className="mb-4 font-bold text-gray-800 uppercase text-xs flex items-center gap-2">
            <UploadOutlined className="text-primary" />
            {FORM.SECTIONS.RESOURCES}
          </h4>

          <Form.Item
            name="attachments"
            label={PROJECT_MANAGEMENT.TABS.RESOURCES}
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
              <p className="ant-upload-text text-sm">{FORM.PLACEHOLDER.UPLOAD_PRIMARY}</p>
              <p className="ant-upload-hint text-xs font-normal opacity-50">
                {FORM.PLACEHOLDER.UPLOAD_HINT}
              </p>
            </Upload.Dragger>
          </Form.Item>

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
                        rules={[{ required: true, message: FORM.VALIDATION.MISSING_TITLE }]}
                      >
                        <Input placeholder={FORM.PLACEHOLDER.LINK_TITLE} className="w-40" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        rules={[{ required: true, message: FORM.VALIDATION.MISSING_URL }]}
                      >
                        <Input
                          placeholder={PROJECT_MANAGEMENT.DETAIL.SESOURCES?.EXTERNAL || 'URL'}
                          className="w-64"
                        />
                      </Form.Item>
                      <DeleteOutlined
                        onClick={() => remove(name)}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      {PROJECT_MANAGEMENT.BUTTON.ADD_LINK || 'Add Link'}
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

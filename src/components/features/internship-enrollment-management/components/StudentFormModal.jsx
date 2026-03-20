import {
  BookOutlined,
  EditOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Empty, Form, Input, Row, Select, Tabs } from 'antd';
import React, { memo, useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const StudentFormBody = memo(function StudentFormBody({
  initialValues,
  onSave,
  onClose,
  loading,
  viewOnly,
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MODALS, MAJOR_OPTIONS, STATUS_OPTIONS } = STUDENT_ENROLLMENT;
  const { ADD_EDIT } = MODALS;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        fullName: initialValues.name,
        studentCode: initialValues.id,
        email: initialValues.email,
        major: initialValues.major,
        phone: initialValues.phone,
        status: initialValues.status,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave?.(values);
    } catch (error) {
      if (error.errorFields.length > 0) {
        const firstErrorField = error.errorFields[0].name[0];
        if (['fullName', 'studentCode', 'email', 'major'].includes(firstErrorField)) {
          setActiveTab('1');
        } else {
          setActiveTab('2');
        }
      }
    }
  };

  const title = viewOnly
    ? ADD_EDIT.TITLE_VIEW
    : initialValues
      ? ADD_EDIT.TITLE_EDIT
      : ADD_EDIT.TITLE_ADD;

  const subtitle = viewOnly
    ? ADD_EDIT.SUBTITLE_VIEW
    : initialValues
      ? ADD_EDIT.SUBTITLE_EDIT
      : ADD_EDIT.SUBTITLE_ADD;

  const renderPersonalTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[300px] duration-300">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
                {ADD_EDIT.NAME_LABEL}
              </span>
            }
            name="fullName"
            rules={[{ required: true, message: ADD_EDIT.NAME_REQUIRED }]}
          >
            <Input
              prefix={<UserOutlined className="text-muted ml-0.5" />}
              placeholder={ADD_EDIT.NAME_PLACEHOLDER}
              className="h-10 rounded-lg"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
                {ADD_EDIT.ID_LABEL}
              </span>
            }
            name="studentCode"
            rules={[{ required: true, message: ADD_EDIT.ID_REQUIRED }]}
          >
            <Input
              prefix={<IdcardOutlined className="text-muted ml-0.5" />}
              placeholder={ADD_EDIT.ID_PLACEHOLDER}
              className="h-10 rounded-lg"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
            {ADD_EDIT.EMAIL_LABEL}
          </span>
        }
        name="email"
        rules={[
          { required: true, message: ADD_EDIT.EMAIL_REQUIRED },
          { type: 'email', message: ADD_EDIT.EMAIL_INVALID },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-muted ml-0.5" />}
          placeholder={ADD_EDIT.EMAIL_PLACEHOLDER}
          className="h-10 rounded-lg"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
                {ADD_EDIT.MAJOR_LABEL}
              </span>
            }
            name="major"
            rules={[{ required: true, message: ADD_EDIT.MAJOR_REQUIRED }]}
          >
            <Select
              placeholder={ADD_EDIT.MAJOR_PLACEHOLDER}
              className="h-10 w-full rounded-lg"
              options={MAJOR_OPTIONS}
              suffixIcon={<BookOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
                {ADD_EDIT.PHONE_LABEL}
              </span>
            }
            name="phone"
          >
            <Input
              prefix={<PhoneOutlined className="text-muted ml-0.5" />}
              placeholder={ADD_EDIT.PHONE_PLACEHOLDER}
              className="h-10 rounded-lg"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderPlacementTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[300px] space-y-4 duration-300">
      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
            {ADD_EDIT.STATUS_LABEL}
          </span>
        }
        name="status"
      >
        <Select className="h-10 w-full rounded-lg" options={STATUS_OPTIONS} />
      </Form.Item>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
            {ADD_EDIT.ENTERPRISE_LABEL}
          </span>
        }
      >
        <Input
          disabled
          prefix={<SearchOutlined className="text-muted ml-0.5" />}
          placeholder={ADD_EDIT.ENTERPRISE_PLACEHOLDER}
          className="h-10 rounded-lg"
        />
      </Form.Item>

      {initialValues?.status && (
        <div className="bg-muted/5 border-border mt-6 rounded-xl border p-4">
          <div className="mb-2 flex items-center gap-2">
            <SettingOutlined className="text-primary" />
            <span className="text-muted text-[10px] font-black tracking-wider uppercase">
              {ADD_EDIT.SECTION_PLACEMENT}
            </span>
          </div>
          <p className="text-muted text-xs leading-relaxed">
            This student is currently in the <strong>{initialValues?.status}</strong> phase.
            Business details and evaluations will be updated as the internship progresses.
          </p>
        </div>
      )}
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 border-border/50 bg-bg flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 duration-300">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="flex flex-col gap-1">
            <span className="text-text/40 text-sm font-bold">{ADD_EDIT.FEEDBACK_EMPTY.TITLE}</span>
            <span className="text-muted text-[10px] font-medium uppercase">
              {ADD_EDIT.FEEDBACK_EMPTY.SUBTITLE}
            </span>
          </div>
        }
      />
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2 px-1">
          <InfoCircleOutlined /> {ADD_EDIT.TABS.GENERAL}
        </span>
      ),
      children: renderPersonalTab(),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2 px-1">
          <SettingOutlined /> {ADD_EDIT.TABS.PLACEMENT}
        </span>
      ),
      children: renderPlacementTab(),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2 px-1">
          <StarOutlined /> {ADD_EDIT.TABS.FEEDBACK}
        </span>
      ),
      children: renderFeedbackTab(),
    },
  ];

  return (
    <>
      <CompoundModal.Header title={title} subtitle={subtitle} />
      <CompoundModal.Content className="!pb-2">
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          disabled={loading || viewOnly}
          requiredMark={!viewOnly}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="student-enrollment-tabs"
          />
        </Form>
      </CompoundModal.Content>

      {!viewOnly ? (
        <CompoundModal.Footer
          onCancel={onClose}
          onConfirm={handleSubmit}
          loading={loading}
          cancelText={ADD_EDIT.CANCEL}
          confirmText={initialValues ? ADD_EDIT.SUBMIT_EDIT : ADD_EDIT.SUBMIT_ADD}
          confirmIcon={initialValues ? <EditOutlined /> : <PlusCircleOutlined />}
        />
      ) : (
        <CompoundModal.Footer onCancel={onClose} confirmText={ADD_EDIT.CLOSE} onConfirm={onClose} />
      )}
    </>
  );
});

const StudentFormModal = memo(function StudentFormModal({ visible, onClose, ...props }) {
  return (
    <CompoundModal open={visible} onCancel={onClose} width={520} destroyOnClose>
      {visible && <StudentFormBody onClose={onClose} {...props} />}
    </CompoundModal>
  );
});

export default StudentFormModal;

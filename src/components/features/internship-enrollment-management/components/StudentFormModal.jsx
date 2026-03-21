import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { UI_TEXT } from '@/lib/UI_Text';
import { enterpriseService } from '@/services/enterprise.service';

import { STUDENT_ENROLLMENT } from '../constants/enrollment';

const StudentFormBody = memo(function StudentFormBody({
  initialValues,
  onSave,
  onCancel,
  loading,
  viewOnly,
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const { MODALS } = STUDENT_ENROLLMENT;
  const { ADD_EDIT } = MODALS;

  const [enterprises, setEnterprises] = useState([]);
  const [fetchingEnterprises, setFetchingEnterprises] = useState(false);

  useEffect(() => {
    const fetchEnterprises = async () => {
      setFetchingEnterprises(true);
      try {
        const res = await enterpriseService.getAll({ PageNumber: 1, PageSize: 100 });
        setEnterprises(res?.data?.items || []);
      } catch (error) {
        console.error('Fetch enterprises failed:', error);
      } finally {
        setFetchingEnterprises(false);
      }
    };
    fetchEnterprises();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        fullName: initialValues.fullName,
        studentCode: initialValues.studentCode,
        email: initialValues.email,
        major: initialValues.major,
        phone: initialValues.phone,
        status: initialValues.status,
        placementStatus: initialValues.placementStatus || 'UNPLACED',
        enterpriseId: initialValues.enterpriseId,
        dateOfBirth: initialValues.dateOfBirth,
        enrollmentDate: initialValues.enrollmentDate,
        enrollmentNote: initialValues.enrollmentNote,
        midtermFeedback: initialValues.midtermFeedback,
        finalFeedback: initialValues.finalFeedback,
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
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[350px] duration-300">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
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
              <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
                {ADD_EDIT.ID_LABEL}
              </span>
            }
            name="studentCode"
            rules={[{ required: true, message: ADD_EDIT.ID_REQUIRED }]}
            extra={
              initialValues && !viewOnly ? (
                <span className="text-[10px] text-info italic">{ADD_EDIT.ID_EDIT_INFO}</span>
              ) : null
            }
          >
            <Input
              prefix={<IdcardOutlined className="text-muted ml-0.5" />}
              placeholder={ADD_EDIT.ID_PLACEHOLDER}
              className="h-10 rounded-lg"
              disabled={!!initialValues}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
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
              <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
                {ADD_EDIT.MAJOR_LABEL}
              </span>
            }
            name="major"
            rules={[{ required: true, message: ADD_EDIT.MAJOR_REQUIRED }]}
          >
            <Input
              placeholder={ADD_EDIT.MAJOR_PLACEHOLDER}
              className="h-10 rounded-lg"
              prefix={<BookOutlined className="text-muted ml-0.5" />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
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

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
            {ADD_EDIT.DOB_LABEL}
          </span>
        }
        name="dateOfBirth"
      >
        {viewOnly ? (
          <div className="bg-primary/5 border-primary/20 flex h-10 items-center gap-2 rounded-lg border px-3">
            <CalendarOutlined className="text-primary text-sm font-bold" />
            <span className="text-text font-semibold text-sm">
              {initialValues?.dateOfBirth
                ? dayjs(initialValues.dateOfBirth).format('DD/MM/YYYY')
                : UI_TEXT.COMMON.DOUBLE_MINUS}
            </span>
          </div>
        ) : (
          <Input
            type="date"
            prefix={<CalendarOutlined className="text-muted ml-0.5" />}
            className="h-10 rounded-lg"
          />
        )}
      </Form.Item>
    </div>
  );

  const renderPlacementTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[350px] space-y-4 duration-300">
      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
            {ADD_EDIT.STATUS_LABEL}
          </span>
        }
        name="placementStatus"
      >
        <Select
          className="h-10 w-full rounded-lg"
          options={[
            { label: STUDENT_ENROLLMENT.PLACEMENT_LABELS.PLACED, value: 'PLACED' },
            { label: STUDENT_ENROLLMENT.PLACEMENT_LABELS.UNPLACED, value: 'UNPLACED' },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
            {ADD_EDIT.ENROLL_DATE_LABEL}
          </span>
        }
        name="enrollmentDate"
      >
        {viewOnly ? (
          <div className="bg-success/5 border-success/20 flex h-10 items-center gap-2 rounded-lg border px-3">
            <CalendarOutlined className="text-success text-sm font-bold" />
            <span className="text-text font-semibold text-sm">
              {initialValues?.enrollmentDate
                ? dayjs(initialValues.enrollmentDate).format('DD/MM/YYYY')
                : UI_TEXT.COMMON.DOUBLE_MINUS}
            </span>
          </div>
        ) : (
          <Input type="date" className="h-10 rounded-lg" />
        )}
      </Form.Item>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
            {ADD_EDIT.NOTE_LABEL}
          </span>
        }
        name="enrollmentNote"
      >
        {viewOnly ? (
          <div className="bg-muted/5 border-border min-h-[60px] rounded-lg border p-3">
            <p className="text-text whitespace-pre-wrap text-sm leading-relaxed">
              {initialValues?.enrollmentNote || UI_TEXT.COMMON.DOUBLE_MINUS}
            </p>
          </div>
        ) : (
          <Input.TextArea placeholder={ADD_EDIT.NOTE_PLACEHOLDER} rows={2} className="rounded-lg" />
        )}
      </Form.Item>

      <Form.Item
        label={
          <span className="mb-1 block text-[10px] font-bold tracking-wider uppercase text-muted">
            {ADD_EDIT.ENTERPRISE_LABEL}
          </span>
        }
        name="enterpriseId"
        dependencies={['placementStatus']}
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('placementStatus') === 'PLACED',
            message: ADD_EDIT.VALIDATION.ENTERPRISE_REQUIRED,
          }),
        ]}
      >
        {viewOnly ? (
          <div className="bg-muted/5 border-border flex h-10 items-center gap-2 rounded-lg border px-3">
            <SettingOutlined className="text-muted text-sm font-bold" />
            <span className="text-text font-semibold text-sm">
              {initialValues?.enterpriseName || UI_TEXT.COMMON.DOUBLE_MINUS}
            </span>
          </div>
        ) : (
          <Select
            showSearch
            loading={fetchingEnterprises}
            placeholder={ADD_EDIT.ENTERPRISE_PLACEHOLDER}
            className="h-10 w-full rounded-lg"
            options={enterprises.map((e) => ({ label: e.name, value: e.enterpriseId }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        )}
      </Form.Item>
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center gap-2 px-1">{ADD_EDIT.TABS.GENERAL}</span>,
      children: renderPersonalTab(),
    },
    (initialValues || viewOnly) && {
      key: '2',
      label: <span className="flex items-center gap-2 px-1">{ADD_EDIT.TABS.PLACEMENT}</span>,
      children: renderPlacementTab(),
    },
  ].filter(Boolean);

  return (
    <>
      <CompoundModal.Header title={title} />
      <CompoundModal.Content className="!pb-2">
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
          disabled={loading || viewOnly}
          requiredMark={!viewOnly}
          onValuesChange={(changedValues) => {
            if (changedValues.enterpriseId) {
              form.setFieldsValue({ placementStatus: 'PLACED' });
            }
            if (changedValues.placementStatus === 'UNPLACED') {
              form.setFieldsValue({ enterpriseId: null });
            }
          }}
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
          onCancel={onCancel}
          onConfirm={handleSubmit}
          loading={loading}
          cancelText={ADD_EDIT.CANCEL}
          confirmText={initialValues ? ADD_EDIT.SUBMIT_EDIT : ADD_EDIT.SUBMIT_ADD}
          confirmIcon={initialValues ? <EditOutlined /> : <PlusCircleOutlined />}
        />
      ) : (
        <CompoundModal.Footer
          onCancel={onCancel}
          confirmText={ADD_EDIT.CLOSE}
          onConfirm={onCancel}
        />
      )}
    </>
  );
});

const StudentFormModal = memo(function StudentFormModal({ visible, onCancel, ...props }) {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={520} destroyOnClose>
      {visible && <StudentFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
});

export default StudentFormModal;

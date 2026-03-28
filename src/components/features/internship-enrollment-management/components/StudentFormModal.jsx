import {
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Tabs, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { enterpriseService } from '@/services/enterprise.service';

const { Text } = Typography;

const StudentFormBody = memo(function StudentFormBody({
  initialValues,
  onSave,
  onCancel,
  loading,
  viewOnly,
}) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MODALS, PLACEMENT_LABELS } = ENROLLMENT_MANAGEMENT;
  const { ADD_EDIT } = MODALS;

  const [enterprises, setEnterprises] = useState([]);
  const [fetchingEnterprises, setFetchingEnterprises] = useState(false);

  useEffect(() => {
    const fetchEnterprises = async () => {
      setFetchingEnterprises(true);
      try {
        const res = await enterpriseService.getAll({ PageNumber: 1, PageSize: 100 });
        const items = res?.data?.items ?? res?.items ?? (Array.isArray(res?.data) ? res.data : []);
        setEnterprises(items);
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
      await onSave?.(values);
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
    ? initialValues.fullName
    : initialValues
      ? ADD_EDIT.SUBTITLE_EDIT
      : ADD_EDIT.SUBTITLE_ADD;

  const renderPersonalTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[400px] space-y-3 pt-3 duration-300">
      <Row gutter={12}>
        <Col span={14}>
          <Form.Item
            label={ADD_EDIT.NAME_LABEL}
            name="fullName"
            rules={[{ required: true, message: ADD_EDIT.NAME_REQUIRED }]}
            hidden={viewOnly}
          >
            <Input
              prefix={<UserOutlined className="text-muted/60 ml-0.5" />}
              placeholder={ADD_EDIT.NAME_PLACEHOLDER}
              className="!h-10 !rounded-xl"
            />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.NAME_LABEL}
              value={initialValues?.fullName || '-'}
            />
          )}
        </Col>
        <Col span={10}>
          <Form.Item
            label={ADD_EDIT.ID_LABEL}
            name="studentCode"
            rules={[{ required: true, message: ADD_EDIT.ID_REQUIRED }]}
            hidden={viewOnly}
          >
            <Input
              prefix={<IdcardOutlined className="text-muted/60 ml-0.5" />}
              placeholder={ADD_EDIT.ID_PLACEHOLDER}
              className="!h-10 !rounded-xl font-mono"
              // disabled={!!initialValues}
            />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.ID_LABEL}
              value={initialValues?.studentCode || '-'}
            />
          )}
        </Col>
      </Row>

      <Form.Item
        label={ADD_EDIT.EMAIL_LABEL}
        name="email"
        rules={[
          { required: true, message: ADD_EDIT.EMAIL_REQUIRED },
          { type: 'email', message: ADD_EDIT.EMAIL_INVALID },
        ]}
        hidden={viewOnly}
      >
        <Input
          prefix={<MailOutlined className="text-muted/60 ml-0.5" />}
          placeholder={ADD_EDIT.EMAIL_PLACEHOLDER}
          className="!h-10 !rounded-xl"
        />
      </Form.Item>
      {viewOnly && (
        <CompoundModal.InfoBox label={ADD_EDIT.EMAIL_LABEL} value={initialValues?.email || '-'} />
      )}

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={ADD_EDIT.MAJOR_LABEL}
            name="major"
            rules={[{ required: true, message: ADD_EDIT.MAJOR_REQUIRED }]}
            hidden={viewOnly}
          >
            <Input
              placeholder={ADD_EDIT.MAJOR_PLACEHOLDER}
              className="!h-10 !rounded-xl"
              prefix={<BookOutlined className="text-muted/60 ml-0.5" />}
            />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.MAJOR_LABEL}
              value={initialValues?.major || '-'}
            />
          )}
        </Col>
        <Col span={12}>
          <Form.Item label={ADD_EDIT.PHONE_LABEL} name="phone" hidden={viewOnly}>
            <Input
              prefix={<PhoneOutlined className="text-muted/60 ml-0.5" />}
              placeholder={ADD_EDIT.PHONE_PLACEHOLDER}
              className="!h-10 !rounded-xl"
            />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.PHONE_LABEL}
              value={initialValues?.phone || '-'}
            />
          )}
        </Col>
      </Row>

      {!viewOnly && (
        <Form.Item label={ADD_EDIT.DOB_LABEL} name="dateOfBirth">
          <Input
            type="date"
            prefix={<CalendarOutlined className="text-muted/60 ml-0.5" />}
            className="!h-10 !rounded-xl"
          />
        </Form.Item>
      )}
      {viewOnly && (
        <CompoundModal.InfoBox
          label={ADD_EDIT.DOB_LABEL}
          value={
            initialValues?.dateOfBirth
              ? dayjs(initialValues.dateOfBirth).format('DD MMM, YYYY')
              : '-'
          }
          color="primary"
        />
      )}
    </div>
  );

  const renderPlacementTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[400px] space-y-4 pt-3 duration-300">
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label={ADD_EDIT.STATUS_LABEL} name="placementStatus" hidden={viewOnly}>
            <Select
              className="!h-10 w-full"
              options={[
                { label: PLACEMENT_LABELS.PLACED, value: 'PLACED' },
                { label: PLACEMENT_LABELS.UNPLACED, value: 'UNPLACED' },
              ]}
            />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.STATUS_LABEL}
              value={
                PLACEMENT_LABELS[initialValues?.placementStatus] ||
                initialValues?.placementStatus ||
                '-'
              }
              color="info"
            />
          )}
        </Col>
        <Col span={12}>
          <Form.Item label={ADD_EDIT.ENROLL_DATE_LABEL} name="enrollmentDate" hidden={viewOnly}>
            <Input type="date" className="!h-10 !rounded-xl" />
          </Form.Item>
          {viewOnly && (
            <CompoundModal.InfoBox
              label={ADD_EDIT.ENROLL_DATE_LABEL}
              value={
                initialValues?.enrollmentDate
                  ? dayjs(initialValues.enrollmentDate).format('DD MMM, YYYY')
                  : '-'
              }
              color="success"
            />
          )}
        </Col>
      </Row>

      <Form.Item
        label={ADD_EDIT.ENTERPRISE_LABEL}
        name="enterpriseId"
        dependencies={['placementStatus']}
        hidden={viewOnly}
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('placementStatus') === 'PLACED',
            message: ADD_EDIT.VALIDATION.ENTERPRISE_REQUIRED,
          }),
        ]}
      >
        <Select
          showSearch
          loading={fetchingEnterprises}
          placeholder={ADD_EDIT.ENTERPRISE_PLACEHOLDER}
          className="!h-10 w-full"
          options={enterprises.map((e) => ({
            label: e.name || e.Name,
            value: e.enterpriseId || e.EnterpriseId,
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
      {viewOnly && (
        <CompoundModal.InfoBox
          label={ADD_EDIT.ENTERPRISE_LABEL}
          value={initialValues?.enterpriseName || '-'}
        />
      )}

      <Form.Item label={ADD_EDIT.NOTE_LABEL} name="enrollmentNote" hidden={viewOnly}>
        <Input.TextArea
          placeholder={ADD_EDIT.NOTE_PLACEHOLDER}
          rows={3}
          className="!rounded-2xl !bg-gray-50/50 focus:!bg-white"
        />
      </Form.Item>
      {viewOnly && (
        <div className="bg-slate-50/50 border-gray-100 min-h-[80px] rounded-2xl border p-3.5">
          <Text className="text-text whitespace-pre-wrap text-[13px] leading-relaxed block overflow-hidden">
            {initialValues?.enrollmentNote || '-'}
          </Text>
        </div>
      )}
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
      <CompoundModal.Header
        title={title}
        subtitle={subtitle}
        icon={
          viewOnly ? (
            <InfoCircleOutlined />
          ) : initialValues ? (
            <EditOutlined />
          ) : (
            <PlusCircleOutlined />
          )
        }
      />
      <CompoundModal.Content className="!pb-0">
        <Form
          form={form}
          layout="vertical"
          className="premium-form"
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
            className="premium-tabs"
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
          className="!mt-0"
        />
      ) : (
        <CompoundModal.Footer
          showCancel={false}
          confirmText={ADD_EDIT.CLOSE}
          onConfirm={onCancel}
          className="!mt-0"
        />
      )}
    </>
  );
});

const StudentFormModal = memo(function StudentFormModal({ visible, onCancel, ...props }) {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={480} destroyOnClose>
      {visible && <StudentFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
});

export default StudentFormModal;

import { EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form, Tabs } from 'antd';
import React, { memo, useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { enterpriseService } from '@/services/enterprise.service';

import { PersonalTab } from './PersonalTab';
import { PlacementTab } from './PlacementTab';

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

  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center gap-2 px-1">{ADD_EDIT.TABS.GENERAL}</span>,
      children: (
        <PersonalTab viewOnly={viewOnly} initialValues={initialValues} ADD_EDIT={ADD_EDIT} />
      ),
    },
    (initialValues || viewOnly) && {
      key: '2',
      label: <span className="flex items-center gap-2 px-1">{ADD_EDIT.TABS.PLACEMENT}</span>,
      children: (
        <PlacementTab
          viewOnly={viewOnly}
          initialValues={initialValues}
          ADD_EDIT={ADD_EDIT}
          PLACEMENT_LABELS={PLACEMENT_LABELS}
          fetchingEnterprises={fetchingEnterprises}
          enterprises={enterprises}
        />
      ),
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
    <CompoundModal open={visible} onCancel={onCancel} width={480} destroyOnHidden>
      {visible && <StudentFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
});

export default StudentFormModal;

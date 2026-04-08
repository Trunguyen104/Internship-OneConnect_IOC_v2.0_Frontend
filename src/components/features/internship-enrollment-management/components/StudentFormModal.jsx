import { EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { PersonalTab } from './PersonalTab';

const StudentFormBody = memo(function StudentFormBody({
  initialValues,
  onSave,
  onCancel,
  loading,
  viewOnly,
}) {
  const [form] = Form.useForm();
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MODALS } = ENROLLMENT_MANAGEMENT;
  const { ADD_EDIT } = MODALS;

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
      console.error('Form validation failed:', error);
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
        >
          <PersonalTab viewOnly={viewOnly} initialValues={initialValues} ADD_EDIT={ADD_EDIT} />
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

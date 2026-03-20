import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Typography } from 'antd';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

const RejectStudentModal = ({ open, student, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { REJECT } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleFinish = (values) => {
    if (student) {
      onConfirm(student.id, values.reason);
    }
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<ExclamationCircleOutlined className="text-danger" />}
        title={REJECT.TITLE}
        subtitle={`${REJECT.WARNING_TEXT_1} ${student?.fullName || ''}`}
        type="danger"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="p-6 pt-8"
        requiredMark={false}
      >
        <div className="bg-danger-surface border-danger mb-6 rounded-xl border-l-4 p-4">
          <Text className="text-muted text-xs leading-relaxed">{REJECT.WARNING_TEXT_2}</Text>
        </div>

        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {REJECT.REASON_LABEL}
            </span>
          }
          name="reason"
          rules={[{ required: true, message: REJECT.REASON_REQUIRED }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={REJECT.REASON_PLACEHOLDER}
            className="bg-surface border-border rounded-xl px-4 py-3"
          />
        </Form.Item>

        <CompoundModal.Footer
          cancelText={REJECT.CANCEL}
          submitText={REJECT.SUBMIT}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          submitDanger
          className="mt-8 pt-6"
        />
      </Form>
    </CompoundModal>
  );
};

export default RejectStudentModal;

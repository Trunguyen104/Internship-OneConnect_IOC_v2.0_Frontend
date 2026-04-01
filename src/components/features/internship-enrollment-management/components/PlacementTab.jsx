import { Col, Form, Input, Row, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';

const { Text } = Typography;

export const PlacementTab = ({
  viewOnly,
  initialValues,
  ADD_EDIT,
  PLACEMENT_LABELS,
  fetchingEnterprises,
  enterprises,
}) => {
  return (
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
};

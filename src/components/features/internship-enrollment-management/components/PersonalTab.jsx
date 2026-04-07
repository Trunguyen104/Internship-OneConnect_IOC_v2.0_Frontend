import {
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Form, Input, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';

export const PersonalTab = ({ viewOnly, initialValues, ADD_EDIT }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 min-h-[400px] max-w-[500px] space-y-3 pt-3 duration-300">
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={ADD_EDIT.NAME_LABEL}
            name="fullName"
            rules={[
              { required: true, message: ADD_EDIT.NAME_REQUIRED },
              { pattern: /^[\p{L}\s]+$/u, message: ADD_EDIT.NAME_INVALID },
            ]}
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
        <Col span={12}>
          <Form.Item
            label={
              <span className="flex items-center gap-1.5">
                {ADD_EDIT.ID_LABEL}
                <Tooltip title={ADD_EDIT.ID_HINT}>
                  <InfoCircleOutlined className="text-muted/60 hover:text-primary cursor-help text-[11px]" />
                </Tooltip>
              </span>
            }
            name="studentCode"
            rules={[
              { required: true, message: ADD_EDIT.ID_REQUIRED },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                message: ADD_EDIT.ID_INVALID,
              },
            ]}
            hidden={viewOnly}
          >
            <Input
              prefix={<IdcardOutlined className="text-muted/60 ml-0.5" />}
              placeholder={ADD_EDIT.ID_PLACEHOLDER}
              className="!h-10 !rounded-xl font-mono"
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
          <Form.Item
            label={ADD_EDIT.PHONE_LABEL}
            name="phone"
            hidden={viewOnly}
            rules={[
              { required: true, message: ADD_EDIT.PHONE_REQUIRED },
              { pattern: /^(\+84|0)[0-9]{9,10}$/, message: ADD_EDIT.PHONE_INVALID },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-muted/60 ml-0.5" />}
              placeholder={ADD_EDIT.PHONE_PLACEHOLDER}
              className="!h-10 !rounded-xl"
              maxLength={13}
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
        <Form.Item
          label={ADD_EDIT.DOB_LABEL}
          name="dateOfBirth"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const age = dayjs().diff(dayjs(value), 'year');
                if (age < 18) {
                  return Promise.reject(new Error(ADD_EDIT.DOB_MIN_AGE));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
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
};

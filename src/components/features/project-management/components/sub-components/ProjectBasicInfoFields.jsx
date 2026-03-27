'use client';

import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import React from 'react';

const { Option } = Select;

export default function ProjectBasicInfoFields({ FORM, groups, userInfo, editingRecord }) {
  return (
    <>
      <Row gutter={16}>
        <Col span={14}>
          <Form.Item
            name="name"
            label={FORM.LABEL?.NAME}
            rules={[{ required: true, message: FORM.VALIDATION?.NAME_REQUIRED }]}
          >
            <Input placeholder={FORM.PLACEHOLDER?.NAME} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            name="code"
            label={FORM.LABEL?.CODE}
            rules={[{ required: true, message: FORM.VALIDATION?.CODE_REQUIRED }]}
          >
            <Input placeholder={FORM.PLACEHOLDER?.CODE} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="field"
            label={FORM.LABEL?.FIELD}
            rules={[{ required: true, message: FORM.VALIDATION?.FIELD_REQUIRED }]}
          >
            <Select placeholder={FORM.PLACEHOLDER?.FIELD}>
              {Object.entries(FORM.FIELD_OPTIONS?.FIELD || {}).map(([key, label]) => (
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
            label={FORM.LABEL?.GROUP}
            rules={[{ required: false }]}
            extra={FORM.VALIDATION?.GROUP_MUST_SELECT}
          >
            <Select placeholder={FORM.PLACEHOLDER?.GROUP} allowClear>
              {groups
                .filter((g) => {
                  const gStatus = g.status || g.groupStatus;
                  const isActive = gStatus === 1;
                  const isCurrentGroup =
                    editingRecord?.internshipGroupId === g.id ||
                    editingRecord?.internshipId === g.id;

                  if (!isActive && !isCurrentGroup) return false;

                  const userRoleId = userInfo?.roleId || userInfo?.RoleId;
                  if (userRoleId === 6) {
                    // MENTOR_ROLE
                    const mid = g.mentorId || g.MentorId;
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
          <Form.Item name="template" label={FORM.LABEL?.TEMPLATE}>
            <Select placeholder={FORM.PLACEHOLDER?.TEMPLATE}>
              {Object.entries(FORM.FIELD_OPTIONS?.TEMPLATE || {}).map(([key, label]) => (
                <Option key={key} value={FORM.TEMPLATE_MAP?.[label] ?? label}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="startDate" label={FORM.LABEL?.START_DATE}>
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              placeholder={FORM.PLACEHOLDER?.DATE}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="endDate" label={FORM.LABEL?.END_DATE}>
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              placeholder={FORM.PLACEHOLDER?.DATE}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

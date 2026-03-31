import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

import { USER_ROLE } from '@/constants/common/enums';
import { INTERN_GROUP_STATUS } from '@/constants/project-management/project-management';

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

        {/* AC-08: Hides field if mentor has no active groups and project is unassigned */}
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.internshipGroupId !== currentValues.internshipGroupId
            }
          >
            {({ getFieldValue }) => {
              const groupId = getFieldValue('internshipGroupId');
              const group = groups.find((g) => (g.internshipId || g.id) === groupId);

              const showGroup =
                (groups &&
                  groups.length > 0 &&
                  groups.some((g) => (g.status || g.groupStatus) === INTERN_GROUP_STATUS.ACTIVE)) ||
                (editingRecord &&
                  (editingRecord.internshipId ||
                    editingRecord.internshipGroupId ||
                    editingRecord.groupId));

              if (!showGroup) return null;

              return (
                <Form.Item
                  name="internshipGroupId"
                  label={FORM.LABEL?.GROUP}
                  rules={[{ required: false }]}
                  extra={
                    groupId && editingRecord ? (
                      <span className="text-[10px] text-primary/60 italic font-medium">
                        {FORM.LABEL?.PHASE || 'Phase:'}{' '}
                        {group?.phaseName || FORM.LABEL?.N_A || 'N/A'} (
                        {group?.startDate ? new Date(group.startDate).toLocaleDateString() : '?'} -{' '}
                        {group?.endDate ? new Date(group.endDate).toLocaleDateString() : '?'})
                      </span>
                    ) : !editingRecord ? null : (
                      FORM.VALIDATION?.GROUP_MUST_SELECT
                    )
                  }
                >
                  <Select placeholder={FORM.PLACEHOLDER?.GROUP} allowClear>
                    {groups
                      .filter((g) => {
                        const gStatus = g.status || g.groupStatus;
                        const isActive = gStatus === INTERN_GROUP_STATUS.ACTIVE;
                        const isCurrentGroup =
                          editingRecord?.internshipGroupId === g.id ||
                          editingRecord?.internshipId === g.id;

                        if (!isActive && !isCurrentGroup) return false;

                        const userRoleId = userInfo?.roleId || userInfo?.RoleId;
                        if (userRoleId === USER_ROLE.MENTOR) {
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
              );
            }}
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

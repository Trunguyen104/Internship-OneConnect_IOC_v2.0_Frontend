import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_MENTORS } from '../constants/groupData';

const { Text } = Typography;

const SimpleDetailItem = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <Text className="font-mono text-[9px] font-black tracking-widest uppercase opacity-40">
      {label}
    </Text>
    <div className="text-text text-[13px] font-bold">{value}</div>
  </div>
);

export const ViewGroupModal = memo(({ open, group, onCancel }) => {
  const { VIEW } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;
  if (!group) return null;

  const mentor = MOCK_MENTORS.find((m) => m.id === group.mentorId);

  return (
    <CompoundModal open={open} onCancel={onCancel} width={500} destroyOnHidden footer={null}>
      <CompoundModal.Header
        icon={<TeamOutlined />}
        title={group.name}
        subtitle={group.track || VIEW.DEFAULT_SUBTITLE}
      />

      <div className="px-10 py-8">
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <SimpleDetailItem label={VIEW.TRACK} value={group.track || VIEW.NOT_ASSIGNED} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem
              label={VIEW.STATUS}
              value={
                <Tag
                  color={group.status === 'ACTIVE' ? 'success' : 'default'}
                  className="line-height-none m-0 border-none px-2 py-0 text-[10px] font-black tracking-widest uppercase"
                >
                  {INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT[group.status] || group.status}
                </Tag>
              }
            />
          </Col>
          <Col span={12}>
            <SimpleDetailItem label={VIEW.TERM} value={group.term || VIEW.NOT_ASSIGNED} />
          </Col>
          <Col span={12}>
            <SimpleDetailItem
              label={VIEW.TOTAL_MEMBERS}
              value={`${group.memberCount} ${VIEW.STUDENTS_SUFFIX}`}
            />
          </Col>
          <Col span={12}>
            <SimpleDetailItem
              label={VIEW.MENTOR}
              value={mentor ? mentor.name : VIEW.NOT_ASSIGNED}
            />
          </Col>
          <Col span={12}>
            <SimpleDetailItem
              label={VIEW.PROJECT_NAME}
              value={group.project || VIEW.NOT_ASSIGNED}
            />
          </Col>

          {group.memberCount > 0 && (
            <Col span={24}>
              <div className="flex flex-col gap-2 pt-2">
                <Text className="font-mono text-[9px] font-black tracking-widest uppercase opacity-40">
                  {VIEW.MEMBERS}
                </Text>
                <Avatar.Group max={{ count: 10 }} size="small">
                  {(group.avatars || []).map((url, i) => (
                    <Avatar key={i} src={url} className="border-surface border-2 shadow-sm" />
                  ))}
                  {(!group.avatars || group.avatars.length === 0) && (
                    <Avatar icon={<UserOutlined />} className="bg-muted/10 text-muted" />
                  )}
                </Avatar.Group>
              </div>
            </Col>
          )}
        </Row>

        <CompoundModal.Footer
          cancelText={VIEW.CLOSE}
          onCancel={onCancel}
          confirmText={null}
          className="mt-10 border-none pt-0"
        />
      </div>
    </CompoundModal>
  );
});

import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Descriptions, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';

import { ENTERPRISE_GROUP_UI, GROUP_STATUS_MAP } from '../constants/enterprise-group.constants';

const { Text } = Typography;

export const ViewGroupModal = memo(({ open, group, onCancel }) => {
  const {
    MODALS: { VIEW },
  } = ENTERPRISE_GROUP_UI;
  if (!group) return null;

  const items = [
    {
      key: 'track',
      label: VIEW.TRACK,
      children: group.track || VIEW.NOT_ASSIGNED,
    },
    {
      key: 'status',
      label: VIEW.STATUS,
      children: (
        <Tag
          color={group.status === 0 ? 'success' : 'default'}
          className="m-0 border-none px-2 py-0 text-[10px] font-black tracking-widest uppercase"
        >
          {ENTERPRISE_GROUP_UI.STATUS[
            GROUP_STATUS_MAP[group.status] === 'InProgress'
              ? 'IN_PROGRESS'
              : GROUP_STATUS_MAP[group.status]?.toUpperCase()
          ] || group.status}
        </Tag>
      ),
    },
    {
      key: 'term',
      label: VIEW.TERM,
      children: group.term || VIEW.NOT_ASSIGNED,
    },
    {
      key: 'total_members',
      label: VIEW.TOTAL_MEMBERS,
      children: `${group.memberCount} ${VIEW.STUDENTS_SUFFIX}`,
    },
    {
      key: 'mentor',
      label: VIEW.MENTOR,
      children: group.mentorName || VIEW.NOT_ASSIGNED,
    },
    {
      key: 'project',
      label: VIEW.PROJECT_NAME,
      children: group.project || VIEW.NOT_ASSIGNED,
    },
  ];

  return (
    <CompoundModal open={open} onCancel={onCancel} width={520} destroyOnHidden footer={null}>
      <CompoundModal.Header
        icon={<TeamOutlined />}
        title={group.name}
        subtitle={group.track || VIEW.DEFAULT_SUBTITLE}
      />

      <div className="px-8 py-6">
        <Descriptions
          items={items}
          column={1}
          size="small"
          bordered={false}
          labelStyle={{
            width: '140px',
            color: 'var(--muted)',
            fontWeight: '600',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            paddingBottom: '12px',
          }}
          contentStyle={{
            color: 'var(--text)',
            fontWeight: '700',
            fontSize: '13px',
            paddingBottom: '12px',
          }}
        />

        {group.memberCount > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t pt-6">
            <Text className="text-muted text-[11px] font-semibold tracking-wider uppercase">
              {VIEW.MEMBERS}
            </Text>
            <Avatar.Group max={{ count: 12 }} size="small">
              {(group.avatars || []).map((url, i) => (
                <Avatar key={i} src={url} className="border-surface border-2 shadow-sm" />
              ))}
              {(!group.avatars || group.avatars.length === 0) && (
                <Avatar icon={<UserOutlined />} className="bg-muted/10 text-muted" />
              )}
            </Avatar.Group>
          </div>
        )}
      </div>
    </CompoundModal>
  );
});
ViewGroupModal.displayName = 'ViewGroupModal';

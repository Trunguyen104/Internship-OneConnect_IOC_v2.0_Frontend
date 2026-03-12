'use client';

import React from 'react';
import { Card, Button, Avatar, Tag, Typography, Tooltip, Space } from 'antd';
import { CodeOutlined, DeleteOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { MOCK_MENTORS } from '../constants/groupData';

const { Title, Text } = Typography;

export function GroupCard({ group, onAssign, onDelete, onView }) {
  const mentor = MOCK_MENTORS.find((m) => m.id === group.mentorId);
  const isArchived = group.status === 'ARCHIVED';

  return (
    <Card
      key={group.id}
      hoverable
      style={{
        borderRadius: 20,
        opacity: isArchived ? 0.7 : 1,
      }}
      actions={[
        <Button key='assign' type='primary' disabled={isArchived} onClick={() => onAssign(group)}>
          {mentor ? 'Change Mentor' : 'Assign Mentor'}
        </Button>,
        <Button key='view' type='link' onClick={() => onView(group)}>
          {isArchived ? 'View Archive' : 'View Details'}
        </Button>,
      ]}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <CodeOutlined style={{ fontSize: 22 }} />

        <Space>
          <Tag color={group.status === 'ACTIVE' ? 'green' : 'default'}>{group.status}</Tag>

          <Tooltip title='Delete Group'>
            <Button danger type='text' icon={<DeleteOutlined />} onClick={() => onDelete(group)} />
          </Tooltip>
        </Space>
      </Space>

      <Title level={4} style={{ marginTop: 16 }}>
        {group.name}
      </Title>

      <Space>
        {mentor ? <UserOutlined /> : <PlusOutlined />}
        <Text>
          Mentor: <Text strong>{mentor?.name || 'Not Assigned'}</Text>
        </Text>
      </Space>

      <div style={{ marginTop: 20 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Avatar.Group maxCount={4}>
            {(group.avatars || []).map((url, i) => (
              <Avatar key={i} src={url} />
            ))}
          </Avatar.Group>

          <Text type='secondary'>{group.memberCount} members</Text>
        </Space>
      </div>
    </Card>
  );
}

'use client';

import React from 'react';
import { Modal, Avatar, Divider, Space, Descriptions } from 'antd';

export function ViewGroupModal({ open, group, onCancel }) {
  return (
    <Modal
      title={`Group Details: ${group?.name}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <Descriptions column={1} bordered size='small'>
        <Descriptions.Item label='Track'>{group?.track}</Descriptions.Item>

        <Descriptions.Item label='Status'>{group?.status}</Descriptions.Item>

        <Descriptions.Item label='Members'>{group?.memberCount}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Space wrap>
        {(group?.avatars || []).map((url, i) => (
          <Avatar key={i} src={url} size='large' />
        ))}
      </Space>
    </Modal>
  );
}

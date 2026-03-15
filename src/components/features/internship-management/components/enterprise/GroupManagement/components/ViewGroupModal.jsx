'use client';

import React from 'react';
import { Modal, Avatar, Divider, Space, Tag, Typography } from 'antd';
import {
  InfoCircleOutlined,
  TeamOutlined,
  ProfileOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title, Text } = Typography;

export function ViewGroupModal({ open, group, onCancel }) {
  const { VIEW } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='bg-surface relative flex flex-col p-2'>
        {/* Header Section */}
        <div className='mb-6 flex flex-col items-center gap-3 text-center'>
          <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
            <InfoCircleOutlined className='text-primary text-3xl' />
          </div>
          <div className='mb-2'>
            <Title level={4} className='text-text mb-1'>
              {VIEW.TITLE} {group?.name}
            </Title>
            <Tag
              color={group?.status === 'ACTIVE' ? 'success' : 'default'}
              className='border-none px-4 py-1 text-[10px] font-black tracking-widest uppercase'
            >
              {group?.status}
            </Tag>
          </div>
        </div>

        <Divider className='border-border m-0' />

        {/* Details Grid */}
        <div className='grid grid-cols-1 gap-6 py-8 md:grid-cols-2'>
          <div className='flex items-start gap-4'>
            <div className='bg-info/10 flex size-10 shrink-0 items-center justify-center rounded-xl'>
              <ProfileOutlined className='text-info text-lg' />
            </div>
            <div className='flex flex-col'>
              <Text className='text-muted text-xs font-bold tracking-wider uppercase'>
                {VIEW.TRACK}
              </Text>
              <Text className='text-text text-base font-semibold'>{group?.track}</Text>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <div className='bg-success/10 flex size-10 shrink-0 items-center justify-center rounded-xl'>
              <TeamOutlined className='text-success text-lg' />
            </div>
            <div className='flex flex-col'>
              <Text className='text-muted text-xs font-bold tracking-wider uppercase'>
                {VIEW.MEMBERS}
              </Text>
              <Text className='text-text text-base font-semibold'>
                {group?.memberCount} Thành viên
              </Text>
            </div>
          </div>
        </div>

        <Divider className='border-border m-0'>
          <span className='text-muted bg-surface px-4 text-xs font-bold tracking-widest uppercase'>
            Danh sách thành viên
          </span>
        </Divider>

        {/* Members List (Avatars) */}
        <div className='premium-scrollbar mt-6 max-h-[200px] overflow-y-auto px-2 pb-4'>
          {group?.memberCount > 0 ? (
            <div className='flex flex-wrap justify-center gap-4'>
              {(group?.avatars || []).map((url, i) => (
                <div key={i} className='group relative'>
                  <Avatar
                    src={url}
                    size={64}
                    className='border-surface ring-border border-4 shadow-md ring-1 transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
              ))}
              {(!group?.avatars || group?.avatars.length === 0) && (
                <div className='flex flex-col items-center gap-3 py-6'>
                  <TeamOutlined className='text-muted text-4xl opacity-20' />
                  <Text className='text-muted italic'>
                    Dữ liệu thành viên đang được cập nhật...
                  </Text>
                </div>
              )}
            </div>
          ) : (
            <div className='flex flex-col items-center gap-3 py-10'>
              <TeamOutlined className='text-muted text-5xl opacity-10' />
              <Text className='text-muted italic'>Nhóm chưa có thành viên nào</Text>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className='bg-muted/5 -mx-8 mt-4 -mb-4 py-4 text-center'>
          <Text className='text-muted text-[11px] font-medium italic'>
            Đang hiển thị thông tin chi tiết của nhóm thực tập
          </Text>
        </div>
      </div>
    </Modal>
  );
}

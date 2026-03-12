'use client';
import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TermStatusModal = ({ open, onCancel, onConfirm, record, newStatus }) => {
  const isOpening = newStatus === 1;

  const title = isOpening ? 'Mở Kỳ thực tập?' : 'Đóng Kỳ thực tập?';
  const confirmText = isOpening ? 'Xác nhận mở' : 'Xác nhận đóng';

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={420} title={null}>
      <Space
        direction='vertical'
        align='center'
        style={{ width: '100%', textAlign: 'center' }}
        size='large'
      >
        {isOpening ? (
          <InfoCircleOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        ) : (
          <WarningOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
        )}

        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>

        <Text type='secondary'>
          {isOpening ? (
            <>
              Bạn có chắc muốn chuyển <b>{`"${record?.name}"`}</b> sang trạng thái <b>Đang mở</b>?
            </>
          ) : (
            <>
              Bạn có chắc muốn <b>đóng</b> kỳ thực tập <b>{`"${record?.name}"`}</b>? Sau khi đóng,
              cấu hình sẽ bị khóa.
            </>
          )}
        </Text>

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type='primary' danger={!isOpening} onClick={onConfirm}>
            {confirmText}
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default TermStatusModal;

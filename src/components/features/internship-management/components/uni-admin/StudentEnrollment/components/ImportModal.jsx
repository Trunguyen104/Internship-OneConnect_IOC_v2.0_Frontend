'use client';

import React, { memo, useState } from 'react';
import { Modal, Button, Upload, Table, Tooltip, Typography, Space, Divider, Tag } from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';

const { Dragger } = Upload;
const { Text, Title } = Typography;

const ImportModal = memo(function ImportModal({ visible, onClose, onImport }) {
  const { IMPORT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.STUDENT_ENROLLMENT.MODALS;
  const [previewData, setPreviewData] = useState([]);

  const uploadProps = {
    multiple: false,
    beforeUpload(file) {
      handlePreview(file);
      return false;
    },
  };

  const handlePreview = (file) => {
    // Mock preview data
    setPreviewData([
      {
        id: '1',
        name: 'Nguyễn Văn A',
        studentId: 'ST010',
        email: 'anvan@university.edu',
        valid: true,
      },
      {
        id: '2',
        name: 'Lê Thị B',
        studentId: '---',
        email: 'btle@university.edu',
        valid: false,
        error: 'Thiếu MSSV',
      },
    ]);
  };

  const previewColumns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      render: (text) => <Text className='text-sm font-bold'>{text}</Text>,
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      render: (text) => <Text className='font-mono text-xs'>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => <Text className='text-muted text-xs'>{text}</Text>,
    },
    {
      title: 'Hợp lệ',
      align: 'center',
      width: 80,
      render: (_, record) =>
        record.valid ? (
          <Tooltip title='Hợp lệ'>
            <CheckCircleOutlined className='text-success text-lg' />
          </Tooltip>
        ) : (
          <Tooltip title={record.error}>
            <ExclamationCircleOutlined className='text-danger text-lg' />
          </Tooltip>
        ),
    },
  ];

  const validCount = previewData.filter((s) => s.valid).length;
  const invalidCount = previewData.length - validCount;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={720}
      footer={null}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <FileExcelOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {IMPORT.TITLE}
          </Title>
          <Text className='text-muted text-xs'>
            Tải lên danh sách sinh viên tham gia đợt thực tập này
          </Text>
        </div>
      </div>

      <Divider className='border-border my-6' />

      <Dragger
        {...uploadProps}
        className='bg-muted/5 border-border hover:border-primary over:bg-muted/10 group mb-6 rounded-2xl border-2 border-dashed transition-all'
      >
        <div className='py-8'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110'>
            <UploadOutlined className='text-primary text-3xl' />
          </div>
          <p className='text-text text-lg font-bold'>{IMPORT.DRAG_TEXT}</p>
          <p className='text-muted text-sm'>{IMPORT.HINT_TEXT}</p>

          <Button
            icon={<DownloadOutlined />}
            type='link'
            className='text-primary mt-4 font-semibold'
          >
            {IMPORT.DOWNLOAD_TEMPLATE}
          </Button>
        </div>
      </Dragger>

      {previewData.length > 0 && (
        <div className='animate-in fade-in slide-in-from-bottom-4 mt-8 duration-500'>
          <div className='mb-4 flex items-center justify-between'>
            <Text className='text-text text-sm font-bold tracking-wider uppercase'>
              Xem trước dữ liệu
            </Text>
            <Space className='text-xs'>
              <Tag color='success' className='border-none px-3 font-bold uppercase'>
                {validCount} Hợp lệ
              </Tag>
              <Tag color='error' className='border-none px-3 font-bold uppercase'>
                {invalidCount} Lỗi
              </Tag>
            </Space>
          </div>

          <div className='border-border overflow-hidden rounded-xl border'>
            <Table
              dataSource={previewData}
              columns={previewColumns}
              pagination={false}
              rowKey='id'
              size='middle'
              className='custom-table'
            />
          </div>

          <div className='mt-8 flex justify-end gap-3'>
            <Button
              onClick={onClose}
              className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
            >
              {IMPORT.CANCEL}
            </Button>

            <Button
              type='primary'
              disabled={validCount === 0}
              onClick={() => onImport?.(previewData)}
              className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50'
            >
              {IMPORT.SUBMIT}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
});

export default ImportModal;

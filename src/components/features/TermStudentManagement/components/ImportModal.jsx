'use client';

import React, { memo, useState } from 'react';
import { Upload, Table, Tooltip, Tag, Button, Space } from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import CompoundModal from '@/components/ui/CompoundModal';

const { Dragger } = Upload;

const ImportModal = memo(function ImportModal({ visible, onClose, onImport, loading }) {
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
      render: (text) => <span className='text-sm font-bold'>{text}</span>,
    },
    {
      title: 'MSSV',
      dataIndex: 'studentId',
      render: (text) => <span className='font-mono text-xs'>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => <span className='text-muted text-xs'>{text}</span>,
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
    <CompoundModal open={visible} onCancel={onClose} width={720} destroyOnClose>
      <CompoundModal.Header title={IMPORT.TITLE} subtitle={IMPORT.SUBTITLE} />

      <CompoundModal.Content>
        <Dragger
          {...uploadProps}
          className='bg-muted/5 border-border hover:border-primary group mb-6 rounded-2xl border-2 border-dashed transition-all'
          disabled={loading}
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
              <span className='text-text text-sm font-bold tracking-wider uppercase'>
                {IMPORT.PREVIEW_TITLE}
              </span>
              <Space className='text-xs'>
                <Tag color='success' className='border-none px-3 font-bold uppercase'>
                  {validCount} {IMPORT.VALID_TAG}
                </Tag>
                <Tag color='error' className='border-none px-3 font-bold uppercase'>
                  {invalidCount} {IMPORT.INVALID_TAG}
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
          </div>
        )}
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onClose}
        onConfirm={() => onImport?.(previewData)}
        loading={loading}
        confirmDisabled={validCount === 0}
        confirmText={IMPORT.SUBMIT}
        confirmIcon={<FileExcelOutlined />}
      />
    </CompoundModal>
  );
});

export default ImportModal;

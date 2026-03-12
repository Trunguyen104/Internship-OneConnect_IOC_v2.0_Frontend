'use client';

import React, { memo, useState } from 'react';
import { Modal, Button, Upload, Table, Tooltip, message } from 'antd';
import { UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const ImportModal = memo(function ImportModal({ visible, onClose, onImport }) {
  const [previewData, setPreviewData] = useState([]);

  const uploadProps = {
    multiple: false,

    beforeUpload(file) {
      handlePreview(file);
      return false;
    },
  };

  const handlePreview = (file) => {
    message.info(`Previewing ${file.name}`);

    setPreviewData([
      {
        id: '1',
        name: 'Michael Jordan',
        studentId: 'ST010',
        email: 'm.j@edu.com',
        valid: true,
      },
      {
        id: '2',
        name: 'Sarah Connor',
        studentId: '---',
        email: 's.connor@edu.com',
        valid: false,
        error: 'Missing ID',
      },
    ]);
  };

  const previewColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <span className='font-medium text-slate-600'>{text}</span>,
    },
    {
      title: 'ID',
      dataIndex: 'studentId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      align: 'center',
      render: (_, record) =>
        record.valid ? (
          <Tooltip title='Valid'>
            <CheckCircleOutlined className='text-green-500' />
          </Tooltip>
        ) : (
          <Tooltip title={record.error}>
            <ExclamationCircleOutlined className='text-red-500' />
          </Tooltip>
        ),
    },
  ];

  const validCount = previewData.filter((s) => s.valid).length;
  const invalidCount = previewData.length - validCount;

  return (
    <Modal title='Import Students' open={visible} onCancel={onClose} width={720} footer={null}>
      <Dragger {...uploadProps} className='mb-6 rounded-xl'>
        <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
          <UploadOutlined className='text-primary text-3xl' />
        </div>

        <p className='text-lg font-bold text-slate-900'>Drag & Drop Excel File</p>

        <p className='text-sm text-slate-500'>or click to browse from your computer</p>

        <Button className='mt-4'>Select File</Button>
      </Dragger>

      {previewData.length > 0 && (
        <>
          <div className='mb-3 text-sm text-slate-500'>
            ✔ {validCount} valid — ✖ {invalidCount} invalid
          </div>

          <Table
            dataSource={previewData}
            columns={previewColumns}
            pagination={false}
            rowKey='id'
            size='middle'
          />

          <div className='mt-6 flex justify-end gap-3'>
            <Button onClick={onClose}>Cancel</Button>

            <Button
              type='primary'
              disabled={validCount === 0}
              onClick={() => onImport?.(previewData)}
            >
              Confirm Import
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
});

export default ImportModal;

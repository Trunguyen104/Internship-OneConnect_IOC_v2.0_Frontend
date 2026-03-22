'use client';

import {
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Table, Tag, Tooltip, Upload } from 'antd';
import { useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { useToast } from '@/providers/ToastProvider';

const { Dragger } = Upload;

export default function ImportModal({
  visible,
  onCancel,
  onImport,
  onPreview,
  onDownloadTemplate,
  loading,
}) {
  const toast = useToast();
  const [previewData, setPreviewData] = useState([]);

  const beforeUpload = async (file) => {
    if (file.size / 1024 / 1024 > 5) {
      toast.error('File must be < 5MB');
      return false;
    }

    try {
      const data = await onPreview?.(file);
      setPreviewData(data?.previewData || []);
    } catch {
      setPreviewData([]);
    }

    return false;
  };

  const columns = [
    { title: 'Full Name', dataIndex: 'fullName' },
    { title: 'Student ID', dataIndex: 'studentCode' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Validity',
      align: 'center',
      render: (_, r) =>
        r.isValid ? (
          <Tooltip title="Valid">
            <CheckCircleOutlined style={{ color: 'green' }} />
          </Tooltip>
        ) : (
          <Tooltip title={r.errors?.join(', ')}>
            <ExclamationCircleOutlined style={{ color: 'red' }} />
          </Tooltip>
        ),
    },
  ];

  const valid = previewData.filter((x) => x.isValid).length;
  const invalid = previewData.length - valid;

  return (
    <CompoundModal open={visible} onCancel={onCancel} width={520}>
      <CompoundModal.Header
        title="Import Student List"
        subtitle="Upload student list to enroll them"
      />

      <CompoundModal.Content>
        <Button icon={<DownloadOutlined />} type="link" onClick={onDownloadTemplate}>
          Download template
        </Button>

        <Dragger beforeUpload={beforeUpload} disabled={loading}>
          <UploadOutlined style={{ fontSize: 28 }} />
          <p>Drag file here or click to upload (.xls, .xlsx)</p>
        </Dragger>

        {previewData.length > 0 && (
          <>
            <div style={{ margin: '10px 0' }}>
              <Tag color="green">{valid} VALID</Tag>
              <Tag color="red">{invalid} ERROR</Tag>
            </div>

            <Table
              dataSource={previewData}
              columns={columns}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </>
        )}
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={() => onImport?.(previewData.filter((r) => r.isValid))}
        confirmDisabled={!valid}
        loading={loading}
      />
    </CompoundModal>
  );
}

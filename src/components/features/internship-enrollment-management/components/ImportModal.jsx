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
import { UI_TEXT } from '@/lib/UI_Text';
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
      toast.error(UI_TEXT.ENROLLMENT.FILE_SIZE_ERROR(5));
      return false;
    }
  };

  const handlePreview = async (file) => {
    if (!onPreview) return;
    setPreviewData([]);

    try {
      const data = await onPreview(file);
      if (data) {
        setPreviewData(data.previewData || []);
      }
    } catch {
      // Error is already toasted by the hook
    }

    return false;
  };

  const columns = [
    { title: UI_TEXT.ENROLLMENT.COLUMNS.FULL_NAME, dataIndex: 'fullName' },
    { title: UI_TEXT.ENROLLMENT.COLUMNS.STUDENT_ID, dataIndex: 'studentCode' },
    { title: UI_TEXT.ENROLLMENT.COLUMNS.EMAIL, dataIndex: 'email' },
    {
      title: UI_TEXT.ENROLLMENT.COLUMNS.VALIDITY,
      align: 'center',
      render: (_, r) =>
        r.isValid ? (
          <Tooltip title={UI_TEXT.ENROLLMENT.TOOLTIP_VALID}>
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
        title={UI_TEXT.ENROLLMENT.IMPORT_TITLE}
        subtitle={UI_TEXT.ENROLLMENT.IMPORT_SUBTITLE}
      />

      <CompoundModal.Content>
        <Button icon={<DownloadOutlined />} type="link" onClick={onDownloadTemplate}>
          {UI_TEXT.ENROLLMENT.DOWNLOAD_TEMPLATE}
        </Button>

        <Dragger beforeUpload={beforeUpload} handlePreview={handlePreview} disabled={loading}>
          <UploadOutlined style={{ fontSize: 28 }} />
          <p>{UI_TEXT.ENROLLMENT.DRAG_HINT}</p>
        </Dragger>

        {previewData.length > 0 && (
          <>
            <div style={{ margin: '10px 0' }}>
              <Tag color="green">
                {valid} {UI_TEXT.ENROLLMENT.VALID}
              </Tag>
              <Tag color="red">
                {invalid} {UI_TEXT.ENROLLMENT.ERROR}
              </Tag>
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

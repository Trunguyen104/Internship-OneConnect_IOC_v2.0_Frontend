'use client';

import {
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip, Upload } from 'antd';
import React, { memo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { useToast } from '@/providers/ToastProvider';

import { STUDENT_ENROLLMENT } from '../constants/enrollment';

const { Dragger } = Upload;

const ImportModal = memo(function ImportModal({
  visible,
  onCancel,
  onImport,
  onPreview,
  onDownloadTemplate,
  loading,
}) {
  const toast = useToast();
  const { IMPORT } = STUDENT_ENROLLMENT.MODALS;
  const [previewData, setPreviewData] = useState([]);
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    multiple: false,
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error(IMPORT.VALIDATION.FILE_SIZE_LIMIT);
        return false;
      }
      handlePreview(file);
      return false;
    },
  };

  const handlePreview = async (file) => {
    if (!onPreview) return;
    setPreviewData([]);
    setFileList([file]);

    try {
      const data = await onPreview(file);
      if (data) {
        setPreviewData(data.previewData || []);
      }
    } catch (error) {
      setFileList([]);
      // Error is already toasted by the hook
    }
  };

  const previewColumns = [
    {
      title: IMPORT.PREVIEW_COLUMNS.FULL_NAME,
      dataIndex: 'fullName',
      render: (text) => <span className="text-sm font-bold">{text}</span>,
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.STUDENT_ID,
      dataIndex: 'studentCode',
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.EMAIL,
      dataIndex: 'email',
      render: (text) => <span className="text-muted text-xs">{text}</span>,
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.VALIDITY,
      align: 'center',
      width: 80,
      render: (_, record) =>
        record.isValid ? (
          <Tooltip title={IMPORT.TOOLTIPS.VALID}>
            <CheckCircleOutlined className="text-success text-lg" />
          </Tooltip>
        ) : (
          <Tooltip title={record.errors?.join(', ') || IMPORT.TOOLTIPS.ERROR}>
            <ExclamationCircleOutlined className="text-danger text-lg" />
          </Tooltip>
        ),
    },
  ];

  const validCount = previewData.filter((s) => s.isValid).length;
  const invalidCount = previewData.length - validCount;

  return (
    <CompoundModal open={visible} onCancel={onCancel} width={540} destroyOnClose>
      <CompoundModal.Header title={IMPORT.TITLE} subtitle={IMPORT.SUBTITLE} />

      <CompoundModal.Content>
        {/* Preparation Banner */}
        <div className="bg-primary/5 mb-6 flex items-center justify-between rounded-xl border border-primary/10 p-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <FileExcelOutlined className="text-primary text-base" />
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                {IMPORT.PREPARATION_TITLE}
              </span>
              <span className="text-muted text-[11px]">{IMPORT.PREPARATION_HINT}</span>
            </div>
          </div>
          <Button
            icon={<DownloadOutlined />}
            type="link"
            size="small"
            className="text-primary font-bold"
            onClick={onDownloadTemplate}
          >
            {IMPORT.DOWNLOAD_TEMPLATE}
          </Button>
        </div>

        <Dragger
          {...uploadProps}
          className="bg-muted/5 border-border hover:border-primary group mb-6 rounded-2xl border-2 border-dashed transition-all"
          disabled={loading}
        >
          <div className="py-6">
            <div className="bg-primary/10 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
              <UploadOutlined className="text-primary text-2xl" />
            </div>
            <p className="text-text text-base font-bold">{IMPORT.DRAG_TEXT}</p>
            <p className="text-muted text-[11px]">{IMPORT.HINT_TEXT}</p>
          </div>
        </Dragger>

        {previewData.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 mt-8 duration-500">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-text text-[11px] font-bold tracking-wider uppercase">
                {IMPORT.PREVIEW_TITLE}
              </span>
              <Space className="text-xs">
                <Tag color="success" className="border-none px-3 font-bold uppercase">
                  {validCount} {IMPORT.VALID_TAG}
                </Tag>
                <Tag color="error" className="border-none px-3 font-bold uppercase">
                  {invalidCount} {IMPORT.INVALID_TAG}
                </Tag>
              </Space>
            </div>

            <div className="border-border overflow-hidden rounded-xl border">
              <Table
                dataSource={previewData}
                columns={previewColumns}
                pagination={false}
                rowKey="id"
                size="small"
                className="custom-table"
              />
            </div>
          </div>
        )}
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={() => onImport?.(previewData.filter((r) => r.isValid))}
        loading={loading}
        confirmDisabled={validCount === 0}
        confirmText={IMPORT.SUBMIT}
        confirmIcon={<FileExcelOutlined />}
      />
    </CompoundModal>
  );
});

export default ImportModal;

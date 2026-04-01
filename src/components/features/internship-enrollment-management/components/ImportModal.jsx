'use client';

import { CloudUploadOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useState } from 'react';

import Badge from '@/components/ui/badge';
import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ImportPreviewTable } from './ImportPreviewTable';

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
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MODALS, MESSAGES } = ENROLLMENT_MANAGEMENT;
  const { IMPORT } = MODALS;

  const [previewData, setPreviewData] = useState([]);

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 5) {
      toast.error(IMPORT.VALIDATION.FILE_SIZE_LIMIT);
      return false;
    }
    handlePreview(file);
    return false; // Prevent auto upload
  };

  const handlePreview = async (file) => {
    if (!onPreview) return;
    setPreviewData([]);

    try {
      const data = await onPreview?.(file);
      const processed = (data?.previewData || []).map((row, idx) => ({
        ...row,
        id: row.id || row.studentCode || `preview-${idx}`,
      }));
      setPreviewData(processed);
    } catch {
      // Error is already toasted by the hook
    }
  };

  const validCount = previewData.filter((x) => x.isValid).length;
  const invalidCount = previewData.length - validCount;

  return (
    <CompoundModal open={visible} onCancel={onCancel} width={900}>
      <CompoundModal.Header
        title={IMPORT.TITLE}
        subtitle={IMPORT.SUBTITLE}
        icon={<CloudUploadOutlined />}
      />

      <CompoundModal.Content className="!pb-0">
        <div className="custom-scrollbar max-h-[65vh] overflow-y-auto pr-2 pb-4">
          <div className="flex flex-col gap-4">
            <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3">
              <div className="flex flex-col">
                <span className="text-text text-xs font-bold leading-tight">
                  {IMPORT.PREPARATION_TITLE}
                </span>
                <span className="text-muted text-[10px] opacity-70">{IMPORT.PREPARATION_HINT}</span>
              </div>
              <Button
                icon={<DownloadOutlined className="text-xs" />}
                type="primary"
                ghost
                onClick={onDownloadTemplate}
                className="!h-8 !rounded-lg !border-primary/30 !px-3 !text-[10px] !font-bold"
              >
                {IMPORT.DOWNLOAD_TEMPLATE}
              </Button>
            </div>

            <Dragger
              beforeUpload={beforeUpload}
              onRemove={() => setPreviewData([])}
              disabled={loading}
              maxCount={1}
              className="!bg-gray-50/20 hover:!bg-white !rounded-2xl !border-2 !border-dashed !border-gray-100 hover:!border-primary/30 transition-all !p-4"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/5 text-primary flex size-10 items-center justify-center rounded-xl">
                  <UploadOutlined className="text-lg" />
                </div>
                <div className="flex flex-col text-center">
                  <p className="text-text mb-0 text-xs font-bold leading-tight">
                    {IMPORT.DRAG_TEXT}
                  </p>
                  <p className="text-muted mb-0 text-[10px] opacity-60">{IMPORT.HINT_TEXT}</p>
                </div>
              </div>
            </Dragger>

            {previewData.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-1 space-y-3 duration-300">
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">
                    {validCount} {IMPORT.VALID_TAG}
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="danger" className="text-[10px]">
                      {invalidCount} {IMPORT.INVALID_TAG}
                    </Badge>
                  )}
                </div>

                <ImportPreviewTable previewData={previewData} IMPORT={IMPORT} />
              </div>
            )}
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={() => onImport?.(previewData.filter((r) => r.isValid))}
        confirmDisabled={!validCount}
        loading={loading}
        confirmText={`${IMPORT.SUBMIT} (${validCount || 0})`}
        className="!mt-2"
      />
    </CompoundModal>
  );
}

'use client';

import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Tooltip, Upload } from 'antd';
import { useState } from 'react';

import Badge from '@/components/ui/badge';
import CompoundModal from '@/components/ui/CompoundModal';
import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { mapAntdColumnsToDataTable } from '@/lib/mapAntdTableColumns';
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
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MODALS } = ENROLLMENT_MANAGEMENT;
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

  const checkError = (record, field) => {
    if (record.isValid) return false;
    const errors = record.errors || [];
    const fieldKeywords = {
      studentCode: ['ID', 'Code', 'MSSV', 'mã'],
      fullName: ['Name', 'Full Name', 'Họ tên', 'tên'],
      email: ['Email'],
      phone: ['Phone', 'thoại', 'SĐT'],
      dateOfBirth: ['Birth', 'Ngày sinh', 'ngày sinh'],
      major: ['Major', 'ngành'],
    };
    const keywords = fieldKeywords[field] || [];
    return errors.some((err) =>
      keywords.some((kw) => err.toLowerCase().includes(kw.toLowerCase()))
    );
  };

  const translateError = (error) => {
    if (!error) return error;
    const mappings = {
      'Sinh viên với mã này đã được ghi danh vào kỳ thực tập hiện tại':
        'This student ID is already enrolled in the current term',
      'Mỗi sinh viên chỉ được đăng ký một lần trong cùng một kỳ':
        'Each student can only be registered once per term',
      'Sinh viên có email này đã được ghi danh vào kỳ thực tập hiện tại':
        'This email is already registered in the current term',
      'Mỗi email chỉ được đăng ký một lần trong cùng một kỳ':
        'Each email can only be registered once per term',
      'Email sinh viên không đúng định dạng': 'Invalid email format',
      'Mã sinh viên không được để trống': 'Student ID cannot be empty',
      'Họ tên không được để trống': 'Full name cannot be empty',
      'Không tìm thấy ngành': 'Major not found',
      'Định dạng ngày sinh không hợp lệ': 'Invalid date of birth format',
    };

    // Try exact or substring match
    return Object.entries(mappings).reduce((acc, [vn, en]) => {
      if (acc === vn) return en;
      // Partial replace for joined strings
      return acc.replace(vn, en);
    }, error);
  };

  const columns = [
    {
      title: IMPORT.PREVIEW_COLUMNS.FULL_NAME,
      dataIndex: 'fullName',
      render: (text, r) => (
        <span
          className="text-xs font-bold"
          style={{ color: checkError(r, 'fullName') ? 'var(--color-danger)' : 'var(--color-text)' }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.STUDENT_ID,
      dataIndex: 'studentCode',
      width: 100,
      render: (text, r) => (
        <span
          className="font-mono text-[10px] font-bold"
          style={{
            color: checkError(r, 'studentCode') ? 'var(--color-danger)' : 'var(--color-muted)',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.EMAIL,
      dataIndex: 'email',
      width: 150,
      render: (text, r) => (
        <span
          className="text-[10px]"
          style={{
            color: checkError(r, 'email') ? 'var(--color-danger)' : 'var(--color-muted)',
            fontWeight: checkError(r, 'email') ? 'bold' : 'normal',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.PHONE,
      dataIndex: 'phone',
      width: 100,
      render: (text, r) => (
        <span
          className="text-[10px]"
          style={{
            color: checkError(r, 'phone') ? 'var(--color-danger)' : 'var(--color-muted)',
            fontWeight: checkError(r, 'phone') ? 'bold' : 'normal',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.DOB,
      dataIndex: 'dateOfBirth',
      width: 100,
      render: (text, r) => (
        <span
          className="text-[10px]"
          style={{
            color: checkError(r, 'dateOfBirth') ? 'var(--color-danger)' : 'var(--color-muted)',
            fontWeight: checkError(r, 'dateOfBirth') ? 'bold' : 'normal',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.MAJOR,
      dataIndex: 'major',
      width: 120,
      render: (text, r) => (
        <span
          className="truncate text-[10px]"
          style={{
            color: checkError(r, 'major') ? 'var(--color-danger)' : 'var(--color-muted)',
            fontWeight: checkError(r, 'major') ? 'bold' : 'normal',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: IMPORT.PREVIEW_COLUMNS.VALIDITY,
      key: 'validity',
      align: 'center',
      width: 80,
      render: (_, r) =>
        r.isValid ? (
          <Tooltip title={IMPORT.TOOLTIP_VALID}>
            <CheckCircleOutlined style={{ color: 'var(--color-success)' }} className="text-xl" />
          </Tooltip>
        ) : (
          <Tooltip title={r.errors?.map(translateError).join(', ')}>
            <ExclamationCircleOutlined
              style={{ color: 'var(--color-danger)' }}
              className="text-xl"
            />
          </Tooltip>
        ),
    },
  ];

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

                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                  <DataTable
                    columns={mapAntdColumnsToDataTable(columns)}
                    data={previewData}
                    rowKey="id"
                    minWidth="800px"
                    size="small"
                  />
                </div>
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

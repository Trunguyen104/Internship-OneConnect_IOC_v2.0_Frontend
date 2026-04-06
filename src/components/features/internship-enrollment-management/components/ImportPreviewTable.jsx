import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import React from 'react';

export const ImportPreviewTable = ({ previewData, IMPORT }) => {
  const checkError = (record, field) => {
    if (record.isValid) return false;
    const errors = record.errors || [];
    const fieldKeywords = {
      studentCode: ['ID', 'Code', 'MSSV', 'mã'],
      fullName: ['Name', 'tên'],
      email: ['Email'],
      phone: ['Phone', 'thoại'],
      dateOfBirth: ['Birth', 'Ngày sinh'],
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
  // ... rest of the logic ...
  // ... rest of the logic should map errors ...

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
      align: 'center',
      width: 80,
      fixed: 'right',
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

  return (
    <Table
      dataSource={previewData}
      columns={columns}
      pagination={false}
      rowKey="id"
      size="small"
      scroll={{ x: 800 }}
      className="premium-table overflow-hidden !rounded-xl border border-gray-100 shadow-sm"
    />
  );
};

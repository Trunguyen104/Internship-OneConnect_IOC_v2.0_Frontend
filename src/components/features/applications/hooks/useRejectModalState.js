'use client';

import { useState } from 'react';

/**
 * Hook quản lý trạng thái nhập lý do từ chối hồ sơ.
 * @param {Function} onConfirm - Hàm gọi khi người dùng xác nhận từ chối.
 * @param {Function} onCancel - Hàm gọi khi người dùng hủy bỏ.
 * @returns {Object} Trạng thái lý do và các hàm xử lý.
 */
export const useRejectModalState = (onConfirm, onCancel) => {
  const [reason, setReason] = useState('');

  /** Xử lý khi nhấn nút Xác nhận trong Modal từ chối */
  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm({ rejectReason: reason.trim() });
    setReason('');
  };

  /** Xử lý khi nhấn nút Hủy bỏ */
  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return {
    reason,
    setReason,
    handleConfirm,
    handleCancel,
  };
};

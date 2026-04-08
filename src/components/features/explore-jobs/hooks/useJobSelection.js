'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

/**
 * Hook quản lý việc chọn công việc và hiển thị Modal ứng tuyển từ danh sách.
 * @param {Array} jobs - Danh sách các công việc.
 * @returns {Object} Trạng thái công việc được chọn và các hàm xử lý đóng/mở modal.
 */
export const useJobSelection = (jobs = []) => {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Xử lý khi nhấn vào thẻ Công việc.
   * Nếu yêu cầu ứng tuyển (isApplyRequested), sẽ mở Modal.
   * Ngược lại, sẽ chuyển hướng sang trang chi tiết.
   * @param {string} id - ID của công việc.
   * @param {boolean} isApplyRequested - Có yêu cầu mở modal ứng tuyển hay không.
   */
  const handleCardClick = (id, isApplyRequested) => {
    if (isApplyRequested) {
      setSelectedJobId(id);
      setIsModalOpen(true);
      return;
    }
    router.push(`/explore-jobs/${id}`);
  };

  /** Công việc đang được chọn hiện tại */
  const selectedJob = useMemo(
    () => jobs.find((j) => (j.jobId || j.id) === selectedJobId),
    [jobs, selectedJobId]
  );

  /** Đóng modal và reset job đang chọn */
  const closeSelectionModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  return {
    selectedJobId,
    selectedJob,
    isModalOpen,
    setIsModalOpen,
    handleCardClick,
    closeSelectionModal,
  };
};

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useExploreJobs, useJobDetail } from './useExploreJobs';

/**
 * Hook quản lý trạng thái và logic cho trang Chi tiết công việc.
 * @returns {Object} Chứa dữ liệu công việc, trạng thái loading, và các hàm xử lý ứng tuyển.
 */
export const useJobDetailState = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getEligibility, isApplying, applyJob, cvUrl, hasCV } = useExploreJobs();
  const { data: job, isLoading: isJobLoading } = useJobDetail(id);

  /** Kiểm tra điều kiện ứng tuyển của sinh viên đối với công việc này */
  const eligibility = job ? getEligibility(job.jobId) : { eligible: false };

  /** Xử lý khi người dùng nhấn nút Ứng tuyển */
  const handleApplyConfirm = async () => {
    if (!job) return;
    try {
      await applyJob({ jobId: job.jobId });
      setIsModalOpen(false);
    } catch {
      // Lỗi đã được xử lý bằng toast trong useExploreJobs
    }
  };

  /** Chuyển hướng quay lại danh sách công việc */
  const handleBack = () => {
    router.back();
  };

  /** Chuyển hướng đến trang danh sách nếu không tìm thấy job */
  const navigateToExplore = () => {
    router.push('/explore-jobs');
  };

  return {
    job,
    isLoading: isJobLoading,
    isModalOpen,
    setIsModalOpen,
    isApplying,
    cvUrl,
    hasCV,
    eligibility,
    handleApplyConfirm,
    handleBack,
    navigateToExplore,
  };
};

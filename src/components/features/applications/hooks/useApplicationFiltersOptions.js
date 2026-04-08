'use client';

import { useMemo } from 'react';

import {
  ACTIVE_STATUSES,
  APPLICATION_STATUS_CONFIG,
  TERMINAL_STATUSES,
} from '@/constants/applications/application.constants';

/**
 * Hook quản lý và chuyển đổi dữ liệu cho các tùy chọn bộ lọc (Trường học, Giai đoạn, Trạng thái).
 * @param {Object} params - Tham số đầu vào bao gồm bộ lọc hiện tại, danh sách trường và giai đoạn.
 * @returns {Object} Các tùy chọn bộ lọc đã được định dạng cho Antd Select.
 */
export const useApplicationFiltersOptions = ({ filters, schools = [], phases = [] }) => {
  /** Map dữ liệu trạng thái dựa trên việc có bao gồm trạng thái kết thúc hay không */
  const statusOptions = useMemo(() => {
    return Object.entries(APPLICATION_STATUS_CONFIG)
      .filter(([value]) => {
        const status = Number(value);
        if (filters.includeTerminal) {
          return TERMINAL_STATUSES.includes(status);
        }
        return ACTIVE_STATUSES.includes(status);
      })
      .map(([value, config]) => ({
        label: config.label,
        value: Number(value),
      }));
  }, [filters.includeTerminal]);

  /** Map dữ liệu trường học sang định dạng label/value */
  const schoolOptions = useMemo(() => {
    return schools.map((school) => ({
      label: school.universityName || school.name,
      value: school.id || school.universityId,
    }));
  }, [schools]);

  /** Map dữ liệu giai đoạn thực tập sang định dạng label/value */
  const phaseOptions = useMemo(() => {
    return phases
      .map((phase) => ({
        label: phase.name || phase.phaseName,
        value: phase.id || phase.phaseId,
      }))
      .filter((opt) => opt.value);
  }, [phases]);

  /** Danh sách các đối tượng hồ sơ (Công khai vs Theo mục tiêu) */
  const audienceOptions = [
    { label: 'Public', value: 1 },
    { label: 'Targeted', value: 2 },
  ];

  return {
    statusOptions,
    schoolOptions,
    phaseOptions,
    audienceOptions,
  };
};

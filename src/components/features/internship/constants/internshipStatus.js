/**
 * Internship Status Enum (TermDisplayStatus)
 * 0: Upcoming - Kỳ thực tập sắp diễn ra.
 * 1: Active - Kỳ thực tập đang hoạt động.
 * 2: Ended - Kỳ thực tập đã kết thúc.
 * 3: Closed - Kỳ thực tập đã đóng.
 */
export const INTERNSHIP_STATUS = {
  UPCOMING: 0,
  ACTIVE: 1,
  ENDED: 2,
  CLOSED: 3,
};

export const INTERNSHIP_STATUS_CONFIG = {
  [INTERNSHIP_STATUS.UPCOMING]: {
    label: 'Sắp diễn ra',
    color: 'default',
    badge: 'processing',
    tagColor: 'orange',
  },
  [INTERNSHIP_STATUS.ACTIVE]: {
    label: 'Đang hoạt động',
    color: 'processing',
    badge: 'processing',
    tagColor: 'blue',
  },
  [INTERNSHIP_STATUS.ENDED]: {
    label: 'Đã kết thúc',
    color: 'success',
    badge: 'success',
    tagColor: 'green',
  },
  [INTERNSHIP_STATUS.CLOSED]: {
    label: 'Đã đóng',
    color: 'error',
    badge: 'default',
    tagColor: 'slate',
  },
};

export const INTERNSHIP_STEPS = [
  { key: 'registration', label: 'Đăng ký' },
  { key: 'interviewing', label: 'Phỏng vấn' },
  { key: 'offered', label: 'Lời mời' },
  { key: 'placed', label: 'Tiếp nhận' },
  { key: 'finalizing', label: 'Hoàn tất' },
];

export const getStepStatus = (stepIndex, currentStatus) => {
  if (currentStatus === INTERNSHIP_STATUS.ENDED || currentStatus === INTERNSHIP_STATUS.CLOSED) {
    return 'completed';
  }

  if (currentStatus === INTERNSHIP_STATUS.UPCOMING) {
    return stepIndex === 0 ? 'current' : 'upcoming';
  }

  if (currentStatus === INTERNSHIP_STATUS.ACTIVE) {
    // For Active status, we assume items are moving through (simplified for now)
    if (stepIndex < 3) return 'completed';
    if (stepIndex === 3) return 'current';
    return 'upcoming';
  }

  return 'upcoming';
};

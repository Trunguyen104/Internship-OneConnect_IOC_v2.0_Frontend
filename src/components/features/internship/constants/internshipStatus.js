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
    label: 'Upcoming',
    color: 'default',
    badge: 'processing',
    tagColor: 'orange',
  },
  [INTERNSHIP_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'processing',
    badge: 'processing',
    tagColor: 'blue',
  },
  [INTERNSHIP_STATUS.ENDED]: {
    label: 'Ended',
    color: 'success',
    badge: 'success',
    tagColor: 'green',
  },
  [INTERNSHIP_STATUS.CLOSED]: {
    label: 'Closed',
    color: 'error',
    badge: 'default',
    tagColor: 'slate',
  },
};

export const INTERNSHIP_STEPS = [
  { key: 'registration', label: 'Registration' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offered', label: 'Offered' },
  { key: 'placed', label: 'Placed' },
  { key: 'finalizing', label: 'Finalizing' },
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

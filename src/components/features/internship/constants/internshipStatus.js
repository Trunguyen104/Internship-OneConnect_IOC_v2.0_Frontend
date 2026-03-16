/**
 * Internship Status Enum (TermDisplayStatus)
 * 0: Upcoming - Internship cycle has not started yet.
 * 1: Active - Internship cycle is in progress.
 * 2: Ended - Internship cycle has ended.
 * 3: Closed - Internship cycle is closed.
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
    label: 'In progress',
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
  { key: 'interviewing', label: 'Interview' },
  { key: 'offered', label: 'Offer' },
  { key: 'placed', label: 'Placement' },
  { key: 'finalizing', label: 'Finalize' },
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

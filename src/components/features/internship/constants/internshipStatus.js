/**
 * Internship Status Enum (TermDisplayStatus)
 * 0: Upcoming - Internship cycle has not started yet.
 * 1: Active - Internship cycle is in progress.
 * 2: Ended - Internship cycle has ended.
 * 3: Closed - Internship cycle is closed.
 */
export const INTERNSHIP_STATUS = {
  DRAFT: 0,
  OPEN: 1,
  IN_PROGRESS: 2,
  CLOSED: 3,
};

export const INTERNSHIP_STATUS_CONFIG = {
  [INTERNSHIP_STATUS.DRAFT]: {
    label: 'Draft',
    color: 'default',
    badge: 'default',
    tagColor: 'slate',
  },
  [INTERNSHIP_STATUS.OPEN]: {
    label: 'Open',
    color: 'processing',
    badge: 'processing',
    tagColor: 'orange',
  },
  [INTERNSHIP_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'processing',
    badge: 'processing',
    tagColor: 'blue',
  },
  [INTERNSHIP_STATUS.CLOSED]: {
    label: 'Closed',
    color: 'success',
    badge: 'success',
    tagColor: 'green',
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
  if (currentStatus === INTERNSHIP_STATUS.CLOSED) {
    return 'completed';
  }

  if (currentStatus === INTERNSHIP_STATUS.DRAFT || currentStatus === INTERNSHIP_STATUS.OPEN) {
    return stepIndex === 0 ? 'current' : 'upcoming';
  }

  if (currentStatus === INTERNSHIP_STATUS.IN_PROGRESS) {
    // For In Progress status, we assume items are moving through (simplified for now)
    if (stepIndex < 3) return 'completed';
    if (stepIndex === 3) return 'current';
    return 'upcoming';
  }

  return 'upcoming';
};

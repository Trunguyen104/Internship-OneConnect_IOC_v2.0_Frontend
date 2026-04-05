export const PLACEMENT_STATUS = {
  UNPLACED: 0,
  PENDING_ASSIGNMENT: 4,
  PLACED: 1,
};

export const PLACEMENT_STATUS_LABELS = {
  [PLACEMENT_STATUS.UNPLACED]: 'Unplaced',
  [PLACEMENT_STATUS.PENDING_ASSIGNMENT]: 'Pending Assignment',
  [PLACEMENT_STATUS.PLACED]: 'Placed',
};

export const PLACEMENT_STATUS_VARIANTS = {
  [PLACEMENT_STATUS.UNPLACED]: 'muted',
  [PLACEMENT_STATUS.PENDING_ASSIGNMENT]: 'warning-soft',
  [PLACEMENT_STATUS.PLACED]: 'success-soft',
};

export const APPLICATION_STATUS = {
  PENDING_ASSIGNMENT: 4,
  WITHDRAWN: 5,
};

export const SEMESTER_STATUS = {
  UPCOMING: 1,
  ACTIVE: 2,
  ENDED: 3,
  CLOSED: 4,
};

export const PLACEMENT_UI_TEXT = {
  TABLE: {
    FULL_NAME: 'FULL NAME',
    EMAIL: 'EMAIL',
    MAJOR: 'MAJOR',
    ENTERPRISE: 'ENTERPRISE',
    STATUS: 'PLACEMENT STATUS',
    LOGBOOK: 'LOGBOOK',
    ACTION: 'ACTION',
    UNASSIGNED: '— Unassigned —',
    STUDENTS_SELECTED: 'Students selected',
    ACTION_ASSIGN: 'Assign',
    ACTION_CHANGE: 'Change',
    ACTION_CANCEL: 'Cancel Placement',
    SELECTED: 'Selected',
  },
  PAGE: {
    TITLE: 'Placement Management',
    SUBTITLE: 'Assign enterprises and intern phases to students.',
    TERM_LABEL: 'Selected Term',
    INITIALIZING: 'Initializing placement data...',
    SELECT_TERM_PLACEHOLDER: 'Select a term...',
    ACTIVE_SUFFIX: '(Active)',
    EMPTY_STATE: {
      ICON: '📭',
      TITLE: 'No Semester Selected',
      DESC: 'Please select an active internship semester from the dropdown to manage placements.',
    },
  },
  POPOVER: {
    QUICK_ASSIGNMENT: 'Quick Assignment',
    CANCEL: 'Cancel',
    ASSIGN: 'Assign',
    CONFLICT_TITLE: 'Self-Apply Conflict',
    CONFLICT_DESC:
      'Student is currently applying to this enterprise. Assignment is blocked (AC-11).',
  },
  ACTIONS: {
    ASSIGN_TITLE: 'Assign Enterprise',
    CHANGE_TITLE: 'Change Enterprise',
    CANCEL_TITLE: 'Cancel Placement',
    ENDED_TOOLTIP: 'Semester has ended',
    DATA_EXISTS_TOOLTIP: 'Cannot modify placement: data already exists',
  },
  MODALS: {
    BULK_ASSIGN: {
      TITLE: (count) => `Assign Enterprise for ${count} Students`,
      TARGET_LABEL: 'TARGET ENTERPRISE & PHASE',
      STUDENTS_LABEL: 'STUDENT RECIPIENTS',
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
      CAPACITY_ERROR: (remaining) => `Capacity Exceeded: Phase only has ${remaining} slots left.`,
      CONFLICT_MSG: (count) => `${count} students have active self-apply at this enterprise.`,
      CONFLICT_DESC: 'Uni Admin assignment is blocked for these students per AC-11.',
    },
    BULK_REASSIGN: {
      TITLE: 'Bulk Change Enterprise',
      IMPACT_TITLE: 'Re-assignment Impact',
      IMPACT_DESC:
        'Confirming will cancel previous placements and notify Enterprises for approval.',
      TARGET_LABEL: 'NEW ENTERPRISE & PHASE',
      ELIGIBLE_LABEL: (count) => `Eligible Students (${count})`,
      BLOCKED_LABEL: (count) => `Blocked Students (${count})`,
      BLOCKED_REASON: 'HAS INTERNSHIP DATA (LOGBOOK/SPRINT/EVAL)',
      CONFIRM: 'Confirm Change',
      CANCEL: 'Cancel',
      CURRENT_ENTERPRISE_FALLBACK: 'Current Enterprise',
      ARROW: '→',
    },
    BULK_UNASSIGN: {
      TITLE: 'Bulk Cancel Placement',
      WARNING_TITLE: 'Warning: Permanent Action',
      WARNING_DESC:
        'This will remove students from their assigned enterprises and return the slots to the companies.',
      ELIGIBLE_LABEL: 'ELIGIBLE TO CANCEL',
      EMPTY_ELIGIBLE: 'No eligible placements selected.',
      CONFIRM: 'Confirm Cancel',
      CANCEL: 'Cancel',
    },
  },
  SELECT: {
    PHASE_PLACEHOLDER: 'Select a phase...',
    LEFT: 'left',
    MAJORS: 'Majors:',
  },
};

export const APPLICATION_STATUS = {
  APPLIED: 1,
  INTERVIEWING: 2,
  OFFERED: 3,
  PENDING_ASSIGNMENT: 4,
  PLACED: 5,
  REJECTED: 6,
  WITHDRAWN: 7,
};

export const PLACEMENT_STATUS = {
  // Application specific (from InternshipApplicationStatus)
  PENDING_ASSIGNMENT: 4,
  PLACED: 5,
  REJECTED: 6,
  UNPLACED: 0, // Fallback for no assignment
};

export const PLACEMENT_STATUS_LABELS = {
  // AC-11 Standardized (InternshipApplicationStatus Enum)
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.INTERVIEWING]: 'Interviewing',
  [APPLICATION_STATUS.OFFERED]: 'Offered',
  [APPLICATION_STATUS.PENDING_ASSIGNMENT]: 'Pending Assignment',
  [APPLICATION_STATUS.PLACED]: 'Placed',
  [APPLICATION_STATUS.REJECTED]: 'Rejected',
  [APPLICATION_STATUS.WITHDRAWN]: 'Withdrawn',
  // Legacy support for API values 0 and 1
  0: 'Unplaced',
  1: 'Placed',
};

export const PLACEMENT_STATUS_VARIANTS = {
  // AC-11 Standardized (InternshipApplicationStatus Enum)
  [APPLICATION_STATUS.APPLIED]: 'info-soft',
  [APPLICATION_STATUS.INTERVIEWING]: 'info-soft',
  [APPLICATION_STATUS.OFFERED]: 'warning-soft',
  [APPLICATION_STATUS.PENDING_ASSIGNMENT]: 'warning-soft',
  [APPLICATION_STATUS.PLACED]: 'success-soft',
  [APPLICATION_STATUS.REJECTED]: 'error-soft',
  [APPLICATION_STATUS.WITHDRAWN]: 'muted',
  // Legacy support for API values 0 and 1
  0: 'muted',
  1: 'success-soft',
};

export const SEMESTER_STATUS = {
  UPCOMING: 1,
  ACTIVE: 2,
  ENDED: 3,
  CLOSED: 4,
};

export const PLACEMENT_UI_TEXT = {
  STATUS_LABELS: {
    PENDING: 'Pending',
    BLOCKED: 'Blocked',
    BLOCKED_MIXED: 'Blocked',
    NEW: 'New',
    UNKNOWN: 'Unknown',
    PLACED: 'Placed',
    PENDING_ASSIGNMENT: 'Pending Assignment',
    UNPLACED: 'Unplaced',
  },
  TABLE: {
    FULL_NAME: 'FULL NAME',
    EMAIL: 'EMAIL',
    MAJOR: 'MAJOR',
    ENTERPRISE: 'ENTERPRISE',
    PLACEMENT: 'PLACEMENT',
    STATUS: 'PLACEMENT STATUS',
    LOGBOOK: 'LOGBOOK',
    ACTION: 'ACTION',
    UNASSIGNED: '— Unassigned —',
    STUDENTS_SELECTED: 'students selected',
    ACTION_ASSIGN: 'Assign',
    ACTION_CHANGE: 'Change',
    ACTION_CANCEL: 'Cancel Placement',
    SELECTED: 'Selected',
    SEARCH_PLACEHOLDER: 'Search by name, email or major...',
    SELECT_TERM: 'Select term...',
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
    QUICK_ASSIGNMENT: 'Quick Enterprise Assignment',
    SEARCH_PLACEHOLDER: 'Search enterprise...',
    SELECT_PHASE: 'Select phase...',
    ASSIGN: 'Assign',
    CANCEL: 'Cancel',
    REASSIGN_TITLE: 'Confirm Change Enterprise',
    REASSIGN_CONFIRM_BTN: 'Confirm Change',
    GOT_IT: 'Got it',
    CONFLICT_TITLE: 'Self-Apply Conflict',
    CONFLICT_DESC: 'This student has an active self-application at this enterprise.',
    CONFLICT_ERROR: (name, ent, status) =>
      `Student ${name} has a pending self-application at ${ent} (status: ${status}). Please choose another enterprise or ask the student to withdraw their application first.`,
    SUCCESS: (ent, stu) =>
      `Successfully sent assignment [${ent}] for [${stu}]. Awaiting enterprise confirmation.`,
    REASSIGN_CONFIRM: (name, oldEnt, newEnt) =>
      `${name} is currently assigned to ${oldEnt}. Confirming will cancel the old placement and send a new assignment to ${newEnt} — awaiting enterprise confirmation. Do you want to continue?`,
    FALLBACK_OLD_ENT: 'Current Enterprise',
  },
  ACTIONS: {
    ASSIGN_TITLE: 'Assign Enterprise',
    CHANGE_TITLE: 'Change Enterprise',
    CANCEL_TITLE: 'Cancel Placement',
    ENDED_TOOLTIP: 'Cannot change placement as the semester has ended.',
    DATA_EXISTS_TOOLTIP: (name, ent) =>
      `Cannot change enterprise for ${name}. This student already has internship data (logbook / sprint / evaluation) at ${ent}. Please contact the system administrator if special handling is needed.`,
  },
  MODALS: {
    BULK_ASSIGN: {
      TITLE: (count) => `Assign enterprise for ${count} students`,
      TARGET_LABEL: 'TARGET ENTERPRISE & PHASE',
      STUDENTS_LABEL: 'STUDENTS TO BE AFFECTED',
      ELIGIBLE_LABEL: (count) => `Eligible (${count})`,
      BLOCKED_LABEL: (count) => `Blocked by conflict (${count})`,
      CONFLICT_REASON: (status) => `Self-Application: ${status}`,
      CONFIRM: 'Confirm Assignment',
      CANCEL: 'Cancel',
      CAPACITY_ERROR: (phase, ent, remaining, selecting) =>
        `Intern Phase ${phase} of ${ent} only has ${remaining} slots left. You are assigning ${selecting} students. Please reduce the number or choose another phase/enterprise.`,
      CONFLICT_MSG: (count) =>
        `${count} students have self-application conflicts at this enterprise.`,
      CONFLICT_DESC: 'Assignments are blocked according to AC-11 for these students.',
      REASSIGN_WARNING: (count) =>
        `${count} students already have assignments or placements. Confirming will cancel the old placements and send new assignments.`,
      REVIEW_SUBTITLE: 'Review and confirm the enterprise assignment',
      BULK_SUCCESS: (ent, count) =>
        `Successfully sent assignments for ${count} students to ${ent}. Awaiting enterprise confirmation.`,
      EXCLUDE_TOOLTIP: 'Exclude from assignment',
      EMPTY_ELIGIBLE: 'All selected students are excluded or blocked for this enterprise.',
      PROMPT_SELECT: 'Select an enterprise phase above to see eligible students for assignment.',
    },

    BULK_REASSIGN: {
      TITLE: (count) => `Change enterprise for ${count} students`,
      IMPACT_TITLE: 'Important Information',
      IMPACT_DESC: (count) =>
        `${count} students are currently assigned to different enterprises. Confirming will cancel old placements and send new assignments — awaiting enterprise confirmation.`,
      TARGET_LABEL: 'NEW ENTERPRISE & PHASE',
      ELIGIBLE_LABEL: (count) => `Eligible (${count})`,
      BLOCKED_LABEL: (count) => `Blocked (${count})`,
      ALL_BLOCKED_ERROR:
        'None of the selected students can be reassigned. All have existing internship data.',
      BLOCKED_REASON: 'Existing internship data (Logbook/Sprint/Evaluation)',
      CONFIRM: 'Confirm Change',
      CANCEL: 'Cancel',
      CURRENT_ENTERPRISE_FALLBACK: 'Current Enterprise',
      ARROW: '→',
      SUCCESS: (ent, count) =>
        `Successfully sent new assignments for ${count} students to ${ent}. Awaiting enterprise confirmation.`,
      REASSIGN_INFO: (count) =>
        `${count} students will be reassigned. Current placements will be cancelled.`,
      SELECT_PHASE_PROMPT:
        'Select an enterprise phase above to see eligible students for assignment.',
      ALL_FILTERED_MSG: 'All selected students are either excluded or blocked for this enterprise.',
      SUBTITLE: 'Change the assigned enterprise for selected students',
    },
    BULK_UNASSIGN: {
      TITLE: (count) => `Cancel placement for ${count} students`,
      WARNING_TITLE: 'Important Information',
      WARNING_DESC:
        'The system will cancel the current placements for all eligible students. This action will notify the enterprise and return the internship slots.',
      ELIGIBLE_LABEL: (count) => `Eligible (${count})`,
      BLOCKED_LABEL: (count) => `Blocked (${count})`,
      EMPTY_PLACEMENTS_ERROR:
        'No selected students are currently "Placed" or "Pending Assignment".',
      ALL_BLOCKED_ERROR:
        'None of the selected students can have their placement cancelled. All have existing internship data.',
      EMPTY_ELIGIBLE: 'No eligible students for unassignment.',
      SUCCESS: (count) => `Successfully cancelled assignments for ${count} students.`,
      CONFIRM: 'Confirm Cancellation',
      CANCEL: 'Cancel',
      CURRENTLY_AT: 'Currently at',
      TO_UNASSIGN: 'To unassign',
      SUBTITLE: 'Remove the assigned enterprise for selected students',
    },
    COMMON: {
      EXCLUDE: 'Exclude',
      INCLUDE: 'Include back',
    },
  },
  SELECT: {
    PHASE_PLACEHOLDER: 'Select a Phase...',
    LEFT: 'slots',
    SLOT_LABEL: 'Left',
    MAJORS: 'Accepting majors:',
    EMPTY: 'No enterprise phases found for this term.',
    MORE: 'more',
    SLOTS: 'Slots',
    ALL: 'All',
  },
};

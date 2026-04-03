export const INTERN_PHASE_STATUS = {
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
};

export const INTERN_PHASE_STATUS_LABELS = {
  [INTERN_PHASE_STATUS.UPCOMING]: 'Upcoming',
  [INTERN_PHASE_STATUS.ACTIVE]: 'Active',
  [INTERN_PHASE_STATUS.ENDED]: 'Ended',
};

export const INTERN_PHASE_STATUS_VARIANTS = {
  [INTERN_PHASE_STATUS.UPCOMING]: 'warning',
  [INTERN_PHASE_STATUS.ACTIVE]: 'success',
  [INTERN_PHASE_STATUS.ENDED]: 'default',
};

export const INTERN_PHASE_MANAGEMENT = {
  TITLE: 'Intern Phases',
  CREATE_BTN: 'Create Intern Phase',
  SEARCH_PLACEHOLDER: 'Search by phase name...',
  EMPTY_STATE: 'The enterprise has no Intern Phase yet. Create a new one to start recruiting.',

  FILTERS: {
    STATUS: 'Status',
    INCLUDE_ENDED: 'Include Ended',
  },

  TABLE: {
    COLUMNS: {
      NAME: 'PHASE NAME',
      MAJORS: 'MAJOR FIELDS',
      TIMELINE: 'TIMELINE',
      STATUS: 'STATUS',
      POSTINGS: 'POSTINGS',
      CAPACITY: 'CAPACITY',
      ACTIONS: 'ACTIONS',
    },
    ACTIONS: {
      VIEW: 'View Details',
      EDIT: 'Edit',
      DELETE: 'Delete',
    },
    CAPACITY_FORMAT: '{remaining}/{total}',
  },

  FORM: {
    TITLE_ADD: 'Create Intern Phase',
    TITLE_EDIT: 'Edit Intern Phase',
    TITLE_VIEW: 'Intern Phase Details',
    DESC: 'Phases define the recruitment periods and capacity for your enterprise.',
    CANCEL_BTN: 'Cancel',
    LABEL: {
      NAME: 'Phase Name',
      START_DATE: 'Start Date',
      END_DATE: 'End Date',
      MAJORS: 'Accepted Majors',
      CAPACITY: 'Capacity',
      DESCRIPTION: 'Description',
      REMAINING: 'Remaining Slots',
    },

    PLACEHOLDER: {
      NAME: 'e.g. Summer 2025, Q3 2025 Recruitment',
      DATE: 'Select date',
      MAJORS: 'Type and press enter (e.g. IT, Marketing)',
      CAPACITY: 'Enter total capacity',
      DESCRIPTION: 'Additional information about this phase...',
    },

    VALIDATION: {
      NAME_REQUIRED: 'Phase name is required.',
      START_DATE_REQUIRED: 'Start date is required.',
      END_DATE_REQUIRED: 'End date is required.',
      MAJORS_REQUIRED: 'At least one major field is required.',
      CAPACITY_REQUIRED: 'Capacity is required.',
      CAPACITY_MIN: 'Capacity must be at least 1.',
      END_AFTER_START: 'End date must be after start date.',
      MIN_DURATION: 'Intern Phase must be at least 4 weeks (28 days).',
      MAX_DURATION: 'Intern Phase must not exceed 12 months (365 days).',
      NAME_EXISTS: 'An Intern Phase with this name already exists. You can still proceed.',
      DEADLINE_VIOLATION:
        '{count} job postings have deadlines exceeding the new end date. Please adjust them first.',
    },

    BLOCK_MESSAGE:
      'This Intern Phase already has students placed or assigned groups. Dates and capacity cannot be changed. Please resolve associated students before making changes.',
    CANCEL_BTN: 'Cancel',
    SAVE_BTN: 'Create',
    SAVE_CHANGES_BTN: 'Save Changes',
  },

  JOB_POSTING: {
    TITLE_ADD: 'Create Job Posting',
    TITLE_EDIT: 'Edit Job Posting',
    LABEL: {
      TITLE: 'Job Title',
      DEADLINE: 'Application Deadline',
      SLOTS: 'Slots',
      DESCRIPTION: 'Job Description',
      PHASE: 'Intern Phase (Shared)',
    },
    PLACEHOLDER: {
      TITLE: 'e.g. Backend Developer Intern',
      DESCRIPTION: 'Detailed job requirements...',
    },
    MOCK_NOTICE: 'Note: This is a placeholder for Issue-115.',
    PUBLISH_BTN: 'Publish Posting',
    TABLE: {
      COLUMNS: {
        TITLE: 'JOB TITLE',
        STATUS: 'STATUS',
        DEADLINE: 'DEADLINE',
        APPLICATIONS: 'APPLICATIONS',
      },
      STATUS_LABELS: {
        Published: 'Published',
        Draft: 'Draft',
        Closed: 'Closed',
      },
      STATUS_VARIANTS: {
        Published: 'success-soft',
        Draft: 'warning-soft',
        Closed: 'default',
      },
    },
  },

  DETAILS: {
    METADATA: {
      TITLE: 'Intern Phase Details',
      TIMELINE: 'Timeline',
      OCCUPANCY: 'Occupancy',
      DESCRIPTION: 'Description',
      MAJORS: 'Target Majors',
      START: 'Start',
      END: 'End',
      LEFT: 'left',
      DATE_SEPARATOR: '–',
      BACK: 'Back',
      ID: 'Phase ID',
      TO: 'to',
      APPLICATIONS_REMAINING: 'APPLICATIONS REMAINING',
      FILLED: 'filled',
    },
    NO_DESCRIPTION: 'No description provided for this internship phase.',
    TABS: {
      POSTINGS: 'Job Postings',
      STUDENTS: 'Students',
    },
    EMPTY_POSTINGS: 'No job postings yet. Create a job posting to start receiving candidates.',
    EMPTY_STUDENTS: 'No students placed in this phase yet.',
    CREATE_POSTING: 'Create Job Posting',
  },

  STUDENTS: {
    TABLE: {
      COLUMNS: {
        NAME: 'STUDENT NAME',
        UNIVERSITY: 'UNIVERSITY',
        SOURCE: 'SOURCE',
        PLACED_DATE: 'PLACED DATE',
      },
      SOURCE_LABELS: {
        'Self-apply': 'Self-apply',
        'Uni-assign': 'University assigned',
      },
      SOURCE_VARIANTS: {
        'Self-apply': 'info-soft',
        'Uni-assign': 'primary-soft',
      },
    },
  },

  MESSAGES: {
    CREATE_SUCCESS: 'Intern Phase created successfully.',
    UPDATE_SUCCESS: 'Intern Phase updated successfully.',
    DELETE_SUCCESS: 'Intern Phase deleted successfully.',
    DELETE_CONFIRM: 'Are you sure you want to delete this Intern Phase?',
    DELETE_WARNING_GROUPS:
      'This Intern Phase is currently used by {count} internship groups. Deleting it will decouple these groups from their start/end dates.',
    DELETE_BLOCK_POSTINGS:
      'This Intern Phase has {count} job postings. Please delete or transfer them to another phase first.',
    DELETE_BLOCK_PLACED:
      'This Intern Phase has {count} active students. Deletion is blocked while students are active.',
    ERROR_FETCH_DETAIL: 'Failed to fetch phase details.',
    ERROR_ENTERPRISE_ID: 'Enterprise ID not found for this account.',
    ERROR_DELETE: 'An error occurred while deleting the Intern Phase.',
    ERROR_DELETE_TITLE: 'Cannot Delete',
    DELETE_TITLE: 'Delete Intern Phase',
    DELETE_OK: 'Delete',
  },
  PAGE: {
    ERROR: {
      TITLE: 'Phase not found',
      DESCRIPTION: 'The internship phase you are looking for does not exist or has been deleted.',
      BACK_BTN: 'Return to List',
      LOADING: 'Loading phase details...',
    },
  },
};

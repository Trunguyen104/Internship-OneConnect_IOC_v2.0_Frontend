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
      START_DATE: 'START DATE',
      END_DATE: 'END DATE',
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
      NAME_EXISTS: 'Đã có Intern Phase tên này. Bạn vẫn có thể tiếp tục.',
      DEADLINE_VIOLATION:
        '{count} tin tuyển dụng đang có deadline vượt quá ngày kết thúc mới. Vui lòng điều chỉnh deadline trước.',
    },

    BLOCK_MESSAGE:
      'Intern Phase này đã có sinh viên được nhận / nhóm thực tập. Không thể thay đổi thời gian hoặc số lượng. Nếu cần thay đổi, hãy xử lý dứt điểm các sinh viên liên quan trước.',
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
        Published: 'Công khai',
        Draft: 'Nháp',
        Closed: 'Đã đóng',
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
    },
    NO_DESCRIPTION: 'No description provided.',
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
        'Self-apply': 'Tự ứng tuyển',
        'Uni-assign': 'Trường điều phối',
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
    DELETE_CONFIRM: 'Bạn có chắc chắn muốn xóa Intern Phase này?',
    DELETE_WARNING_GROUPS:
      'Intern Phase này đang được {count} nhóm thực tập sử dụng. Xóa sẽ khiến các nhóm đó mất liên kết ngày bắt đầu/kết thúc.',
    DELETE_BLOCK_POSTINGS:
      'Intern Phase này đang có {count} job posting. Vui lòng xóa hoặc chuyển các job posting sang Intern Phase khác trước.',
    DELETE_BLOCK_PLACED:
      'Intern Phase này đang có {count} sinh viên thực tập. Không thể xóa khi còn sinh viên đang active.',
    ERROR_FETCH_DETAIL: 'Lấy thông tin chi tiết thất bại.',
  },
};

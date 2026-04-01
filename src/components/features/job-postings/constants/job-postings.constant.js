export const JOB_POSTING_UI = {
  TITLE: 'Job Postings',
  CREATE_BUTTON: 'Create Job Posting',
  SEARCH_PLACEHOLDER: 'Search by job title...',
  TABLE: {
    COLUMNS: {
      TITLE: 'Job Title',
      PHASE: 'Intern Phase',
      DEADLINE: 'Deadline',
      APPLICATIONS: 'Applications',
      STATUS: 'Status',
      ACTIONS: 'Actions',
    },
  },
  FILTERS: {
    ALL: 'All',
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    CLOSED: 'Closed',
  },
  FORM: {
    CREATE_TITLE: 'Create New Job Posting',
    EDIT_TITLE: 'Edit Job Posting',
    FIELDS: {
      JOB_TITLE: 'Job Title',
      JOB_TITLE_PLACEHOLDER: 'e.g. Senior .NET Developer',
      INTERN_PHASE: 'Intern Phase',
      INTERN_PHASE_PLACEHOLDER: 'Select intern phase',
      POSITION: 'Job Position',
      POSITION_PLACEHOLDER: 'e.g. Backend Intern, UI/UX Designer',
      START_DATE: 'Start Date',
      END_DATE: 'End Date',
      LOCATION: 'Location',
      LOCATION_PLACEHOLDER: 'e.g. Ho Chi Minh City',
      APPLICATION_DEADLINE: 'Application Deadline',
      DESCRIPTION: 'Job Description',
      REQUIREMENTS: 'Requirements',
      BENEFITS: 'Benefits',
      AUDIENCE: 'Audience',
      TARGETED_SCHOOLS: 'Targeted Schools',
    },
    MESSAGES: {
      SAVE_DRAFT_SUCCESS: 'Job posting saved as draft.',
      PUBLISH_SUCCESS: 'Job posting published successfully.',
      UPDATE_SUCCESS: 'Job posting updated successfully.',
      VALIDATION: {
        TITLE: 'Job title is required',
        POSITION: 'Position is required',
        PHASE: 'Please select an intern phase',
        LOCATION: 'Location is required',
        DEADLINE: 'Application deadline is required',
        DEADLINE_TOOLTIP: 'Deadline must be on or before the internship start date.',
        DEADLINE_BULLET: '●',
      },
    },
    BUTTONS: {
      CANCEL: 'Cancel',
      SAVE_DRAFT: 'Save Draft',
      PUBLISH: 'Publish Now',
      PROCESSING: 'Processing...',
    },
    MODALS: {
      CHANGE_BLOCKED: {
        TITLE: 'Change Blocked',
        CONTENT: (count) =>
          `This job posting has ${count} active applicant(s). You cannot change the Intern Phase while students are being processed. Please close the job and handle existing applications first.`,
      },
      CONFIRM_UPDATE: {
        TITLE: 'Confirm Update',
        CONTENT: (count) =>
          `This job has ${count} active application(s). Changing information might affect their expectations. Are you sure you want to proceed?`,
      },
    },
    REACH: {
      PUBLIC_TITLE: 'Public (All Students)',
      TARGETED_TITLE: 'Targeted (Specific Schools)',
      COMING_SOON: 'COMING SOON',
    },
    SECTIONS: {
      ONE: 'SECTION ONE',
      TWO: 'SECTION TWO',
      THREE: 'SECTION THREE',
    },
  },
  PLACEHOLDERS: {
    REQUIREMENTS: 'List key requirements...',
    BENEFITS: 'List perks and benefits...',
    SELECT_DATE: 'Select date',
    DRAFT_STATUS: (time) => `Draft saved ${time} ago`,
    EMPTY_TABLE: 'No job postings found.',
    NOT_AVAILABLE: 'N/A',
    DASH_FALLBACK: '—',
  },
  MENU: {
    EDIT: 'Edit Job Posting',
    PUBLISH: 'Publish Job Posting',
    CLOSE: 'Close Job Posting',
    REPUBLISH: 'Re-Publish',
    DELETE: 'Delete',
  },
  LIST: {
    SUBTITLE: "Manage your company's internship opportunities and job postings.",
    TITLE: 'Job Listing',
    TOTAL: 'Total:',
    ITEMS_COUNT: (count) => `${count} items`,
  },
  CONFIRM: {
    PUBLISH: {
      TITLE: 'Publish Job?',
      CONTENT: (title) =>
        `Are you sure you want to publish "${title}"? Students will be able to see and apply.`,
    },
    CLOSE: {
      TITLE: 'Close Job Posting?',
      CONTENT_ACTIVE: (title, count) =>
        `Job Posting "${title}" has ${count} active applicant(s) being processed. If you close this, they will be notified and stay in the pipeline for further processing. New students won't be able to apply. Are you sure?`,
      CONTENT_INACTIVE: (title) =>
        `Are you sure you want to close "${title}"? Students will no longer be able to apply.`,
    },
    DELETE: {
      TITLE: 'Delete Job Posting?',
      CONTENT_ACTIVE: (title, count) =>
        `WARNING: This job has ${count} active applicant(s). Deleting will remove it from the list, but those applications will still be managed in the "All Applications" screen. This action cannot be undone.`,
      CONTENT_INACTIVE: (title) =>
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      BUTTON: 'Delete',
    },
    BUTTONS: {
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
  },
  STATUS_LABELS: {
    1: 'Draft',
    2: 'Published',
    3: 'Closed',
    4: 'Deleted',
  },
};

export const JOB_STATUS = {
  DRAFT: 1,
  PUBLISHED: 2,
  CLOSED: 3,
  DELETED: 4,
};

export const JOB_AUDIENCE = {
  PUBLIC: 1,
  TARGETED: 2,
};

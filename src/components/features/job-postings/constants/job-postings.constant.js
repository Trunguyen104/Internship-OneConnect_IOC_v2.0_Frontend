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
    INCLUDE_DELETED: 'Include Deleted',
  },
  FORM: {
    CREATE_TITLE: 'Create New Job Posting',
    CREATE_SUBTITLE: 'Define the scope and requirements for this job posting.',
    EDIT_TITLE: 'Edit Job Posting',
    EDIT_SUBTITLE: 'Update job details and requirements',
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
      LOCATION_PLACEHOLDER: 'e.g. Ho Chi Minh City',
      APPLICATION_DEADLINE: 'Application Deadline',
      DESCRIPTION: 'Job Description',
      REQUIREMENTS: 'Requirements',
      BENEFITS: 'Benefits',
      AUDIENCE: 'Audience',
      TARGET_SCHOOLS: 'Target Schools',
      TARGET_SCHOOLS_PLACEHOLDER: 'Search and select schools...',
      ROLE_DESCRIPTION: 'Role Description',
      ROLE_DESCRIPTION_PLACEHOLDER: 'Describe roles A, B, C and their requirements...',
      START_DATE_LABEL: 'Internship Start',
      END_DATE_LABEL: 'Internship End',
    },
    MESSAGES: {
      SAVE_DRAFT_SUCCESS: 'Draft saved successfully.',
      PUBLISH_SUCCESS: 'Job posting has been published.',
      CREATE_SUCCESS: 'Job posting created successfully.',
      UPDATE_SUCCESS: 'Job posting has been updated.',
      DELETE_SUCCESS: 'Job posting deleted successfully.',
      CLOSE_SUCCESS: 'Job Posting closed.',
      REOPEN_SUCCESS: 'Job posting has been reopened and published.',
      GENERAL_ERROR: 'An error occurred. Please try again.',
      HEADERS: {
        SUCCESS: 'Success',
        ERROR: 'Error',
        WARNING: 'Warning',
        INFO: 'Information',
        VALIDATION: 'Validation Error',
      },
      VALIDATION: {
        TITLE: 'Please enter a job title.',
        POSITION: 'Please enter a job position.',
        PHASE: 'Please select an intern phase before publishing.',
        LOCATION: 'Please enter a location.',
        DEADLINE: 'Please select an application deadline.',
        DEADLINE_EXPIRED: 'The deadline has expired. Please update it before publishing.',
        DEADLINE_FOR_REOPEN:
          'Invalid deadline. Please choose a future date before the internship starts.',
        DEADLINE_TOOLTIP: 'The deadline must be on or before the internship start date.',
        DEADLINE_TOO_LATE: (date) =>
          `The deadline must not be later than the internship start date (${date}).`,
        SCHOOLS_REQUIRED: 'Please select at least one school.',
        DEADLINE_BULLET: '●',
        JOB_ROLE_DESCRIPTION_LABEL: 'Role Description',
        CAPACITY_WARNING: (phaseName, placed, total) =>
          `Intern Phase [${phaseName}] is full (${placed}/${total} students already Placed). You may want to close job postings in this phase.`,
      },
    },
    BUTTONS: {
      CANCEL: 'Cancel',
      SAVE_DRAFT: 'Save Draft',
      PUBLISH: 'Publish Now',
      SAVE_CHANGES: 'Save Changes',
      PROCESSING: 'Processing...',
      AUTO_SAVING: 'Auto-saving...',
    },
    MODALS: {
      CHANGE_BLOCKED: {
        TITLE: 'Change Intern Phase Blocked',
        CONTENT: (count) =>
          `This posting has [${count}] active candidate(s). You cannot change the Intern Phase while applications are being processed. Please close the posting and handle current candidates first.`,
      },
      CONFIRM_UPDATE: {
        TITLE: 'Confirm Information Update',
        CONTENT: (count) =>
          `This posting has [${count}] active candidate(s). Changing job information may affect their expectations. Are you sure you want to continue?`,
      },
    },
    REACH: {
      PUBLIC_TITLE: 'Public (All Students)',
      TARGETED_TITLE: 'Targeted (Specific Schools)',
      COMING_SOON: 'COMING SOON',
    },
  },
  DETAIL: {
    NOT_FOUND: 'Job information not found',
    BACK_TO_LIST: 'Back to Job Listing',
    APPLICANTS_SUMMARY: 'Applicants Summary',
    MANAGE_ALL_APPLICANTS: 'Manage All Applicants',
    JOB_DETAILS: 'Job Details',
    PHASE_CAPACITY_REACHED: 'Phase Capacity Reached',
    NO_INFO: 'No information provided.',
    SCHOOL_ID: 'School ID:',
    STATS: {
      APPLIED: 'Applied',
      INTERVIEWING: 'Interviewing',
      OFFERED: 'Offered',
      PLACED: 'Placed',
      TOTAL_ACTIVE: 'Total Applications',
    },
    FACT_LABELS: {
      PHASE: 'Internship Phase',
      DEADLINE: 'Application Deadline',
      AUDIENCE: 'Reach / Audience',
      LOCATION: 'Location',
      POSITION: 'Position',
    },
  },
  PLACEHOLDERS: {
    REQUIREMENTS: 'List key requirements...',
    BENEFITS: 'List perks and benefits...',
    SELECT_DATE: 'Select date',
    DRAFT_STATUS: (time) => `Auto-saved at ${time}`,
    SAVED_AT: (time) => `Saved at ${time}`,
    EMPTY_TABLE: 'No job postings found.',
    NOT_AVAILABLE: 'N/A',
    DASH_FALLBACK: '—',
  },
  MENU: {
    VIEW: 'View Details',
    EDIT: 'Edit',
    PUBLISH: 'Publish',
    CLOSE: 'Close',
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
        `This posting has [${count}] candidate(s) being reviewed. After closing, new students won't be able to apply, but current candidates will still be processed. Are you sure you want to close?`,
      CONTENT_INACTIVE: (title) =>
        `Are you sure you want to close this Job Posting? Students will no longer be able to apply.`,
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

export const JOB_STATUS_VARIANTS = {
  [JOB_STATUS.DRAFT]: 'warning',
  [JOB_STATUS.PUBLISHED]: 'success',
  [JOB_STATUS.CLOSED]: 'danger',
  [JOB_STATUS.DELETED]: 'neutral',
};

export const JOB_AUDIENCE = {
  PUBLIC: 1,
  TARGETED: 2,
};

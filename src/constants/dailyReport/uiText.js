export const DAILY_REPORT_UI = {
  TITLE: 'Daily Report',
  DESCRIPTION: 'Manage and submit your daily internship logbook',

  CREATE_BUTTON: 'Create Report',
  LOADING: 'Loading logbooks...',
  DATE_FORMAT: 'DD/MM/YYYY',

  FILTER_STATUS: 'Filter by status',

  TABLE: {
    REPORT_DATE: 'Report Date',
    STUDENT: 'Student',
    SUMMARY: 'Work Summary',
    ISSUE: 'Issues Encountered',
    STATUS: 'Status',
    ACTION: 'Action',
    SEARCH_PLACEHOLDER: 'Search by student name...',
  },

  STATUS: {
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    NEEDS_REVISION: 'Needs Revision',
    PUNCTUAL: 'Punctual',
    LATE: 'Late',
    UNKNOWN: 'Unknown',
  },
  LOGBOOK_STATUS: {
    SUBMITTED: 0,
    APPROVED: 1,
    NEEDS_REVISION: 2,
    PUNCTUAL: 4,
    LATE: 5,
  },

  MODAL: {
    CREATE_TITLE: 'Create Daily Report',
    EDIT_TITLE: 'Edit Report',
    CREATE_DESC: 'Submit your internship progress',
    EDIT_DESC: 'Update submitted logbook details',

    SUBMIT: 'Submit Report',
    SAVE: 'Save Changes',
    CANCEL: 'Cancel',
  },

  FORM: {
    REPORT_DATE: 'Report Date',
    SUMMARY: 'Work Summary',
    ISSUE: 'Issues Encountered',
    PLAN: 'Plan for Next Day',
    LINKED_WORK_ITEMS: 'Linked Work Items',

    PLACEHOLDER_DATE: 'Select date',
    PLACEHOLDER_SUMMARY: 'Describe the tasks you have done today...',
    PLACEHOLDER_ISSUE: 'What difficulties or obstacles did you encounter?',
    PLACEHOLDER_PLAN: 'What are the planned tasks for tomorrow?',

    VALIDATION: {
      DATE_REQUIRED: 'Please select report date',
      SUMMARY_REQUIRED: 'Please enter summary',
      SUMMARY_MIN: 'Minimum 10 characters',
      SUMMARY_MAX: 'Maximum 200 characters',
      ISSUE_MAX: 'Maximum 200 characters',
      PLAN_REQUIRED: 'Please enter next plan',
      PLAN_MAX: 'Maximum 200 characters',
    },
  },

  EMPTY: {
    NO_PROJECT: 'You have not been assigned to any project.',
    NO_LOGBOOK: 'No daily reports found in this group',
    DESCRIPTION: 'Keep track of your learning journey! Start by adding your first daily report.',
  },

  VIEW_MODAL: {
    TITLE: 'Logbook Details',
    CLOSE: 'Close',
    NO_SUMMARY: 'No summary.',
    NO_ISSUE: 'No issues reported.',
    NO_PLAN: 'No plan recorded.',
    NA: 'N/A',
  },

  DELETE_MODAL: {
    TITLE: 'Delete Logbook',
    CONTENT: 'Are you sure you want to delete this logbook?',
    CONFIRM: 'Confirm Delete',
    CANCEL: 'Cancel',
  },
};

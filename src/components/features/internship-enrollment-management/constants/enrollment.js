import {
  ENROLLMENT_STATUS,
  PLACEMENT_STATUS,
} from '@/constants/internship-management/internship-management';

export const STUDENT_ENROLLMENT = {
  TITLE: 'Student Enrollment',
  SEARCH_PLACEHOLDER: 'Search by name or student ID...',
  STATUS_FILTER: 'Status: All',
  MAJOR_FILTER: 'Major: All',
  STATUS_OPTIONS: [
    { label: 'Placed', value: 'PLACED' },
    { label: 'Unplaced', value: 'UNPLACED' },
    { label: 'Withdrawn', value: 'WITHDRAWN' },
  ],
  STATUS_LABELS: {
    ACTIVE: 'Active',
    PLACED: 'Placed',
    UNPLACED: 'Unplaced',
    WITHDRAWN: 'Withdrawn',
  },
  PLACEMENT_LABELS: {
    PLACED: 'Placed',
    UNPLACED: 'Unplaced',
  },
  SEARCH: {
    PLACEHOLDER: 'Search by name, email or major...',
    TERM_PLACEHOLDER: 'Select Internship Term',
  },
  ACTIONS: {
    ADD: 'Add Student',
    IMPORT: 'Import from Excel',
    EDIT: 'Edit',
    DELETE: 'Withdraw',
    VIEW: 'View Details',
    RECOVER: 'Re-enroll',
  },
  TABLE: {
    COLUMNS: {
      FULL_NAME: 'FULL NAME',
      STUDENT_ID: 'STUDENT ID',
      EMAIL: 'EMAIL',
      MAJOR: 'MAJOR',
      PLACEMENT: 'PLACEMENT',
      STATUS: 'STATUS',
      ACTIONS: 'ACTIONS',
    },
  },
  MODALS: {
    ADD_EDIT: {
      TITLE_ADD: 'Add New Student',
      SUBTITLE_ADD: 'Add a new student to the internship enrollment list',
      TITLE_EDIT: 'Update Student Information',
      SUBTITLE_EDIT: 'Update detailed information for student',
      TITLE_VIEW: 'Student Details',
      SUBTITLE_VIEW: 'View detailed information and internship status',

      SECTION_PERSONAL: 'Personal Information',
      SECTION_PLACEMENT: 'Placement Settings',

      NAME_LABEL: 'Full Name',
      NAME_PLACEHOLDER: 'Ex: John Doe',
      NAME_REQUIRED: 'Please enter full name',

      ID_LABEL: 'Student ID',
      ID_PLACEHOLDER: 'Ex: ST2024001',
      ID_REQUIRED: 'Please enter student ID',
      ID_EDIT_INFO: 'Student ID cannot be changed once enrolled.',

      EMAIL_LABEL: 'Student Email',
      EMAIL_PLACEHOLDER: 'Ex: student@university.edu',
      EMAIL_REQUIRED: 'Please enter student email',
      EMAIL_INVALID: 'Invalid email address',

      MAJOR_LABEL: 'Major',
      MAJOR_PLACEHOLDER: 'Ex: Software Engineering',
      MAJOR_REQUIRED: 'Please enter major',

      PHONE_LABEL: 'Phone Number',
      PHONE_PLACEHOLDER: 'Ex: 0901234567',
      DOB_LABEL: 'Date of Birth',
      ENROLL_DATE_LABEL: 'Enrollment Date',
      NOTE_LABEL: 'Enrollment Note',
      NOTE_PLACEHOLDER: 'Enter any notes about this enrollment...',
      VALIDATION: {
        ENTERPRISE_REQUIRED: 'Please select an enterprise for placed students',
      },

      STATUS_LABEL: 'Current Status',
      ENTERPRISE_LABEL: 'Assigned Enterprise',
      ENTERPRISE_PLACEHOLDER: 'Not assigned yet',

      CANCEL: 'Cancel',
      SUBMIT_ADD: 'Add Student',
      SUBMIT_EDIT: 'Update',
      CLOSE: 'Close',

      TABS: {
        GENERAL: 'General',
        PLACEMENT: 'Placement',
        FEEDBACK: 'Feedback',
      },
      FEEDBACK_EMPTY: {
        TITLE: 'No Feedback Records',
        SUBTITLE: 'Evaluations will appear here later',
      },
      PHASE_TEXT: {
        PREFIX: 'This student is currently in the',
        SUFFIX:
          'phase. Business details and evaluations will be updated as the internship progresses.',
      },
    },
    IMPORT: {
      TITLE: 'Import Student List',
      SUBTITLE: 'Upload student list to enroll them in the internship term',
      DRAG_TEXT: 'Drag & drop file here or click to select',
      HINT_TEXT: 'Supports .xls, .xlsx files. Max size 10MB.',
      PREPARATION_TITLE: 'Step 1: Preparation',
      PREPARATION_HINT: 'Use our template for best results',
      DOWNLOAD_TEMPLATE: 'Download template here',
      PREVIEW_TITLE: 'Data Preview',
      VALID_TAG: 'Valid',
      INVALID_TAG: 'Error',
      CANCEL: 'Cancel',
      SUBMIT: 'Start Import',

      PREVIEW_COLUMNS: {
        FULL_NAME: 'Full Name',
        STUDENT_ID: 'Student ID',
        EMAIL: 'Email',
        VALIDITY: 'Validity',
      },
      TOOLTIPS: {
        VALID: 'Valid Data',
        ERROR: 'Data Error',
      },
      ERRORS: {
        MISSING_ID: 'Missing Student ID',
      },
      VALIDATION: {
        FILE_SIZE_LIMIT: 'File must be smaller than 5MB!',
      },
      TEMPLATE_FILENAME: 'student_import_template.xlsx',
    },
  },
  MESSAGES: {
    IMPORT_SUCCESS: 'Student list imported successfully',
    IMPORT_ERROR: 'Failed to import student data',
    IMPORT_BULK_SUCCESS: 'Successfully imported {count} students',
    ADD_SUCCESS: 'Student added successfully',
    ADD_ERROR: 'Failed to add student',
    UPDATE_SUCCESS: 'Information updated successfully',
    UPDATE_ERROR: 'Failed to update student',
    DELETE_CONFIRM_TITLE: 'Withdraw Student',
    DELETE_CONFIRM_TEXT:
      'Are you sure you want to withdraw student "{name}" from the internship term? This action cannot be undone.',
    DELETE_SUCCESS: 'Student deleted successfully',
    DELETE_ERROR: 'Failed to withdraw student',
    LOAD_ERROR: 'Failed to load students',
    RESTORE_SUCCESS: 'Student re-enrolled successfully',
    RESTORE_ERROR: 'Failed to re-enroll student',
    DOWNLOAD_TEMPLATE_ERROR: 'Failed to download template',
    DETAIL_LOAD_ERROR: 'Failed to load student details',
    BULK_WITHDRAW_SUCCESS: 'Successfully withdrawn selected students',
    WITHDRAW_PLACED_ERROR:
      'Cannot withdraw a student who is already PLACED. Please cancel their placement first.',
    BULK_WITHDRAW_PLACED_ERROR:
      '{count} student(s) are already PLACED. Please cancel their placement before withdrawing.',
  },
};

export const ENROLLMENT_STATUS_MAP = {
  [ENROLLMENT_STATUS.ACTIVE]: 'ACTIVE',
  [ENROLLMENT_STATUS.WITHDRAWN]: 'WITHDRAWN',
};

export const PLACEMENT_STATUS_MAP = {
  [PLACEMENT_STATUS.UNPLACED]: 'UNPLACED',
  [PLACEMENT_STATUS.PLACED]: 'PLACED',
};

export const REVERSE_ENROLLMENT_MAP = {
  ACTIVE: ENROLLMENT_STATUS.ACTIVE,
  WITHDRAWN: ENROLLMENT_STATUS.WITHDRAWN,
};

export const REVERSE_PLACEMENT_MAP = {
  UNPLACED: PLACEMENT_STATUS.UNPLACED,
  PLACED: PLACEMENT_STATUS.PLACED,
};

export const VIOLATION_REPORT_UI = {
  TITLE: 'Violation Reports',
  CREATE_BUTTON: 'Create Report',
  SEARCH_PLACEHOLDER: 'Search student name or code',
  EMPTY_MESSAGE: 'No violation reports found',
  CREATE_SUCCESS: 'Violation report created successfully',
  CREATE_FAIL: 'Failed to create violation report. Please try again',
  UPDATE_SUCCESS: 'Violation report updated successfully',
  UPDATE_FAIL: 'Failed to update violation report. Please try again',
  DELETE_SUCCESS: 'Violation report deleted successfully',
  DELETE_FAIL: 'Failed to delete violation report. Please try again',

  TABLE: {
    COLUMNS: {
      INDEX: '#',
      STUDENT_NAME: 'Student Name',
      STUDENT_CODE: 'Student Code',
      INTERN_GROUP: 'Intern Group',
      CREATED_TIME: 'Created Time',
      INCIDENT_DATE: 'Incident Date',
      DESCRIPTION: 'Description',
      ACTIONS: 'Actions',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
      DELETE: 'Delete',
    },
  },

  FILTERS: {
    DATE_RANGE: 'Incident Date Range',
    START_DATE: 'Start Date',
    END_DATE: 'End Date',
    GROUP: 'Group',
    CREATED_BY: 'Created By',
    RESET: 'Reset Filter',
  },

  FORM: {
    CREATE_TITLE: 'Create Violation Report',
    EDIT_TITLE: 'Edit Violation Report',
    STUDENT: 'Student',
    INCIDENT_DATE: 'Incident Date',
    DESCRIPTION: 'Description',
    PLACEHOLDERS: {
      STUDENT: 'Select a student',
      INCIDENT_DATE: 'Select date',
      DESCRIPTION: 'Enter description of the incident',
    },
    VALIDATION: {
      STUDENT_REQUIRED: 'Please select a student',
      DATE_REQUIRED: 'Please select an incident date',
      DATE_FUTURE: 'Incident date cannot be in the future',
      DATE_BEFORE_START: 'Incident date must be after or on internship start date',
      DESCRIPTION_REQUIRED: 'Please enter a description',
    },
  },

  DETAIL: {
    TITLE: 'Violation Report Detail',
    STUDENT_INFO: 'Student Information',
    VIOLATION_INFO: 'Violation Information',
    STUDENT_NAME: 'Name',
    STUDENT_CODE: 'Student Code',
    UNIVERSITY: 'University',
    INTERN_GROUP: 'Intern Group',
    MENTOR: 'Mentor',
    CREATED_TIME: 'Created Time',
    CREATED_BY: 'Created By',
    INCIDENT_DATE: 'Incident Date',
    DESCRIPTION: 'Description',
  },

  CONFIRM: {
    DELETE_TITLE: 'Delete Violation Report',
    DELETE_CONTENT:
      'Are you sure you want to delete this violation report? This action cannot be undone.',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
  },
};

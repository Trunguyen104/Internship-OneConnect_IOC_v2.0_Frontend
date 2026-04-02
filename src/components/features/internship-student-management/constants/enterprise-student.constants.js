export const ENTERPRISE_STUDENT_UI = {
  TITLE: 'Student Management',
  TABS: {
    STUDENTS: 'Students',
    GROUPS: 'Internship Groups',
  },
  SEARCH_PLACEHOLDER: 'Search by name, student code, email...',
  EMPTY_STATE: {
    MESSAGE: 'No students have been assigned to the company this term',
  },
  TABLE: {
    COLUMNS: {
      FULL_NAME: 'FULL NAME',
      STUDENT_ID: 'STUDENT ID',
      EMAIL: 'EMAIL',
      UNIVERSITY: 'UNIVERSITY',
      STATUS: 'STATUS',
      PLACED_STATUS: 'PLACED STATUS',
      GROUP: 'GROUP',
      MENTOR: 'MENTOR',
      PLACED_DATE: 'PLACED DATE',
      ACTIONS: 'ACTIONS',
    },
  },
  STATUS: {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    UNASSIGNED: 'Unassigned',
  },
  ACTIONS: {
    VIEW_DETAIL: 'View Details',
    ACCEPT: 'Accept',
    REJECT: 'Reject',
    CREATE_GROUP: 'Create Group',
    CHANGE_GROUP: 'Change Group',
    ADD_TO_GROUP: 'Add to existing group',
    ASSIGN_MENTOR: 'Assign Mentor',
  },
  FILTERS: {
    MONTH_YEAR: 'Month/Year',
    STATUS: 'Placement Status',
    GROUP_STATUS: 'Group Status',
    MENTOR_STATUS: 'Mentor Status',
  },
  MODALS: {
    REJECT: {
      TITLE: 'Reject Intern Application',
      REASON_LABEL: 'Reason for Rejection',
      REASON_PLACEHOLDER: 'Enter the reason for rejection (mandatory)...',
      REASON_REQUIRED: 'Reject reason is required',
      SUBMIT: 'Confirm Reject',
      CANCEL: 'Cancel',
    },
  },
  MESSAGES: {
    ACCEPT_SUCCESS: 'Student accepted successfully',
    REJECT_SUCCESS: 'Student rejected successfully',
    ACCEPT_ERROR: 'Failed to accept student',
    REJECT_ERROR: 'Failed to reject student',
    LOAD_ERROR: 'Failed to load student list',
    DETAIL_LOAD_ERROR: 'Failed to load details',
  },
  BADGES: {
    NO_GROUP: 'No Group',
  },
};

export const APPLICATION_STATUS_MAP = {
  0: 'Pending',
  1: 'Approved',
  2: 'Reversed',
  3: 'Rejected',
  4: 'Withdrawn',
};

export const REVERSE_APPLICATION_STATUS_MAP = {
  PENDING: 0,
  APPROVED: 1,
  ACCEPTED: 1,
  REJECTED: 3,
  WITHDRAWN: 4,
};

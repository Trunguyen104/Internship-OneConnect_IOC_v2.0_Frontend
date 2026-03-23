export const ENTERPRISE_GROUP_UI = {
  TITLE: 'Internship Groups',
  TABS: {
    STUDENTS: 'Students',
    GROUPS: 'Internship Groups',
  },
  SEARCH_PLACEHOLDER: 'Search groups by name or description...',
  EMPTY_STATE: {
    MESSAGE: 'No internship groups found for the selected term.',
  },
  TABLE: {
    COLUMNS: {
      GROUP_NAME: 'GROUP NAME',
      TRACK: 'TRACK',
      TERM: 'TERM',
      MENTOR: 'MENTOR',
      STUDENT_COUNT: 'STUDENTS',
      STATUS: 'STATUS',
      CREATED_AT: 'CREATED AT',
      ACTIONS: 'ACTIONS',
    },
    NOT_ASSIGNED: 'Not Assigned',
  },
  CARD: {
    VIEW_DETAILS: 'View Details',
    ASSIGN_MENTOR: 'Assign Mentor',
    CHANGE_MENTOR: 'Change Mentor',
    ARCHIVE_TOOLTIP: 'Archive Group',
  },
  STATUS: {
    IN_PROGRESS: 'Active',
    FINISHED: 'Finished', // Can't add/remove
    ARCHIVED: 'Archived', // Read only
  },
  ACTIONS: {
    VIEW_DETAIL: 'View Group Details',
    EDIT_GROUP: 'Edit Group',
    ADD_STUDENTS: 'Add Students',
    REMOVE_STUDENT: 'Remove Student',
    ARCHIVE_GROUP: 'Archive Group',
    DELETE_GROUP: 'Delete Group',
    CREATE_GROUP: 'Create New Group',
  },
  FILTERS: {
    STATUS: 'Status',
    TERM: 'Term',
  },
  MODALS: {
    CREATE: {
      TITLE: 'Create Internship Group',
      SUBMIT: 'Create Group',
    },
    EDIT: {
      TITLE: 'Edit Group Details',
      SUBMIT: 'Save Changes',
    },
    DELETE: {
      TITLE: 'Delete Group',
      CONTENT:
        'Are you sure you want to delete this group? This action cannot be undone unless the group contains no students.',
      SUBMIT: 'Confirm Delete',
    },
    ARCHIVE: {
      TITLE: 'Archive Group',
      CONTENT: 'Archiving this group will mark it as read-only. Are you sure?',
      SUBMIT: 'Confirm Archive',
    },
    VIEW: {
      DEFAULT_SUBTITLE: 'Internship Group Details',
      TRACK: 'TRACK/DOMAIN',
      NOT_ASSIGNED: 'Not Assigned',
      STATUS: 'STATUS',
      TERM: 'SEMESTER TERM',
      TOTAL_MEMBERS: 'TOTAL MEMBERS',
      STUDENTS_SUFFIX: 'Students',
      MENTOR: 'ASSIGNED MENTOR',
      PROJECT_NAME: 'PROJECT/CLIENT',
      MEMBERS: 'GROUP MEMBERS',
      CLOSE: 'Close',
    },
  },
  MESSAGES: {
    CREATE_SUCCESS: 'Group created successfully',
    UPDATE_SUCCESS: 'Group updated successfully',
    DELETE_SUCCESS: 'Group deleted successfully',
    ARCHIVE_SUCCESS: 'Group archived successfully',
    ADD_STUDENT_SUCCESS: 'Students added successfully',
    REMOVE_STUDENT_SUCCESS: 'Student removed successfully',
    ERROR: 'An error occurred. Please try again.',
    DELETE_ERROR_HAS_STUDENTS:
      'Cannot delete a group that currently has active students. Please remove students or archive the group instead.',
  },
};

export const GROUP_STATUS_MAP = {
  0: 'InProgress',
  1: 'Finished',
  2: 'Archived',
};

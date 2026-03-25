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
    ACTIVE: 1,
    FINISHED: 2,
    ARCHIVED: 3,
    LABELS: {
      1: 'Active',
      2: 'Finished',
      3: 'Archived',
    },
  },
  ACTIONS: {
    VIEW_DETAIL: 'View Group Details',
    EDIT_GROUP: 'Edit Group',
    ADD_STUDENTS: 'Add Students',
    ADD_TO_GROUP: 'Add Students',
    REMOVE_STUDENT: 'Remove Student',
    ARCHIVE_GROUP: 'Archive Group',
    DELETE_GROUP: 'Delete Group',
    CREATE_GROUP: 'Create Group',
    BACK_TO_LIST: 'Back to List',
  },
  FILTERS: {
    STATUS: 'Status',
    TERM: 'Internship Term',
  },
  MODALS: {
    CREATE: {
      TITLE: 'Create New Internship Group',
      SUBMIT: 'Create Group',
      SUBMIT_EDIT: 'Save Changes',
      SUBMIT_ADD: 'Add Students',
      TARGET_GROUP_LABEL: 'Target Group',
      ACTIVE_GROUP_LABEL: 'Active',
    },
    EDIT: {
      TITLE: 'Edit Group Information',
      SUBMIT: 'Save Changes',
    },
    DELETE: {
      TITLE: 'Delete Group',
      CONTENT: 'Are you sure you want to delete this group? This action cannot be undone.',
      SUBMIT: 'Confirm Delete',
    },
    ARCHIVE: {
      TITLE: 'Archive Group',
      CONTENT:
        'Are you sure you want to archive this group? It will no longer appear in the default list but data will be kept for reference.',
      SUBMIT: 'Confirm Archive',
    },
    VIEW: {
      TITLE: 'OVERVIEW',
      DEFAULT_SUBTITLE: 'Internship Group Information',
      GROUP_NAME: 'GROUP NAME',
      TRACK: 'DOMAIN/TRACK',
      NOT_ASSIGNED: 'Not Assigned',
      STATUS: 'STATUS',
      TERM: 'INTERNSHIP TERM',
      TOTAL_MEMBERS: 'TOTAL MEMBERS',
      STUDENTS_SUFFIX: 'Students',
      MENTOR: 'ASSIGNED MENTOR',
      PROJECT_NAME: 'PROJECT/ASSIGNMENT',
      ENTERPRISE: 'ENTERPRISE',
      TIMELINE: 'TIMELINE/ROADMAP',
      HISTORY: 'RECORD HISTORY',
      CREATED_AT: 'Created at:',
      MEMBERS: 'STUDENT LIST',
      DESCRIPTION: 'DESCRIPTION/NOTES',
      CLOSE: 'Close',
      TABLE: {
        CODE: 'Student ID',
        FULL_NAME: 'Full name',
        EMAIL: 'Email',
        SCHOOL: 'School',
        ACTION: 'Actions',
        ADD_STUDENT: 'Add Student',
      },
    },
  },
  MESSAGES: {
    CREATE_SUCCESS: 'Group created successfully.',
    UPDATE_SUCCESS: 'Information updated successfully.',
    DELETE_SUCCESS: 'Group deleted successfully.',
    ARCHIVE_SUCCESS: 'Group archived successfully.',
    ADD_STUDENT_SUCCESS: 'Student added to group.',
    REMOVE_STUDENT_SUCCESS: 'Student removed from group.',
    LOAD_ERROR: 'Could not load group information.',
    ERROR: 'An error occurred. Please try again later.',
    DELETE_ERROR_HAS_DATA:
      'Nhóm đã có dữ liệu làm việc (tasks/violations). Vui lòng sử dụng tính năng Lưu trữ (Archive) thay vì Xóa để bảo toàn lịch sử.',
    DELETE_CONFIRM_HAS_STUDENTS:
      "Nhóm có sinh viên. Khi xóa, sinh viên sẽ tự động được đưa về danh sách 'Chưa có nhóm'. Bạn có chắc chắn muốn xóa?",
  },
};

export const GROUP_STATUS_MAP = {
  1: 'Active',
  2: 'Finished',
  3: 'Archived',
};

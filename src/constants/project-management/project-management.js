export const PROJECT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  COMPLETED: 2,
  ARCHIVED: 3,
};

export const INTERN_GROUP_STATUS = {
  ACTIVE: 1,
  COMPLETED: 2,
  ARCHIVED: 3,
};

// AC-01 Visibility Status
export const VISIBILITY_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
};

export const VISIBILITY_LABELS = {
  [VISIBILITY_STATUS.DRAFT]: 'Draft',
  [VISIBILITY_STATUS.PUBLISHED]: 'Published',
};

// AC-01 Operational Status
export const OPERATIONAL_STATUS = {
  UNSTARTED: 0,
  ACTIVE: 1,
  COMPLETED: 2,
  ARCHIVED: 3,
};

export const OPERATIONAL_LABELS = {
  [OPERATIONAL_STATUS.UNSTARTED]: 'Unstarted',
  [OPERATIONAL_STATUS.ACTIVE]: 'Active',
  [OPERATIONAL_STATUS.COMPLETED]: 'Completed',
  [OPERATIONAL_STATUS.ARCHIVED]: 'Archived',
};

export const getVisibilityStatus = (val) => {
  if (val === undefined || val === null) return VISIBILITY_STATUS.DRAFT;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const key = Object.keys(VISIBILITY_STATUS).find((k) => k.toLowerCase() === val.toLowerCase());
    if (key) return VISIBILITY_STATUS[key];
  }
  return VISIBILITY_STATUS.DRAFT;
};

export const getOperationalStatus = (val) => {
  if (val === undefined || val === null) return OPERATIONAL_STATUS.UNSTARTED;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const key = Object.keys(OPERATIONAL_STATUS).find((k) => k.toLowerCase() === val.toLowerCase());
    if (key) return OPERATIONAL_STATUS[key];
  }
  return OPERATIONAL_STATUS.UNSTARTED;
};

export const PROJECT_STATUS_VARIANTS = {
  [PROJECT_STATUS.DRAFT]: 'warning-soft',
  [PROJECT_STATUS.PUBLISHED]: 'primary',
  [PROJECT_STATUS.COMPLETED]: 'success',
  [PROJECT_STATUS.ARCHIVED]: 'default',
};

export const STATUS_VARIANTS = {
  // Operational
  [OPERATIONAL_STATUS.UNSTARTED]: 'warning-soft',
  [OPERATIONAL_STATUS.ACTIVE]: 'primary',
  [OPERATIONAL_STATUS.COMPLETED]: 'success',
  [OPERATIONAL_STATUS.ARCHIVED]: 'default',
  // Visibility
  [VISIBILITY_STATUS.DRAFT]: 'warning',
  [VISIBILITY_STATUS.PUBLISHED]: 'info',
};

export const PROJECT_MANAGEMENT = {
  TITLE: 'Project Management',
  CREATE_BTN: 'Create Project',
  SEARCH_PLACEHOLDER: 'Search projects by name or code...',
  COMMON: {
    N_A: '-',
    DASH: '-',
    UNKNOWN: 'Unknown',
    LOADING: 'Loading...',
    BACK_TO_LIST: 'Back to List',
    ENTERPRISE: 'Enterprise',
  },
  TABS: {
    DETAIL: 'Project Details',
    RESOURCES: 'Resources & Deliverables',
    STUDENTS: 'Assigned Students',
  },
  TABLE: {
    COLUMNS: {
      INDEX: '#',
      NAME: 'PROJECT NAME',
      CODE: 'PROJECT CODE',
      GROUP: 'INTERN GROUP',
      FIELD: 'FIELD',
      TIMELINE: 'TIMELINE',
      VISIBILITY: 'VISIBILITY',
      STATUS: 'OPERATIONAL',
      ACTIONS: 'ACTIONS',
    },
    EMPTY_MESSAGE: 'You have no projects yet. Create a new project to get started.',
    STATUS_TEXT: {
      ORPHANED_TITLE: 'Intern group has been disbanded',
      ORPHANED_HINT: 'Reassign to a new group to reactive project',
      NO_GROUP: 'No group assigned',
      GROUP_ARCHIVED: 'GROUP ARCHIVED',
    },
    ACTIONS_LABEL: {
      VIEW: 'View',
      EDIT: 'Edit',
      PUBLISH: 'Publish',
      UNPUBLISH: 'Unpublish',
      COMPLETE: 'Mark as Completed',
      ARCHIVE: 'Archive',
      DELETE: 'Delete Project',
      ASSIGN_GROUP: 'Assign Group',
    },
  },
  FILTERS: {
    GROUP_FILTER: 'Intern Group',
    STATUS_FILTER: 'Operational Status',
    VISIBILITY_FILTER: 'Visibility',
    SHOW_ARCHIVED: 'Show Archived',
    ALL_GROUPS: 'All Groups',
    ALL_STATUSES: 'All Statuses',
  },
  FORM: {
    SECTIONS: {
      BASIC_INFO: 'Basic Information',
      TIMELINE: 'Project Timeline',
      RESOURCES: 'Resources & Deliverables',
    },
    TITLE_DETAIL: 'Project Details',
    TITLE_ADD: 'Create Brand New Project',
    TITLE_EDIT: 'Edit Project Details',
    TITLE_VIEW: 'Project Details',
    DESC: 'Define the scope, goals, and technical requirements for this project.',
    CANCEL_BTN: 'Cancel',
    SAVE_DRAFT: 'Save Draft',
    PUBLISH: 'Save',
    SAVE_CHANGES: 'Save Changes',
    CANCEL: 'Cancel',
    LABEL: {
      NAME: 'Project Name',
      CODE: 'Project Code',
      GROUP: 'Intern Group',
      FIELD: 'Project Field',
      TEMPLATE: 'Project Template',
      START_DATE: 'Start Date',
      END_DATE: 'End Date',
      DESCRIPTION: 'Description',
      REQUIREMENTS: 'Technical Requirements',
      DELIVERABLES: 'Key Deliverables/Outcomes',
      ADD_LINK: 'Add Quick Link',
      PHASE: 'Phase:',
      N_A: 'N/A',
    },
    PLACEHOLDER: {
      NAME: 'Enter project name',
      CODE: 'Project code is auto-generated',
      GROUP: 'Select an intern group (Active only)',
      FIELD: 'Select project field/domain',
      DATE: 'Select date',
      DESCRIPTION: 'Brief project overview...',
      REQUIREMENTS: 'Technical stack, tools, environment...',
      DELIVERABLES: 'Source code, documentation, presentations...',
      UPLOAD_PRIMARY: 'Click or drag files to this area to upload',
      UPLOAD_HINT: 'Support for PDF, DOCX, ZIP, etc.',
      QUICK_LINKS: 'Quick Links',
      LINK_TITLE: 'Link Title (e.g. Figma, PRD)',
      URL: 'URL',
    },
    VALIDATION: {
      NAME_REQUIRED: 'Please enter project name',
      CODE_REQUIRED: 'Project code is required',
      GROUP_REQUIRED: 'Please select an intern group',
      FIELD_REQUIRED: 'Please select a project field',
      DESC_REQUIRED: 'Description is required',
      REQ_REQUIRED: 'Technical requirements are required',
      GROUP_MUST_SELECT: 'Group must be selected before publishing',
      DESC_REQUIRED: 'Description is required',
      REQ_REQUIRED: 'Technical requirements are required',
      MISSING_TITLE: 'Missing title',
      MISSING_LINK_TITLE: 'Missing title',
      MISSING_URL: 'Missing URL',
    },
    FIELD_OPTIONS: {
      TEMPLATE: {
        SCRUM: 'Scrum',
        KANBAN: 'Kanban',
        NONE: 'None',
      },
      FIELD: {
        IT: 'Information Technology',
        Econ: 'Economics',
        Comm: 'Communications',
        Lang: 'Languages',
        Other: 'Other',
      },
    },
    TEMPLATE_MAP: {
      Scrum: 0,
      Kanban: 1,
      None: 2,
    },
    TEMPLATE_LABELS: {
      0: 'Scrum',
      1: 'Kanban',
      2: 'None',
    },
  },
  DETAIL: {
    TITLE: 'Project Details',
    NO_CODE: 'NO-CODE',
    LABELS: {
      VISIBILITY: 'Visibility',
      OPERATIONAL: 'Operational',
    },
    SECTIONS: {
      DESCRIPTION: 'Project Description',
      DESCRIPTION_EMPTY: 'No description updated yet.',
      MENTOR: 'Project Mentor',
      FIELD_TEMPLATE: 'Field & Template',
      FIELD: 'Field',
      TIMELINE: 'Project Timeline',
      GROUP_INFO: 'Intern Group Info',
      REQUIREMENTS: 'Technical Requirements',
      REQUIREMENTS_EMPTY: 'No technical requirements updated.',
      DELIVERABLES: 'Key Deliverables/Outcomes',
      DELIVERABLES_EMPTY: 'No deliverables defined yet.',
      RESOURCES: 'Project Documents',
      RESOURCES_HINT: 'View and download project files',
      LINKS: 'Quick Links',
      NO_RESOURCES: 'No attachments for this project.',
      NO_LINKS: 'No external links available.',
      TEMPLATE_PREFIX: 'Template: ',
      NA: 'N/A',
      TBA: '-',
    },
    RESOURCES: {
      ACCESS: 'Open/Download',
      INTERNAL: 'Internal Document',
      EXTERNAL: 'External Link',
    },
    GROUP: {
      NOT_ASSIGNED: 'Not Assigned',
      NOT_ASSIGNED_HINT: 'Please go to Edit to assign an Intern Group before publishing.',
      DELETED: 'Group Deleted',
      DELETED_HINT: 'This group has been removed. Project needs to be reassigned.',
      ID: 'Group ID',
      MENTOR: 'Group Mentor',
      STUDENT_COUNT: 'Student Count',
      STUDENTS_SUFFIX: 'students',
      MANAGE_LINK: 'Manage Group',
      ARCHIVED_LABEL: 'Group Archived',
      ARCHIVED_VALUE: 'Archived',
      TBA: '-',
      ASSIGN_BTN: 'Assign Group',
    },
    STUDENTS: {
      TITLE: 'Project Students',
      SEARCH_PLACEHOLDER: 'Search students by name or ID...',
      COUNT_LABEL: 'Total:',
      EMPTY_MESSAGE: 'No students in this group yet.',
      EMPTY_HINT: 'HR needs to add students to this group (AC-G05).',
      UNASSIGN: 'Unassign',
      ACTIVE: 'Active',
      COLUMNS: {
        NAME: 'Full Name',
        UNIVERSITY: 'University',
        EMAIL: 'Email',
        STATUS: 'Status',
        ACTION: 'Action',
      },
      STATUS_ACTIVE: 'Active',
      STATUS_ENDED: 'Ended',
    },
  },
  MESSAGES: {
    SUCCESS_SAVE_DRAFT: 'Draft saved automatically.',
    SUCCESS_SAVE_PUBLISH: 'Project saved and published successfully.',
    SUCCESS_UNPUBLISH: 'Project unpublished successfully.',
    SUCCESS_ARCHIVE: 'Project archived successfully.',
    PUBLISH_SUCCESS: 'Project has been published successfully.',
    COMPLETE_SUCCESS: 'Project marked as completed successfully.',
    COMPLETE_CONFIRM: 'This project will be marked as completed. Are you sure?',
    COMPLETE_EARLY_WARNING:
      'The intern phase for group "{groupName}" is still active until {date}. Completing the project early will move it into read-only mode. Proceed?',
    UPDATE_SUCCESS: 'Project updated successfully.',
    DELETE_SUCCESS: 'Project deleted successfully.',
    DELETE_CONFIRM: 'Are you sure you want to delete this project? This action cannot be undone.',
    ASSIGN_SUCCESS: 'Successfully assigned {count} students to project.',
    UNASSIGN_SUCCESS: 'Student removed from project.',
    EDIT_WARNING:
      'Updating this project may affect the {count} students currently participating. Continue?',
    ERROR_ARCHIVED_GROUP: 'Cannot publish project for an archived group.',
    ERROR_ASSIGNED_STU:
      'Project has student interaction data (logbook/evaluation) and cannot be deleted. Please mark it as completed instead.',
    WARNING_COMPLETE_STU:
      'There are {count} students who haven’t completed the project. The project can still be marked as completed.',
    ORPHANED_GROUP_TOOLTIP: 'Intern group was deleted. A new group must be assigned to publish.',
    ORPHANED_GROUP_NOTIFY:
      'Intern group "{groupName}" has been disbanded. Project "{projectName}" has been moved to Draft. Please assign a new group.',
    ORPHANED_PROJECTS_PLURAL:
      'There are {count} projects whose intern groups have been disbanded and moved to Draft.',
    ORPHANED_GROUP_BADGE: 'No group assigned',
    ERROR_INACTIVE_GROUP: 'Cannot save project for a finished or archived group.',
    ERROR_PUBLISH_NO_GROUP:
      'Project must be assigned to an intern group before it can be published.',
    ERROR_PUBLISH_NO_GROUP_VN: 'not assigned to any intern group',
    ERROR_ALREADY_PUBLISHED_VN: 'Only projects in Draft status can be published',
    ERROR_FETCH_DETAIL: 'Failed to fetch project details',
    ERROR_FETCH_GROUPS: 'Failed to fetch supporting data',
    ERROR_UPDATE_PREVALIDATE: 'Failed to pre-validate project save',
    ERROR_CHECK_BOUNDS: 'Encountered error while checking group change constraints',
    ERROR_RESOURCE_ACCESS: 'Could not open file. Access denied or file removed.',
    ERROR_PUBLISH: 'Failed to publish project',
    ERROR_UNPUBLISH: 'Failed to unpublish project',
    ERROR_ARCHIVE: 'Failed to archive project',
    ERROR_COMPLETE: 'Failed to complete project',
    ERROR_DELETE: 'Failed to delete project',
    ERROR_HAS_DATA_BACKEND:
      'This project cannot be moved because it already has operational data (work items or sprints).',
    ERROR_GENERAL: 'An error occurred while processing your request',
  },
  MODALS: {
    UPDATE_WARNING_TITLE: 'Project Update Warning',
    COMPLETE_CONFIRM_TITLE: 'Confirm Project Completion',
    DELETE_CONFIRM_TITLE: 'Confirm Delete Project',
    DELETE_UNABLE_TITLE: 'Cannot Delete Project',
    DELETE_OWNERSHIP_ERROR: 'You can only delete projects you created.',
    ASSIGN_GROUP: {
      TITLE: 'Assign Intern Group',
      DESC: 'Select an active Intern Group to assign to project <b>{name}</b>:',
      PLACEHOLDER: 'Select an Intern Group',
      CURRENT_GROUP: 'Current Group',
      CONFIRM: 'Confirm Assignment',
      SUCCESS_ASSIGN: 'Group assigned successfully.',
      ERROR_BACKEND: 'Backend error during assignment',
      ERROR_FAILED: 'Assignment failed: ',
    },
  },
};

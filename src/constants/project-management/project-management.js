export const PROJECT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  COMPLETED: 2,
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.DRAFT]: 'Draft',
  [PROJECT_STATUS.PUBLISHED]: 'Published',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
};

export const PROJECT_STATUS_VARIANTS = {
  [PROJECT_STATUS.DRAFT]: 'warning-soft',
  [PROJECT_STATUS.PUBLISHED]: 'primary',
  [PROJECT_STATUS.COMPLETED]: 'success',
};

export const PROJECT_MANAGEMENT = {
  TITLE: 'Project Management',
  CREATE_BTN: 'Create Project',
  SEARCH_PLACEHOLDER: 'Search projects by name or code...',
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
      TEMPLATE: 'TEMPLATE',
      START_DATE: 'START DATE',
      END_DATE: 'END DATE',
      STATUS: 'STATUS',
      ACTIONS: 'ACTIONS',
    },
    EMPTY_MESSAGE: 'No projects found. Create a new project to get started.',
  },
  FILTERS: {
    GROUP_FILTER: 'Intern Group',
    STATUS_FILTER: 'Status',
    ALL_GROUPS: 'All Groups',
    ALL_STATUSES: 'All Statuses',
  },
  FORM: {
    SECTIONS: {
      BASIC_INFO: 'Basic Information',
      TIMELINE: 'Project Timeline',
      RESOURCES: 'Resources & Deliverables',
    },
    TITLE_ADD: 'Create Brand New Project',
    TITLE_EDIT: 'Edit Project Details',
    DESC: 'Define the scope, goals, and technical requirements for this project.',
    SAVE_DRAFT: 'Save Draft',
    PUBLISH: 'Publish Project',
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
    },
    VALIDATION: {
      NAME_REQUIRED: 'Please enter project name',
      CODE_REQUIRED: 'Project code is required',
      GROUP_REQUIRED: 'Please select an intern group',
      FIELD_REQUIRED: 'Please select a project field',
      GROUP_MUST_SELECT: 'Group must be selected before publishing',
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
    SECTIONS: {
      DESCRIPTION: 'Project Description',
      DESCRIPTION_EMPTY: 'No description updated yet.',
      MENTOR: 'Project Mentor',
      FIELD_TEMPLATE: 'Field & Template',
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
    },
    STUDENTS: {
      SEARCH_PLACEHOLDER: 'Search students by name or ID...',
      COUNT_LABEL: 'Total:',
      EMPTY_MESSAGE: 'No students in this group yet.',
      EMPTY_HINT: 'HR needs to add students to this group (AC-G05).',
    },
    RESOURCES: {
      ACCESS: 'Open/Download',
      INTERNAL: 'Internal Document',
      EXTERNAL: 'External Link',
    },
  },
  MESSAGES: {
    PUBLISH_SUCCESS: 'Project has been published successfully.',
    COMPLETE_SUCCESS: 'Project marked as completed.',
    COMPLETE_CONFIRM: 'Project will be marked as completed. Are you sure?',
    UPDATE_SUCCESS: 'Project updated successfully.',
    DELETE_SUCCESS: 'Project deleted successfully.',
    DELETE_CONFIRM: 'Are you sure you want to delete this project? This action cannot be undone.',
    ASSIGN_SUCCESS: 'Successfully assigned {count} students to project.',
    UNASSIGN_SUCCESS: 'Student removed from project.',
    EDIT_WARNING:
      'Project has {count} students assigned. Changes may affect progress. Are you sure?',
    ERROR_ARCHIVED_GROUP: 'Cannot publish project for an archived group.',
    ERROR_ASSIGNED_STU:
      'Project has student activity data and cannot be deleted. Please complete the project first.',
    WARNING_COMPLETE_STU:
      'There are {count} students who haven’t completed the project. The project can still be marked as completed.',
    ORPHANED_GROUP_TOOLTIP: 'Intern group was deleted. A new group must be assigned to publish.',
    ORPHANED_GROUP_NOTIFY:
      'Intern group "{groupName}" has been disbanded. Project "{projectName}" has been moved to Draft. Please assign a new group.',
    ORPHANED_GROUP_BADGE: 'No group assigned',
    ERROR_INACTIVE_GROUP: 'Cannot save project for a finished or archived group.',
    ERROR_PUBLISH_NO_GROUP:
      'Project must be assigned to an intern group before it can be published.',
    ERROR_PUBLISH_NO_GROUP_VN: 'chưa được gắn với nhóm thực tập',
  },
};

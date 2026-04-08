export const BACKLOG_UI = {
  // Loading & Empty States
  LOADING: 'Loading data...',
  LOADING_LIST: 'Loading list...',
  EMPTY_ISSUES: 'No issues in this Epic.',
  SELECT_EPIC_PROMPT: 'Please select an Epic to view its issues.',

  // Selectors & Sidebar
  SELECT_ALL: 'Select All',
  SELECT_AN_EPIC: 'Select an Epic...',
  SELECT_ISSUE_SPRINT: 'Select Issue for Sprint',
  ALL: 'All',
  HIDE: 'Hide',
  EPIC_HIDDEN: 'Epic is hidden',
  UNKNOWN_EPIC: 'Unknown Epic',

  // Sections & Headers
  BACKLOG_TITLE: 'Backlog',
  SEARCH_PLACEHOLDER: 'Search',
  FILTER: 'Filter',

  // Drag and drop areas
  DROP_TO_BACKLOG: 'Drop here to move to Backlog',
  DROP_TO_SPRINT: 'Drop here to move to Sprint',

  // Actions / Buttons
  CREATE_SPRINT: 'Create Sprint',
  CREATE_SPRINT_NEW: 'Create new Sprint',
  CREATE_TASK: 'Create Task',
  CREATE_EPIC: 'Create Epic',
  START_SPRINT: 'Start Sprint',
  COMPLETE_SPRINT: 'Complete Sprint',
  EDIT_SPRINT: 'Edit Sprint',
  DELETE_SPRINT: 'Delete Sprint',
  CANCEL: 'Cancel',
  CREATE: 'Create',
  UPDATE: 'Update',

  // Modal Titles
  MODAL_CREATE_EPIC: 'Create Epic',
  MODAL_CREATE_TASK: 'Create Task',
  MODAL_CREATE_TASK_SUBTITLE: 'Create new tasks and configure details for your sprint plan',
  UPDATE_TASK: 'Update Task',
  UPDATE_TASK_SUBTITLE: 'Refine task details, status, and progression for your team',
  MODAL_CREATE_EPIC_SUBTITLE: 'Define major objectives and long-term project roadmap',
  MODAL_UPDATE_EPIC_SUBTITLE: 'Update detailed information and deadlines for major goals',
  MODAL_CREATE_SPRINT_SUBTITLE: 'Plan your next sprint and select priority items from the backlog',
  MODAL_UPDATE_SPRINT_SUBTITLE: 'Update names and core objectives for the current work cycle',

  // Field Labels (English forms in some components)
  FIELD_EPIC_NAME: 'Epic Name',
  FIELD_DESCRIPTION: 'Description',
  FIELD_END_DATE: 'End Date',
  FIELD_SUMMARY: 'Summary',

  // Field Labels (Vietnamese forms translated)
  FIELD_SPRINT_NAME: 'Sprint Name',
  FIELD_SPRINT_GOAL: 'Sprint Goal',
  FIELD_START_DATE: 'Start Date',

  // Tasks Details Sidebar
  DETAILS: 'Details',
  STATUS: 'Status',
  TYPE: 'Type',
  EPIC: 'Epic',
  SPRINT: 'Sprint',
  ASSIGNEE: 'Assignee',
  PRIORITY: 'Priority',
  DUE_DATE: 'Due Date',
  STORY_POINTS: 'Story Points',
  PTS: 'Pts',
  ISSUE: 'Issue',
  USER: 'User',

  // Complete Sprint Options
  OPT_PRODUCT_BACKLOG: 'Product Backlog',
  OPT_NEXT_SPRINT: 'Next Sprint',

  // Types, Status, Priorities
  TYPE_EPIC: 'Epic',
  TYPE_USER_STORY: 'User Story',
  TYPE_TASK: 'Task',
  TYPE_SUBTASK: 'Subtask',

  STATUS_TODO: 'To Do',
  STATUS_IN_PROGRESS: 'In Progress',
  STATUS_REVIEW: 'Review',
  STATUS_DONE: 'Done',
  STATUS_CANCELLED: 'Cancelled',

  PRIORITY_LOW: 'Low',
  PRIORITY_MEDIUM: 'Medium',
  PRIORITY_HIGH: 'High',
  PRIORITY_CRITICAL: 'Critical',

  // Complete Sprint Modal
  COMPLETE_SPRINT_TITLE: 'Complete Sprint',
  INCOMPLETE_ISSUES_PROMPT: 'Incomplete issues will be moved to:',
  OPT_NEW_SPRINT: 'Create new Sprint',
  NO_PLANNED_SPRINT: 'No planned sprints',
  PLACEHOLDER_NEW_SPRINT: 'Enter new sprint name...',

  // Placeholders
  PLACEHOLDER_EPIC_SUMMARY: 'Enter Epic name...',
  PLACEHOLDER_DESC: 'Enter detailed description...',
  PLACEHOLDER_SPRINT_NAME: 'Enter Sprint name...',
  PLACEHOLDER_SPRINT_GOAL: 'Enter Sprint goal (optional)...',
  PLACEHOLDER_SUMMARY: 'Enter summary...',
  PLACEHOLDER_START_DATE: 'Select start date',
  PLACEHOLDER_END_DATE: 'Select end date',
  PLACEHOLDER_SPRINT_OPTIONAL: 'Select Sprint (Optional)',
  FIELD_ASSIGNEE: 'Assignee',
  FIELD_STATUS: 'Status',
  FIELD_TYPE: 'Type',
  FIELD_SPRINT: 'Sprint',
  FIELD_PRIORITY: 'Priority',
  FIELD_DUE_DATE: 'Due Date',
  FIELD_STORY_POINTS: 'Story Points',
  SELECT: 'Select',

  // Toast Messages
  SUCCESS_CREATE_EPIC: 'Epic created successfully',
  ERROR_CREATE_EPIC: 'Error creating epic',
  SUCCESS_START_SPRINT: 'Sprint started successfully',
  ERROR_START_SPRINT: 'Error starting sprint',
  SUCCESS_COMPLETE_SPRINT: 'Sprint completed successfully',
  ERROR_COMPLETE_SPRINT: 'Error completing sprint',
  SUCCESS_CREATE_TASK: 'Task created successfully!',
  SUCCESS_CREATE_TASK_SPRINT: 'Task created and added to sprint successfully!',
  ERROR_CREATE_TASK: 'Error creating task',
  SUCCESS_UPDATE_TASK: 'Task updated successfully!',
  ERROR_UPDATE_TASK: 'Error updating task',
  SUCCESS_CREATE_SPRINT: 'Sprint created successfully!',
  ERROR_CREATE_SPRINT: 'Error creating sprint',

  // No Project State
  NO_PROJECT_TITLE: 'No Project Assigned',
  NO_PROJECT_DESC:
    'This internship group has not been linked to a project yet. Please contact your mentor or administrator to get started.',

  // Task History
  COMPILING_HISTORY: 'Compiling Task History...',
  NO_TASK_HISTORY: 'No Task History',
  NO_TASK_HISTORY_DESC:
    "We couldn't find any tasks associated with your projects in the system history.",
  DUE_DATE_OUTSIDE_SPRINT: 'Due date is outside the sprint range',
  UNASSIGNED: 'Unassigned',
  NONE: 'None',
};

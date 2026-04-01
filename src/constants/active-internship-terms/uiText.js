export const ACTIVE_TERM_UI = {
  TITLE: 'Active Internship Terms',
  PAGE_SUBTITLE: 'Ongoing terms across partner universities—track deadlines and progress.',
  FILTER: {
    UNIVERSITY_LABEL: 'Filter by University:',
    ALL_UNIVERSITIES: 'All Universities',
  },
  STATUS: {
    ACTIVE: 'ACTIVE',
    REMAINING: (days) => `${days} DAYS REMAINING`,
    URGENT: (days) => `URGENT: ${days} DAYS LEFT`,
    TODAY: 'TODAY',
  },
  DATE: {
    START: 'Start Date:',
    END: 'End Date:',
  },
  DEADLINE: {
    LABEL_1: 'GRADING DEADLINE',
    LABEL_2: 'REPORT DEADLINE',
    IMPORTANT_TITLE: 'IMPORTANT DEADLINES',
  },
  PROGRESS: {
    TITLE: 'TERM PROGRESS',
    DAYS_LEFT: ' days left',
  },
  EMPTY: 'No active internship terms found',
  ERROR: 'An error occurred while loading internship terms',
};

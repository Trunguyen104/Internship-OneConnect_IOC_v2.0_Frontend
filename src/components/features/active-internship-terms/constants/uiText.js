export const ACTIVE_TERM_UI = {
  TITLE: 'Active Internship Terms',
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
  },
  EMPTY: 'No active internship terms found',
  ERROR: 'An error occurred while loading internship terms',
};

export const STATUS_COLORS = {
  ACTIVE: '#52c41a', // Ant Design Green
  REMAINING: '#1890ff', // Ant Design Blue
  URGENT: '#f5222d', // Ant Design Red
};

export const PUBLIC_HOLIDAY_UI = {
  TITLE: 'Public Holidays',
  DESCRIPTION: 'Manage national public holidays used for system calculations.',

  CREATE_BUTTON: 'Add Holiday',
  SYNC_BUTTON: 'Sync from API',
  SYNC_DESC: 'Automatically import all public holidays for the current year.',
  LOADING: 'Loading holidays...',

  TABLE: {
    DATE: 'Date',
    DESCRIPTION: 'Holiday Name / Description',
    ACTION: 'Actions',
  },

  MODAL: {
    CREATE_TITLE: 'Add Public Holiday',
    CREATE_DESC: 'Manually add a single holiday entry.',
    CANCEL: 'Cancel',
    SUBMIT: 'Add Holiday',
    SYNC_TITLE: 'Sync Public Holidays',
    SYNC_PROMPT: 'Are you sure you want to sync holidays for {year}?',
    SYNC_SUCCESS: 'Holidays synchronized successfully!',
    SYNC_ERROR: 'Failed to synchronize holidays.',
  },

  FORM: {
    DATE: 'Holiday Date',
    DESCRIPTION: 'Description',
    PLACEHOLDER_DATE: 'Select date',
    PLACEHOLDER_DESC: 'Enter holiday name...',
    VALIDATION: {
      DATE_REQUIRED: 'Please select a date',
      DESC_MAX: 'Maximum 200 characters',
    },
  },

  DELETE_MODAL: {
    TITLE: 'Delete Holiday',
    CONTENT: 'Are you sure you want to delete this public holiday?',
    CONFIRM: 'Delete',
    CANCEL: 'Cancel',
  },

  SUCCESS: {
    CREATE: 'Holiday added successfully!',
    DELETE: 'Holiday deleted successfully!',
    SYNC: 'Sync complete: {count} holidays imported!',
  },
};

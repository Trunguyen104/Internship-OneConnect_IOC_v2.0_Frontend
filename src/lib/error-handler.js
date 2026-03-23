/**
 * BE Error Handler & Mapper
 * Translates technical status codes and BE messages into intuitive UX strings.
 */
export const mapBackendError = (error) => {
  if (!error) return null;

  const status = error.status;
  const beData = error.data;
  const beMessage = beData?.message || beData?.detail || error.message;
  const beTitle = beData?.title || null;

  switch (status) {
    case 400:
      return {
        title: beTitle || 'Validation Failed',
        message: beMessage || 'The server could not process your request due to invalid inputs.',
        type: 'warning',
      };
    case 401:
      return {
        title: 'Authentication Required',
        message: 'Your session has expired or is invalid. Please log in again to continue.',
        type: 'error',
      };
    case 403:
      return {
        title: 'Access Denied',
        message:
          beMessage || 'You do not have permission to view this resource or perform this action.',
        type: 'error',
      };
    case 404:
      return {
        title: 'Not Found',
        message: beMessage || 'The requested resource was not found on our servers.',
        type: 'info',
      };
    case 409:
      return {
        title: 'Conflict Detected',
        message:
          beMessage || 'This record might already exist or is in conflict with another entry.',
        type: 'warning',
      };
    case 422:
      return {
        title: 'Unprocessable Entity',
        message:
          beMessage || 'Your submission contains semantic errors. Please review the details below.',
        type: 'error',
      };
    case 429:
      return {
        title: 'Rate Limit Exceeded',
        message:
          'Too many requests in a short time. Please slow down and try again in a few minutes.',
        type: 'warning',
      };
    case 500:
    case 502:
    case 503:
    case 504:
      // If BE explicitly tells us why it failed (even with 500), show it.
      // Often used for DB constraints that aren't caught correctly as 409.
      if (
        beMessage?.toLowerCase().includes('duplicate') ||
        beMessage?.toLowerCase().includes('already exists') ||
        beMessage?.toLowerCase().includes('conflict')
      ) {
        return {
          title: 'Conflict Detected',
          message: beMessage,
          type: 'warning',
        };
      }
      return {
        title: beTitle || 'System Error',
        message:
          beMessage ||
          'We are experiencing internal technical difficulties. Our team has been notified.',
        type: 'error',
      };
    default:
      return {
        title: beTitle || 'Communication Error',
        message: beMessage || 'An unexpected error occurred during the API request.',
        type: 'error',
      };
  }
};
